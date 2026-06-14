// Deterministic mock intelligence for the Starkz AI demo.
// No real AI / API yet — values are crafted to feel realistic and shift
// slightly per work type so the demo stays lively but always reliable.

export type WorkType = {
  id: string;
  label: string;
  icon: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  icon: string;
};

export type Metric = {
  label: string;
  value: number; // 0-100
  unit?: string;
  tone: "critical" | "high" | "moderate";
};

export type SafetyMessage = {
  language: string;
  code: string;
  text: string;
  rtl?: boolean;
};

export type AnalysisResult = {
  workType: string;
  riskScore: number;
  riskLevel: string;
  heatExposure: number;
  fatigueRisk: number;
  breakNeeded: string;
  primaryAction: string;
  breakSchedule: { time: string; activity: string }[];
  supervisorAction: string;
  taskAdjustment: string;
  topRisks: string[];
  mitigation: string[];
  workerMessages: SafetyMessage[];
};

// A self-contained demo worksite image (inline SVG data URI) so the live
// demo always works with zero network — a stylized sunny UAE construction site.
export const DEMO_WORKSITE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fdba74"/>
          <stop offset="0.6" stop-color="#fb923c"/>
          <stop offset="1" stop-color="#f59e0b"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#sky)"/>
      <circle cx="640" cy="130" r="80" fill="#fff7ed" opacity="0.95"/>
      <circle cx="640" cy="130" r="120" fill="#fef3c7" opacity="0.35"/>
      <rect y="430" width="800" height="170" fill="#d97706"/>
      <rect y="430" width="800" height="170" fill="#b45309" opacity="0.3"/>
      <rect x="90" y="200" width="150" height="230" fill="#78716c"/>
      <rect x="105" y="220" width="40" height="40" fill="#fde68a"/>
      <rect x="185" y="220" width="40" height="40" fill="#fde68a"/>
      <rect x="105" y="290" width="40" height="40" fill="#fde68a"/>
      <rect x="185" y="290" width="40" height="40" fill="#fde68a"/>
      <rect x="500" y="150" width="120" height="280" fill="#57534e"/>
      <rect x="515" y="175" width="35" height="35" fill="#fde68a"/>
      <rect x="575" y="175" width="35" height="35" fill="#fde68a"/>
      <g stroke="#1c1917" stroke-width="10" fill="none">
        <line x1="360" y1="100" x2="360" y2="430"/>
        <line x1="360" y1="100" x2="470" y2="100"/>
        <line x1="470" y1="100" x2="470" y2="160"/>
      </g>
      <rect x="335" y="430" width="50" height="20" fill="#1c1917"/>
      <text x="400" y="560" font-family="Arial" font-size="34" font-weight="bold" fill="#fff7ed" text-anchor="middle" opacity="0.9">DEMO WORKSITE · 47°C</text>
    </svg>`,
  );

export const workTypes: WorkType[] = [
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "delivery", label: "Delivery", icon: "🚚" },
  { id: "landscaping", label: "Landscaping", icon: "🌿" },
  { id: "security", label: "Security", icon: "🛡️" },
  { id: "maintenance", label: "Maintenance", icon: "🔧" },
  { id: "events", label: "Event Setup", icon: "🎪" },
];

export const agents: Agent[] = [
  {
    id: "safety",
    name: "Safety Agent",
    role: "Detects immediate heat and site hazards",
    icon: "🛰️",
  },
  {
    id: "schedule",
    name: "Schedule Agent",
    role: "Adjusts breaks, rotations, and heavy tasks",
    icon: "🗓️",
  },
  {
    id: "comms",
    name: "Worker Communication Agent",
    role: "Creates multilingual safety alerts",
    icon: "💬",
  },
];

// The five cinematic loading lines, surfaced during analysis.
export const loadingSteps: string[] = [
  "Starkz agents are scanning the site...",
  "Estimating heat exposure...",
  "Calculating fatigue risk...",
  "Preparing safety plan...",
  "Generating multilingual worker alert...",
];

// Baseline multilingual worker alert (English / Arabic / Hindi / Urdu).
const baseWorkerMessages: SafetyMessage[] = [
  {
    language: "English",
    code: "EN",
    text: "High heat risk detected. Drink water now, take shade breaks, and report dizziness immediately.",
  },
  {
    language: "العربية",
    code: "AR",
    rtl: true,
    text: "تم اكتشاف خطر حرارة مرتفع. اشرب الماء الآن، وخذ فترات راحة في الظل، وأبلغ فورًا عن أي دوخة.",
  },
  {
    language: "हिन्दी",
    code: "HI",
    text: "अधिक गर्मी का जोखिम मिला है। अभी पानी पिएं, छाया में आराम करें, और चक्कर आने पर तुरंत बताएं।",
  },
  {
    language: "اردو",
    code: "UR",
    rtl: true,
    text: "زیادہ گرمی کا خطرہ پایا گیا ہے۔ ابھی پانی پئیں، سایہ میں وقفہ لیں، اور چکر آنے پر فوراً اطلاع دیں۔",
  },
];

// Per-work-type flavour. We tweak a couple of numbers and swap the
// headline risk/task language so each selection feels distinct.
type WorkProfile = {
  riskScore: number;
  heatExposure: number;
  fatigueRisk: number;
  primaryAction: string;
  supervisorAction: string;
  taskAdjustment: string;
  topRisks: string[];
};

const profiles: Record<string, WorkProfile> = {
  construction: {
    riskScore: 87,
    heatExposure: 92,
    fatigueRisk: 84,
    primaryAction: "Rotate crew now",
    supervisorAction:
      "Pause heavy lifting and move the crew to shaded tasks until temperatures drop.",
    taskAdjustment:
      "Move concrete carrying and outdoor lifting to early morning or evening.",
    topRisks: [
      "Heavy manual labor in direct sun",
      "Reflected heat from concrete and metal",
      "Insufficient shaded rest areas",
      "Dehydration during continuous lifting",
      "PPE trapping body heat",
    ],
  },
  delivery: {
    riskScore: 82,
    heatExposure: 88,
    fatigueRisk: 80,
    primaryAction: "Add route rest stops",
    supervisorAction:
      "Insert shaded rest stops along routes and stagger deliveries away from the peak-sun window.",
    taskAdjustment:
      "Schedule long outdoor routes before 11 AM and after 4 PM to cut sun exposure.",
    topRisks: [
      "Prolonged sun exposure between stops",
      "Route fatigue from continuous driving and walking",
      "Hot vehicle cabins between deliveries",
      "Limited access to water on the road",
      "Carrying loads across exposed pavement",
    ],
  },
  landscaping: {
    riskScore: 84,
    heatExposure: 90,
    fatigueRisk: 82,
    primaryAction: "Shorten outdoor shifts",
    supervisorAction:
      "Cap continuous outdoor exposure and rotate workers into shaded prep tasks.",
    taskAdjustment:
      "Front-load mowing, planting, and trimming to the cooler morning hours.",
    topRisks: [
      "Prolonged uninterrupted outdoor exposure",
      "No natural shade on open sites",
      "Heat from equipment and engines",
      "Repetitive exertion in full sun",
      "Slow onset of heat exhaustion",
    ],
  },
  security: {
    riskScore: 79,
    heatExposure: 86,
    fatigueRisk: 78,
    primaryAction: "Rotate guard posts",
    supervisorAction:
      "Rotate guards off exposed posts on a tight cycle and provide shaded standing points.",
    taskAdjustment:
      "Move long static posts to shaded or indoor positions during peak heat.",
    topRisks: [
      "Long standing periods with little movement",
      "Static exposure at unshaded posts",
      "Dark uniforms absorbing heat",
      "Reduced alertness from heat fatigue",
      "Limited hydration during shifts",
    ],
  },
  maintenance: {
    riskScore: 81,
    heatExposure: 89,
    fatigueRisk: 79,
    primaryAction: "Cool surfaces first",
    supervisorAction:
      "Check surface temperatures before contact tasks and provide cooling gear for hot equipment.",
    taskAdjustment:
      "Defer work on reflective roofs and hot equipment to early morning.",
    topRisks: [
      "Burns from hot equipment and surfaces",
      "Reflective surfaces amplifying heat",
      "Confined hot spaces with poor airflow",
      "Heavy tools increasing exertion",
      "Heat radiating from machinery",
    ],
  },
  events: {
    riskScore: 83,
    heatExposure: 87,
    fatigueRisk: 85,
    primaryAction: "Stage lifting in shade",
    supervisorAction:
      "Move staging and heavy lifting into shaded zones and add crew during setup peaks.",
    taskAdjustment:
      "Schedule rigging and heavy lifting before the crowd and peak-sun window.",
    topRisks: [
      "Repeated lifting during tight setup windows",
      "Crowded outdoor staging with little airflow",
      "Open venues with minimal shade",
      "Time pressure pushing crews past limits",
      "Standing on hot tarmac and turf",
    ],
  },
};

const baseMitigation: string[] = [
  "Rotate workers off direct-sun tasks every 20 minutes.",
  "Provide cool water within reach and enforce hydration every 15 minutes.",
  "Set up shaded rest zones close to the work area.",
  "Watch for dizziness, cramps, or confusion and act immediately.",
];

export function getAnalysis(workTypeId: string): AnalysisResult {
  const type = workTypes.find((w) => w.id === workTypeId) ?? workTypes[0];
  const profile = profiles[type.id] ?? profiles.construction;

  return {
    workType: type.label,
    riskScore: profile.riskScore,
    riskLevel: profile.riskScore >= 85 ? "Critical" : "High",
    heatExposure: profile.heatExposure,
    fatigueRisk: profile.fatigueRisk,
    breakNeeded: "20 min",
    primaryAction: profile.primaryAction,
    breakSchedule: [
      { time: "Every 20 min", activity: "Rotate workers into shade" },
      { time: "Every 15 min", activity: "Hydration break — drink water" },
      { time: "Peak 12–4 PM", activity: "Pause heavy outdoor tasks" },
    ],
    supervisorAction: profile.supervisorAction,
    taskAdjustment: profile.taskAdjustment,
    topRisks: profile.topRisks,
    mitigation: baseMitigation,
    workerMessages: baseWorkerMessages,
  };
}
