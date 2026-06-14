export type WorkType = {
  id: string;
  label: string;
  icon: string;
};

export type RiskMetric = {
  label: string;
  value: string;
  level: "low" | "moderate" | "high";
};

export type Agent = {
  id: string;
  name: string;
  role: string;
  icon: string;
  status: string;
};

export const workTypes: WorkType[] = [
  { id: "construction", label: "Construction", icon: "🏗️" },
  { id: "delivery", label: "Delivery", icon: "🚚" },
  { id: "landscaping", label: "Landscaping", icon: "🌿" },
  { id: "roofing", label: "Roofing", icon: "🏠" },
  { id: "agriculture", label: "Agriculture", icon: "🌾" },
  { id: "events", label: "Event Setup", icon: "🎪" },
];

export const riskMetrics: RiskMetric[] = [
  { label: "Heat Risk", value: "High", level: "high" },
  { label: "Fatigue Risk", value: "Moderate", level: "moderate" },
  { label: "Hydration", value: "Low", level: "low" },
];

export const taskAdjustments: string[] = [
  "Shift heavy lifting to before 10:00 AM.",
  "Rotate workers off direct-sun tasks every 30 minutes.",
  "Pause non-critical work during the 1–4 PM peak.",
];

export const breakSchedule: { time: string; activity: string }[] = [
  { time: "09:30", activity: "10 min shade + water break" },
  { time: "11:00", activity: "15 min cool-down break" },
  { time: "13:00", activity: "30 min indoor lunch break" },
  { time: "15:00", activity: "15 min shade + water break" },
];

export const safetyMessage: { language: string; text: string }[] = [
  {
    language: "English",
    text: "Heat is high today. Drink water every 20 minutes and rest in the shade.",
  },
  {
    language: "Español",
    text: "Hoy hace mucho calor. Beba agua cada 20 minutos y descanse a la sombra.",
  },
];

export const agents: Agent[] = [
  {
    id: "heat",
    name: "Heat Sentinel",
    role: "Monitors temperature & UV risk",
    icon: "🌡️",
    status: "Ready",
  },
  {
    id: "fatigue",
    name: "Fatigue Watch",
    role: "Tracks worker exertion levels",
    icon: "💤",
    status: "Ready",
  },
  {
    id: "schedule",
    name: "Shift Planner",
    role: "Builds break & rotation plans",
    icon: "🗓️",
    status: "Ready",
  },
  {
    id: "comms",
    name: "Crew Translator",
    role: "Multilingual safety messages",
    icon: "💬",
    status: "Ready",
  },
];
