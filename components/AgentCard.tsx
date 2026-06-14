import { Agent } from "@/lib/mockData";

type Props = {
  agent: Agent;
  /** Visual state during the loading sequence. */
  state?: "idle" | "working" | "done";
};

const statusLabel: Record<NonNullable<Props["state"]>, string> = {
  idle: "Ready",
  working: "Working…",
  done: "Complete",
};

const statusStyle: Record<NonNullable<Props["state"]>, string> = {
  idle: "bg-white/60 text-brand-700",
  working: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function AgentCard({ agent, state = "idle" }: Props) {
  return (
    <div
      className={`glass flex items-center gap-3 p-4 transition ${
        state === "working" ? "ring-2 ring-brand-400 shadow-glow" : ""
      }`}
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/60 text-xl">
        {agent.icon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-bold text-brand-900">
            {agent.name}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[state]}`}
          >
            {statusLabel[state]}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-brand-800/70">{agent.role}</p>
      </div>
    </div>
  );
}
