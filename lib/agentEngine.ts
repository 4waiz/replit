// agentEngine — orchestrates the four Starkz AI safety agents.
//
// Pipeline:
//   1. computeRisk() runs the deterministic heat engine on real weather + work type.
//   2. Groq (llama-3.3-70b) turns those numbers into natural agent reasoning,
//      a supervisor decision and multilingual worker alerts.
//   3. If Groq is unavailable, deterministic templates produce the same shape,
//      so the demo always yields a believable, fully-populated result.

import { Weather } from './weatherService';
import { computeRisk, breakSchedule, RiskBreakdown } from './heatRiskEngine';
import { getWorkType } from '@/constants/workTypes';
import { RiskLevel } from '@/constants/colors';
import { groqChat, groqEnabled, safeJson } from './groqService';

export type AgentId = 'weather' | 'workload' | 'schedule' | 'comms';

export type AgentReport = {
  id: AgentId;
  name: string;
  icon: string;
  evidence: string;
  decision: string;
  confidence: number; // 0-100
};

export type WorkerAlert = {
  language: string;
  code: 'EN' | 'AR' | 'HI' | 'UR';
  text: string;
  rtl: boolean;
};

export type AnalysisResult = {
  workTypeId: string;
  workTypeLabel: string;
  hasPhoto: boolean;
  weather: Weather;
  risk: RiskBreakdown;
  riskScore: number;
  riskLevel: RiskLevel;
  supervisorAction: string;
  taskAdjustment: string;
  visualChecklist: string[];
  breakSchedule: { time: string; activity: string }[];
  agents: AgentReport[];
  workerAlerts: WorkerAlert[];
  reasoningSummary: string;
  poweredByGroq: boolean;
  generatedAtLabel: string; // formatted by the screen (no Date.now in lib)
};

const AGENT_META: Record<AgentId, { name: string; icon: string }> = {
  weather: { name: 'Weather Risk Agent', icon: 'thermometer' },
  workload: { name: 'Workload Agent', icon: 'barbell' },
  schedule: { name: 'Schedule Agent', icon: 'time' },
  comms: { name: 'Communication Agent', icon: 'chatbubbles' },
};

// ── Deterministic fallback reasoning ────────────────────────────
function deterministicAgents(weather: Weather, workId: string, risk: RiskBreakdown): AgentReport[] {
  const work = getWorkType(workId);
  const w = weather;
  const windDesc = w.windKph < 10 ? 'low wind' : `${w.windKph} km/h wind`;
  const timeDesc = risk.middayExposure ? 'midday peak-sun exposure' : 'daytime exposure';

  return [
    {
      id: 'weather',
      ...AGENT_META.weather,
      evidence: `${w.tempC}°C, UV ${w.uvIndex}, ${windDesc}, ${timeDesc}. Heat index feels like ${risk.heatIndexC}°C.`,
      decision:
        risk.level === 'Critical'
          ? 'Critical heat exposure risk'
          : risk.level === 'High'
          ? 'High heat exposure risk'
          : `${risk.level} heat exposure risk`,
      confidence: clampConf(78 + Math.round(risk.weatherScore * 0.18)),
    },
    {
      id: 'workload',
      ...AGENT_META.workload,
      evidence: `${work.label} selected: ${work.exposure.toLowerCase()}.`,
      decision:
        risk.level === 'Critical' || risk.level === 'High'
          ? `Add shaded rotation and shorten outdoor intervals for ${work.label.toLowerCase()} crews`
          : `Maintain standard rotation for ${work.label.toLowerCase()} crews`,
      confidence: clampConf(80 + Math.round((work.weight - 1) * 40)),
    },
    {
      id: 'schedule',
      ...AGENT_META.schedule,
      evidence: `${risk.level} heat with ${risk.fatigueRisk}/100 fatigue load.`,
      decision:
        risk.level === 'Critical'
          ? 'Hydration every 15 min, shaded break every 20 min'
          : risk.level === 'High'
          ? 'Hydration every 20 min, shaded break every 30 min'
          : 'Hydration every 30 min, rest as needed',
      confidence: clampConf(82 + Math.round(risk.hydrationUrgency * 0.08)),
    },
    {
      id: 'comms',
      ...AGENT_META.comms,
      evidence: 'Crew may include English, Arabic, Hindi and Urdu speakers.',
      decision: 'Generate multilingual worker safety alert',
      confidence: 95,
    },
  ];
}

