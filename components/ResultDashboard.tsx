import RiskGauge from "@/components/RiskGauge";
import MetricCard from "@/components/MetricCard";
import MultilingualAlert from "@/components/MultilingualAlert";
import SafetyReport from "@/components/SafetyReport";
import AgentCard from "@/components/AgentCard";
import { AnalysisResult, agents } from "@/lib/mockData";

type Props = {
  result: AnalysisResult;
  generatedAt: string;
  onRescan: () => void;
};

/** The mobile safety report screen — the demo's wow moment. */
export default function ResultDashboard({
  result,
  generatedAt,
  onRescan,
}: Props) {
  return (
    <div className="flex flex-col gap-5 px-5 pb-28 pt-6">
      {/* Hero gauge */}
      <section className="animate-scale-in glass flex flex-col items-center gap-3 p-6">
        <span className="section-label">
          {result.workType} · Site analyzed
        </span>
        <RiskGauge score={result.riskScore} level={result.riskLevel} />
        <div className="flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-brand-500 to-red-600 px-4 py-3 text-white shadow-glow">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/80">
            Action required
          </span>
          <span className="text-base font-extrabold">
            ⚡ {result.primaryAction}
          </span>
        </div>
      </section>

      {/* Key metrics */}
      <section className="animate-fade-up grid grid-cols-2 gap-3 [animation-delay:120ms]">
        <MetricCard
          label="Heat exposure"
          value={`${result.heatExposure}`}
          percent={result.heatExposure}
          tone="critical"
          icon="🔥"
        />
        <MetricCard
          label="Fatigue risk"
          value={`${result.fatigueRisk}`}
          percent={result.fatigueRisk}
          tone="high"
          icon="💧"
        />
        <MetricCard
          label="Break needed"
          value={result.breakNeeded}
          tone="moderate"
          icon="⏱️"
        />
        <MetricCard
          label="Risk level"
          value={result.riskLevel}
          tone="critical"
          icon="⚠️"
        />
      </section>

      {/* Supervisor action */}
      <section className="animate-fade-up glass p-5 [animation-delay:200ms]">
        <h3 className="mb-2 flex items-center gap-2 text-base font-bold text-brand-900">
          🧑‍💼 Supervisor action
        </h3>
        <p className="text-sm leading-relaxed text-brand-800">
          {result.supervisorAction}
        </p>
        <div className="mt-3 rounded-2xl bg-white/50 p-3">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-600">
            Task adjustment
          </p>
          <p className="mt-1 text-sm text-brand-800">{result.taskAdjustment}</p>
        </div>
      </section>

      {/* Break schedule */}
      <section className="animate-fade-up glass p-5 [animation-delay:260ms]">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-brand-900">
          🗓️ Break schedule
        </h3>
        <ul className="flex flex-col gap-2">
          {result.breakSchedule.map((slot) => (
            <li
              key={slot.time}
              className="flex items-center justify-between gap-3 rounded-2xl bg-white/50 px-3 py-2.5 text-sm"
            >
              <span className="font-bold text-brand-700">{slot.time}</span>
              <span className="text-right text-brand-800">{slot.activity}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Top risks */}
      <section className="animate-fade-up glass p-5 [animation-delay:320ms]">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-brand-900">
          🚨 Top 5 risks
        </h3>
        <ol className="flex flex-col gap-2">
          {result.topRisks.map((risk, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-brand-800">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500 text-xs font-bold text-white">
                {i + 1}
              </span>
              {risk}
            </li>
          ))}
        </ol>
      </section>

      {/* Mitigation plan */}
      <section className="animate-fade-up glass p-5 [animation-delay:380ms]">
        <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-brand-900">
          ✅ Mitigation plan
        </h3>
        <ul className="flex flex-col gap-2">
          {result.mitigation.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-brand-800">
              <span className="mt-0.5 text-brand-500">▹</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Multilingual alert */}
      <div className="animate-fade-up [animation-delay:440ms]">
        <MultilingualAlert messages={result.workerMessages} />
      </div>

      {/* Agents that produced this */}
      <section className="animate-fade-up flex flex-col gap-3 [animation-delay:500ms]">
        <h3 className="px-1 text-base font-bold text-brand-900">
          Analyzed by 3 Starkz agents
        </h3>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} state="done" />
        ))}
      </section>

      {/* Shareable report */}
      <div className="animate-fade-up [animation-delay:560ms]">
        <SafetyReport result={result} generatedAt={generatedAt} />
      </div>

      <button
        type="button"
        onClick={onRescan}
        className="mt-1 w-full rounded-2xl border border-brand-300/70 bg-white/50 py-3.5 text-sm font-semibold text-brand-700 backdrop-blur transition hover:bg-white/70 active:scale-[0.98]"
      >
        ↻ Scan another worksite
      </button>
    </div>
  );
}
