import { AnalysisResult } from "@/lib/mockData";

/** Screenshot-worthy shareable safety report card. */
export default function SafetyReport({
  result,
  generatedAt,
}: {
  result: AnalysisResult;
  generatedAt: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-br from-brand-500 via-orange-500 to-red-600 p-6 text-white shadow-glow-lg">
      <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-lg">
              🤖
            </span>
            <span className="text-sm font-extrabold tracking-wide">
              STARKZ AI
            </span>
          </div>
          <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase">
            Safety Report
          </span>
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-white/80">
              {result.workType} site · Risk level
            </p>
            <p className="text-4xl font-extrabold leading-tight">
              {result.riskLevel}
            </p>
          </div>
          <div className="text-right">
            <p className="text-5xl font-extrabold leading-none">
              {result.riskScore}
            </p>
            <p className="text-xs text-white/80">/ 100</p>
          </div>
        </div>

        <div className="mt-5 space-y-2.5 text-sm">
          <ReportRow label="Worker action" value={result.primaryAction} />
          <ReportRow label="Supervisor" value={result.supervisorAction} />
          <ReportRow label="Next break" value="Rotate to shade in 20 min" />
          <ReportRow
            label="Worker alert"
            value="Sent in EN · AR · HI · UR"
          />
        </div>

        <p className="mt-5 border-t border-white/30 pt-3 text-[11px] text-white/80">
          Generated safety plan · {generatedAt}
        </p>
      </div>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-white/15 px-3 py-2">
      <span className="shrink-0 text-xs font-bold uppercase tracking-wide text-white/80">
        {label}
      </span>
      <span className="text-right font-semibold">{value}</span>
    </div>
  );
}