function clampConf(n: number): number {
  return Math.max(60, Math.min(98, Math.round(n)));
}

function deterministicSupervisorAction(level: RiskLevel): string {
  switch (level) {
    case 'Critical':
      return 'Stop heavy outdoor work during peak sun. Rotate crew off exposed tasks immediately.';
    case 'High':
      return 'Limit exposed work. Rotate crew through shaded tasks and enforce hydration.';
    case 'Moderate':
      return 'Maintain hydration discipline and watch crew for early heat-stress signs.';
    default:
      return 'Standard precautions. Keep water available and monitor conditions.';
  }
}

function deterministicTaskAdjustment(workId: string): string {
  const work = getWorkType(workId);
  const map: Record<string, string> = {
    construction: 'Move lifting, roofing and exposed concrete work to early morning or evening.',
    delivery: 'Schedule long outdoor routes before 11 AM and after 4 PM; add shaded stops.',
    landscaping: 'Front-load mowing, planting and trimming to cooler morning hours.',
    security: 'Move long static posts to shaded or indoor positions during peak heat.',
    maintenance: 'Defer reflective-roof and hot-equipment work to early morning.',
    events: 'Schedule rigging and heavy lifting before the peak-sun window.',
  };
  return map[work.id] ?? map.construction;
}

function visualChecklist(workId: string, hasPhoto: boolean): string[] {
  const work = getWorkType(workId);
  const base = [
    'Shade availability assessed near the work zone',
    'Drinking water access confirmed on-site',
    `Direct-sun exposure typical of ${work.label.toLowerCase()} work`,
  ];
  return hasPhoto
    ? ['Photo captured. Visual checklist applied.', ...base]
    : ['No photo provided. Checklist based on work type and weather.', ...base];
}

const FALLBACK_ALERTS: WorkerAlert[] = [
  {
    language: 'English',
    code: 'EN',
    rtl: false,
    text: 'High heat risk today. Drink water every 15 minutes, take shade breaks, and report dizziness or cramps immediately.',
  },
  {
    language: 'العربية',
    code: 'AR',
    rtl: true,
    text: 'خطر حرارة مرتفع اليوم. اشرب الماء كل ١٥ دقيقة، وخذ فترات راحة في الظل، وأبلغ فورًا عن الدوخة أو التشنجات.',
  },
  {
    language: 'हिन्दी',
    code: 'HI',
    rtl: false,
    text: 'आज अधिक गर्मी का खतरा है। हर 15 मिनट में पानी पिएं, छाया में आराम करें, और चक्कर या ऐंठन होने पर तुरंत बताएं।',
  },
  {
    language: 'اردو',
    code: 'UR',
    rtl: true,
    text: 'آج گرمی کا زیادہ خطرہ ہے۔ ہر 15 منٹ میں پانی پئیں، سایہ میں وقفہ لیں، اور چکر یا اکڑاؤ ہونے پر فوراً اطلاع دیں۔',
  },
];

// ── Groq enrichment ─────────────────────────────────────────────
type GroqShape = {
  agents?: { id: AgentId; evidence: string; decision: string; confidence: number }[];
  supervisorAction?: string;
  taskAdjustment?: string;
  reasoningSummary?: string;
  alerts?: { code: string; text: string }[];
};

