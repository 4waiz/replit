import Section from "@/components/ui/Section";
import GlassCard from "@/components/ui/GlassCard";
import {
  riskMetrics,
  taskAdjustments,
  breakSchedule,
  safetyMessage,
} from "@/lib/mockData";

const levelStyles: Record<string, string> = {
  low: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export default function ResultDashboard() {
  return (
    <Section
      id="results"
      label="Step 3"
      title="Risk dashboard"
      description="A preview of the safety plan (placeholder mock data)."
    >
      <div className="grid grid-cols-3 gap-3">
        {riskMetrics.map((metric) => (
          <GlassCard key={metric.label} className="text-center">
            <p className="text-xs font-medium text-brand-700/70">
              {metric.label}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-bold ${levelStyles[metric.level]}`}
            >
              {metric.value}
            </span>
          </GlassCard>
        ))}
      </div>

      <GlassCard>
        <h3 className="mb-2 text-sm font-bold text-brand-900">
          Task adjustment plan
        </h3>
        <ul className="flex flex-col gap-2">
          {taskAdjustments.map((item, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm text-brand-800/80"
            >
              <span className="mt-0.5 text-brand-500">•</span>
              {item}
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-3 text-sm font-bold text-brand-900">
          Break schedule
        </h3>
        <ul className="flex flex-col gap-2">
          {breakSchedule.map((slot) => (
            <li
              key={slot.time}
              className="flex items-center justify-between gap-3 rounded-xl bg-white/40 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-brand-700">{slot.time}</span>
              <span className="text-right text-brand-800/80">
                {slot.activity}
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard>
        <h3 className="mb-3 text-sm font-bold text-brand-900">
          Worker safety message
        </h3>
        <div className="flex flex-col gap-3">
          {safetyMessage.map((msg) => (
            <div key={msg.language} className="rounded-xl bg-white/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                {msg.language}
              </p>
              <p className="mt-1 text-sm text-brand-800/80">{msg.text}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </Section>
  );
}
