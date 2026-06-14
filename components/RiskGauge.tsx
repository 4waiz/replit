type Props = {
  score: number; // 0-100
  level: string;
};

/** Large circular risk-score gauge with an orange→red critical sweep. */
export default function RiskGauge({ score, level }: Props) {
  const size = 220;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          style={{
            transition: "stroke-dasharray 1.4s cubic-bezier(0.22,1,0.36,1)",
            filter: "drop-shadow(0 0 10px rgba(249,115,22,0.6))",
          }}
        />
      </svg>

      {/* Center readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-6xl font-extrabold leading-none text-brand-900">
          {score}
        </span>
        <span className="mt-1 text-sm font-medium text-brand-700/70">
          / 100 risk
        </span>
        <span className="mt-2 rounded-full bg-gradient-to-r from-brand-600 to-red-600 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-glow">
          {level}
        </span>
      </div>
    </div>
  );
}