async function groqEnrich(
  weather: Weather,
  workId: string,
  risk: RiskBreakdown,
  hasPhoto: boolean
): Promise<GroqShape | null> {
  const work = getWorkType(workId);
  const system =
    'You are Starkz AI, a field heat-safety agent for outdoor worksites in the Gulf. ' +
    'You receive sensor numbers and must return concise, professional, operational safety reasoning. ' +
    'Never invent weather values — use only the numbers given. Be specific and decisive. Return ONLY valid JSON.';

  const user = JSON.stringify({
    instruction:
      'Produce safety reasoning for four agents and crew alerts. Keep every text field short and operational.',
    weather: {
      tempC: weather.tempC,
      humidity: weather.humidity,
      uvIndex: weather.uvIndex,
      windKph: weather.windKph,
      hour: weather.hour,
      heatIndexC: risk.heatIndexC,
    },
    workType: work.label,
    workExposure: work.exposure,
    photoProvided: hasPhoto,
    computed: { riskScore: risk.score, riskLevel: risk.level, fatigueRisk: risk.fatigueRisk },
    schema: {
      agents: [
        { id: 'weather', evidence: 'string', decision: 'string', confidence: '60-98' },
        { id: 'workload', evidence: 'string', decision: 'string', confidence: '60-98' },
        { id: 'schedule', evidence: 'string', decision: 'string', confidence: '60-98' },
        { id: 'comms', evidence: 'string', decision: 'string', confidence: '60-98' },
      ],
      supervisorAction: 'one decisive sentence',
      taskAdjustment: 'one sentence on which tasks to move/cut',
      reasoningSummary: 'two sentences explaining the overall decision',
      alerts: [
        { code: 'EN', text: 'English worker alert' },
        { code: 'AR', text: 'Arabic worker alert (Arabic script)' },
        { code: 'HI', text: 'Hindi worker alert (Devanagari)' },
        { code: 'UR', text: 'Urdu worker alert (Urdu script)' },
      ],
    },
  });

  try {
    const raw = await groqChat({ system, user, json: true, temperature: 0.5, maxTokens: 900 });
    return safeJson<GroqShape>(raw);
  } catch {
    return null;
  }
}

// ── Public entry point ──────────────────────────────────────────
export async function runAnalysis(
  weather: Weather,
  workId: string,
  hasPhoto: boolean
): Promise<AnalysisResult> {
  const work = getWorkType(workId);
  const risk = computeRisk(weather, workId, hasPhoto);

  let agents = deterministicAgents(weather, workId, risk);
  let supervisorAction = deterministicSupervisorAction(risk.level);
  let taskAdjustment = deterministicTaskAdjustment(workId);
  let alerts = FALLBACK_ALERTS;
  let reasoningSummary =
    `Real weather (${weather.tempC}°C, UV ${weather.uvIndex}) combined with ${work.label.toLowerCase()} workload ` +
    `puts site risk at ${risk.score}/100 — ${risk.level}. Break cadence and crew alerts adjusted accordingly.`;
  let poweredByGroq = false;

  if (groqEnabled()) {
    const enriched = await groqEnrich(weather, workId, risk, hasPhoto);
    if (enriched) {
      poweredByGroq = true;
      if (enriched.agents?.length) {
        agents = agents.map((base) => {
          const g = enriched.agents!.find((a) => a.id === base.id);
          return g
            ? {
                ...base,
                evidence: g.evidence?.trim() || base.evidence,
                decision: g.decision?.trim() || base.decision,
                confidence: clampConf(g.confidence ?? base.confidence),
              }
            : base;
        });
      }
      if (enriched.supervisorAction?.trim()) supervisorAction = enriched.supervisorAction.trim();
      if (enriched.taskAdjustment?.trim()) taskAdjustment = enriched.taskAdjustment.trim();
      if (enriched.reasoningSummary?.trim()) reasoningSummary = enriched.reasoningSummary.trim();
      if (enriched.alerts?.length) {
        alerts = FALLBACK_ALERTS.map((base) => {
          const g = enriched.alerts!.find((a) => a.code?.toUpperCase() === base.code);
          return g?.text?.trim() ? { ...base, text: g.text.trim() } : base;
        });
      }
    }
  }

  return {
    workTypeId: workId,
    workTypeLabel: work.label,
    hasPhoto,
    weather,
    risk,
    riskScore: risk.score,
    riskLevel: risk.level,
    supervisorAction,
    taskAdjustment,
    visualChecklist: visualChecklist(workId, hasPhoto),
    breakSchedule: breakSchedule(risk.level),
    agents,
    workerAlerts: alerts,
    reasoningSummary,
    poweredByGroq,
    generatedAtLabel: '',
  };
}
