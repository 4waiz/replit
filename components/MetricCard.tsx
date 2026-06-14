type Props = {
  label: string;
  value: string;
  /** Optional 0-100 value to render a progress bar. */
  percent?: number;
  tone?: "critical" | "high" | "moderate";
  icon?: string;
};

const toneBar: Record<NonNullable<Props["tone"]>, string> = {
  critical: "from-orange-500 to-red-600",
  high: "from-amber-500 to-orange-600",
  moderate: "from-amber-400 to-amber-500",
};

/** Compact glass metric tile with an optional gradient progress bar. */
export default function MetricCard({
  label,
  value,
  percent,
  tone = "high",
  icon,
}: Props) {
  return (
    <div className="glass flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700/70">
          {label}
        </p>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className="text-2xl font-extrabold text-brand-900">{value}</p>
      {percent !== undefined && (
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/50">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${toneBar[tone]}`}
            style={{
              width: `${percent}%`,
              transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      )}
    </div>
  );
}
