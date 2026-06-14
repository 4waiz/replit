// heatRiskEngine — turns real weather + work type into a defensible 0-100 risk
// score with sub-scores. This is genuine logic, not a lookup table.

import { Weather } from './weatherService';
import { RiskLevel } from '@/constants/colors';
import { WorkType, getWorkType } from '@/constants/workTypes';

export type RiskBreakdown = {
  score: number; // 0-100 final risk
  level: RiskLevel;
  heatExposure: number; // 0-100
  fatigueRisk: number; // 0-100
  hydrationUrgency: number; // 0-100
  heatIndexC: number; // apparent temperature
  // Component sub-scores (0-100) — surfaced as agent evidence.
  weatherScore: number;
  uvScore: number;
  humidityScore: number;
  middayExposure: boolean;
};

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));

// NOAA-style heat index approximation (°C in / °C out), valid for hot/humid air.
function heatIndexC(tempC: number, humidity: number): number {
  if (tempC < 27) return tempC;
  const T = (tempC * 9) / 5 + 32; // → °F
  const R = humidity;
  let HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T * T -
    0.05481717 * R * R +
    0.00122874 * T * T * R +
    0.00085282 * T * R * R -
    0.00000199 * T * T * R * R;
  return Math.round((((HI - 32) * 5) / 9) * 10) / 10; // → °C
}

export function computeRisk(weather: Weather, workTypeId: string, hasPhoto: boolean): RiskBreakdown {
  const work: WorkType = getWorkType(workTypeId);
  const { tempC, humidity, uvIndex, windKph, hour } = weather;

  // ── Component scores ──────────────────────────────────────────
  // Temperature: ramps from 28°C (mild) to 48°C (extreme).
  const weatherScore = clamp(((tempC - 28) / (48 - 28)) * 100);

  // UV: 0-11+ scale → 0-100.
  const uvScore = clamp((uvIndex / 11) * 100);

  // Humidity raises apparent heat; only meaningful when it's already hot.
  const humidityScore = clamp(tempC >= 32 ? ((humidity - 25) / (70 - 25)) * 100 : humidity * 0.4);

  // Wind provides mild cooling relief (caps at ~15 km/h benefit).
  const windRelief = clamp((Math.min(windKph, 15) / 15) * 14, 0, 14);

  // Midday peak-sun window amplifies everything.
  const midday = hour >= 11 && hour <= 16;
  const middayBoost = midday ? 8 : hour >= 9 && hour <= 18 ? 3 : 0;

  // ── Base environmental risk (weighted blend) ──────────────────
  const envBase =
    weatherScore * 0.5 + uvScore * 0.28 + humidityScore * 0.22 + middayBoost - windRelief;

  // Work-type multiplier (e.g. Construction 1.18).
  let score = envBase * work.weight;

  // A captured photo means a real visual checklist was applied → small confidence bump.
  if (hasPhoto) score += 2;

  score = clamp(Math.round(score));

  const hi = heatIndexC(tempC, humidity);

  // ── Derived sub-scores ────────────────────────────────────────
  const heatExposure = clamp(Math.round(weatherScore * 0.6 + uvScore * 0.4 + (midday ? 6 : 0)));
  const fatigueRisk = clamp(Math.round(envBase * 0.7 * work.weight + (midday ? 6 : 0)));
  const hydrationUrgency = clamp(Math.round(weatherScore * 0.55 + humidityScore * 0.45 + 8));

  return {
    score,
    level: riskLevel(score),
    heatExposure,
    fatigueRisk,
    hydrationUrgency,
    heatIndexC: hi,
    weatherScore: Math.round(weatherScore),
    uvScore: Math.round(uvScore),
    humidityScore: Math.round(humidityScore),
    middayExposure: midday,
  };
}

export function riskLevel(score: number): RiskLevel {
  if (score >= 85) return 'Critical';
  if (score >= 65) return 'High';
  if (score >= 40) return 'Moderate';
  return 'Low';
}

// Break / hydration cadence scales with risk level.
export function breakSchedule(level: RiskLevel): { time: string; activity: string }[] {
  if (level === 'Critical') {
    return [
      { time: 'Every 15 min', activity: 'Hydration — cool water in reach' },
      { time: 'Every 20 min', activity: 'Mandatory shade break' },
      { time: '12 PM – 4 PM', activity: 'Stop heavy outdoor work' },
    ];
  }
  if (level === 'High') {
    return [
      { time: 'Every 20 min', activity: 'Hydration break' },
      { time: 'Every 30 min', activity: 'Rotate into shade' },
      { time: '12 PM – 3 PM', activity: 'Limit exposed tasks' },
    ];
  }
  if (level === 'Moderate') {
    return [
      { time: 'Every 30 min', activity: 'Hydration break' },
      { time: 'Every 45 min', activity: 'Short shade rest' },
    ];
  }
  return [
    { time: 'Every 45 min', activity: 'Hydration check' },
    { time: 'As needed', activity: 'Rest in shade' },
  ];
}
