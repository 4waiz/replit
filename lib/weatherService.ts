// weatherService — fetches live conditions from Open-Meteo (no API key required).
// Uses a fixed Abu Dhabi worksite coordinate. Falls back to realistic UAE demo
// conditions if the network or API is unavailable so the demo never breaks.

export type Weather = {
  tempC: number;
  humidity: number; // %
  uvIndex: number;
  windKph: number;
  hour: number; // local hour 0-23
  locationName: string;
  isLive: boolean; // true = fetched from Open-Meteo, false = demo fallback
};

// Fixed worksite: Abu Dhabi, UAE.
const SITE = {
  lat: 24.4539,
  lon: 54.3773,
  name: 'Abu Dhabi Worksite',
};

// Realistic UAE peak-summer fallback (matches the spec).
export const DEMO_WEATHER: Weather = {
  tempC: 43,
  humidity: 52,
  uvIndex: 10,
  windKph: 9,
  hour: 13,
  locationName: 'Abu Dhabi · Demo Site',
  isLive: false,
};

const OPEN_METEO =
  `https://api.open-meteo.com/v1/forecast?latitude=${SITE.lat}&longitude=${SITE.lon}` +
  `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,uv_index` +
  `&wind_speed_unit=kmh&timezone=auto`;

export async function fetchWeather(): Promise<Weather> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(OPEN_METEO, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const data = await res.json();
    const c = data?.current;
    if (!c || typeof c.temperature_2m !== 'number') throw new Error('bad payload');

    // Local hour from the API's ISO time string ("2026-06-14T13:00").
    const hour = typeof c.time === 'string' ? parseInt(c.time.slice(11, 13), 10) : new Date().getHours();

    return {
      tempC: Math.round(c.temperature_2m),
      humidity: Math.round(c.relative_humidity_2m ?? DEMO_WEATHER.humidity),
      uvIndex: Math.round((c.uv_index ?? DEMO_WEATHER.uvIndex) * 10) / 10,
      windKph: Math.round(c.wind_speed_10m ?? DEMO_WEATHER.windKph),
      hour: Number.isFinite(hour) ? hour : 13,
      locationName: SITE.name,
      isLive: true,
    };
  } catch {
    // Network/API failure → safe demo conditions.
    return { ...DEMO_WEATHER };
  }
}
