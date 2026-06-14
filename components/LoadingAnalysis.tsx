"use client";

import { useEffect, useState } from "react";
import RobotMascot from "@/components/RobotMascot";
import AgentCard from "@/components/AgentCard";
import { agents, loadingSteps } from "@/lib/mockData";

type Props = {
  onComplete: () => void;
};

const STEP_MS = 650; // 5 steps ≈ 3.25s — short enough for a live demo

/** Cinematic, agentic loading sequence shown full-screen during analysis. */
export default function LoadingAnalysis({ onComplete }: Props) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= loadingSteps.length) {
      const done = setTimeout(onComplete, 450);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setStep((s) => s + 1), STEP_MS);
    return () => clearTimeout(next);
  }, [step, onComplete]);

  // Map the 3 agents onto the 5 loading steps.
  function agentState(index: number): "idle" | "working" | "done" {
    const start = [0, 2, 4][index]; // safety, schedule, comms
    if (step > start) return "done";
    if (step === start) return "working";
    return "idle";
  }

  const progress = Math.min(100, (step / loadingSteps.length) * 100);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 py-10 text-center sm:min-h-0">
      <RobotMascot size={150} />

      <div className="h-12">
        <p
          key={step}
          className="animate-fade-up text-lg font-bold text-brand-900"
        >
          {loadingSteps[Math.min(step, loadingSteps.length - 1)]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/50">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-red-500"
          style={{ width: `${progress}%`, transition: "width 0.5s ease-out" }}
        />
      </div>

      {/* Live agent status */}
      <div className="flex w-full max-w-sm flex-col gap-3">
        {agents.map((agent, i) => (
          <AgentCard key={agent.id} agent={agent} state={agentState(i)} />
        ))}
      </div>
    </div>
  );
}
