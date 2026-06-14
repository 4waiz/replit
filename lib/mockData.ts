export type WorkType = {
  id: string;
  label: string;
  icon: string;
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  iconName: string;
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
  riskLevel: 'High' | 'Critical';
  heatExposure: number;
  fatigueRisk: number;
  primaryAction: string;
  supervisorAction: string;
  taskAdjustment: string;
  breakSchedule: { time: string; activity: string }[];
  topRisks: string[];
  mitigation: string[];
  workerMessages: SafetyMessage[];
};

export const workTypes: WorkType[] = [
  { id: 'construction', label: 'Construction', icon: 'construct' },
  { id: 'delivery', label: 'Delivery', icon: 'bicycle' },
  { id: 'landscaping', label: 'Landscaping', icon: 'leaf' },
  { id: 'security', label: 'Security', icon: 'shield' },
  { id: 'maintenance', label: 'Maintenance', icon: 'build' },
  { id: 'events', label: 'Event Setup', icon: 'flag' },
];

export const agents: Agent[] = [
  {
    id: 'heat',
    name: 'Heat Sentinel',
    role: 'Monitors temperature & UV risk',
    iconName: 'thermometer',
  },
  {
    id: 'schedule',
    name: 'Shift Planner',
    role: 'Builds break & rotation plans',
    iconName: 'calendar',
  },
  {
    id: 'comms',
    name: 'Crew Translator',
    role: 'Multilingual safety alerts',
    iconName: 'chatbubbles',
  },
];

export const loadingSteps: string[] = [
  'Scanning worksite for hazards...',
  'Estimating heat exposure...',
  'Calculating fatigue risk...',
  'Building break schedule...',
  'Generating multilingual alert...',
];

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
    primaryAction: 'Rotate crew now',
    supervisorAction: 'Pause heavy lifting. Move crew to shaded tasks until temperatures drop.',
    taskAdjustment: 'Move concrete carrying and outdoor lifting to early morning or evening.',
    topRisks: [
      'Heavy manual labor in direct sun',
      'Reflected heat from concrete and metal',
      'Insufficient shaded rest areas',
      'Dehydration during continuous lifting',
    ],
  },
  delivery: {
    riskScore: 82,
    heatExposure: 88,
    fatigueRisk: 80,
    primaryAction: 'Add route rest stops',
    supervisorAction: 'Insert shaded stops along routes. Stagger deliveries away from peak-sun window.',
    taskAdjustment: 'Schedule long outdoor routes before 11 AM and after 4 PM.',
    topRisks: [
      'Prolonged sun exposure between stops',
      'Hot vehicle cabins between deliveries',
      'Limited access to water on the road',
      'Carrying loads across exposed pavement',
    ],
  },
  landscaping: {
    riskScore: 84,
    heatExposure: 90,
    fatigueRisk: 82,
    primaryAction: 'Shorten outdoor shifts',
    supervisorAction: 'Cap continuous outdoor exposure. Rotate workers into shaded prep tasks.',
    taskAdjustment: 'Front-load mowing, planting, and trimming to cooler morning hours.',
    topRisks: [
      'Prolonged uninterrupted outdoor exposure',
      'No natural shade on open sites',
      'Repetitive exertion in full sun',
      'Slow onset of heat exhaustion',
    ],
  },
  security: {
    riskScore: 79,
    heatExposure: 86,
    fatigueRisk: 78,
    primaryAction: 'Rotate guard posts',
    supervisorAction: 'Rotate guards off exposed posts on a tight cycle. Provide shaded standing points.',
    taskAdjustment: 'Move long static posts to shaded or indoor positions during peak heat.',
    topRisks: [
      'Long standing periods with little movement',
      'Static exposure at unshaded posts',
      'Dark uniforms absorbing heat',
      'Reduced alertness from heat fatigue',
    ],
  },
  maintenance: {
    riskScore: 81,
    heatExposure: 89,
    fatigueRisk: 79,
    primaryAction: 'Cool surfaces first',
    supervisorAction: 'Check surface temperatures before contact. Provide cooling gear for hot equipment.',
    taskAdjustment: 'Defer work on reflective roofs and hot equipment to early morning.',
    topRisks: [
      'Burns from hot equipment and surfaces',
      'Reflective surfaces amplifying heat',
      'Confined hot spaces with poor airflow',
      'Heat radiating from machinery',
    ],
  },
  events: {
    riskScore: 83,
    heatExposure: 87,
    fatigueRisk: 85,
    primaryAction: 'Stage lifting in shade',
    supervisorAction: 'Move staging and heavy lifting into shaded zones. Add crew during setup peaks.',
    taskAdjustment: 'Schedule rigging and heavy lifting before the crowd and peak-sun window.',
    topRisks: [
      'Repeated lifting during tight setup windows',
      'Open venues with minimal shade',
      'Time pressure pushing crews past limits',
      'Standing on hot tarmac and turf',
    ],
  },
};

const baseMitigation: string[] = [
  'Rotate workers off direct-sun tasks every 20 minutes.',
  'Enforce hydration every 15 minutes — cool water within reach.',
  'Set up shaded rest zones close to the work area.',
  'Watch for dizziness, cramps, or confusion — act immediately.',
];

const baseMessages: SafetyMessage[] = [
  {
    language: 'English',
    code: 'EN',
    text: 'High heat risk detected. Drink water now, take shade breaks, and report dizziness immediately.',
  },
  {
    language: 'العربية',
    code: 'AR',
    rtl: true,
    text: 'تم اكتشاف خطر حرارة مرتفع. اشرب الماء الآن، وخذ فترات راحة في الظل، وأبلغ فورًا عن أي دوخة.',
  },
  {
    language: 'हिन्दी',
    code: 'HI',
    text: 'अधिक गर्मी का जोखिम मिला है। अभी पानी पिएं, छाया में आराम करें, और चक्कर आने पर तुरंत बताएं।',
  },
  {
    language: 'اردو',
    code: 'UR',
    rtl: true,
    text: 'زیادہ گرمی کا خطرہ پایا گیا ہے۔ ابھی پانی پئیں، سایہ میں وقفہ لیں، اور چکر آنے پر فوراً اطلاع دیں۔',
  },
];

export function getAnalysis(workTypeId: string): AnalysisResult {
  const type = workTypes.find((w) => w.id === workTypeId) ?? workTypes[0];
  const profile = profiles[type.id] ?? profiles.construction;
  return {
    workType: type.label,
    riskScore: profile.riskScore,
    riskLevel: profile.riskScore >= 85 ? 'Critical' : 'High',
    heatExposure: profile.heatExposure,
    fatigueRisk: profile.fatigueRisk,
    primaryAction: profile.primaryAction,
    supervisorAction: profile.supervisorAction,
    taskAdjustment: profile.taskAdjustment,
    breakSchedule: [
      { time: 'Every 20 min', activity: 'Rotate into shade' },
      { time: 'Every 15 min', activity: 'Hydration break' },
      { time: '12 PM – 4 PM', activity: 'Pause heavy outdoor tasks' },
    ],
    topRisks: profile.topRisks,
    mitigation: baseMitigation,
    workerMessages: baseMessages,
  };
}
