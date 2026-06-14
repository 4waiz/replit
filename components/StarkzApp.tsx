"use client";

import { useState } from "react";
import Link from "next/link";
import RobotMascot from "@/components/RobotMascot";
import ScanCard from "@/components/ScanCard";
import WorkTypePills from "@/components/WorkTypePills";
import LoadingAnalysis from "@/components/LoadingAnalysis";
import ResultDashboard from "@/components/ResultDashboard";
import AgentCard from "@/components/AgentCard";
import Button from "@/components/ui/Button";
import { agents, getAnalysis, AnalysisResult, DEMO_WORKSITE } from "@/lib/mockData";

type Screen = "home" | "scan" | "loading" | "result";

export default function StarkzApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [image, setImage] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [workType, setWorkType] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [generatedAt, setGeneratedAt] = useState("");

  const canAnalyze = Boolean((image || isDemo) && workType);

  function reset() {
    setImage(null);
    setIsDemo(false);
    setWorkType(null);
    setResult(null);
    setScreen("home");
  }

  function startAnalysis() {
    if (!canAnalyze || !workType) return;
    setResult(getAnalysis(workType));
    // Stamp a friendly local timestamp at click time (not during render).
    const now = new Date();
    setGeneratedAt(
      now.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
        " · " +
        now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        }),
    );
    setScreen("loading");
  }

  // ---- Loading screen ------------------------------------------------------
  if (screen === "loading") {
    return <LoadingAnalysis onComplete={() => setScreen("result")} />;
  }

  // ---- Result screen -------------------------------------------------------
  if (screen === "result" && result) {
    return (
      <ResultDashboard
        result={result}
        generatedAt={generatedAt}
        onRescan={reset}
      />
    );
  }

  // ---- Scan screen ---------------------------------------------------------
  if (screen === "scan") {
    return (
      <div className="flex min-h-full flex-col gap-6 px-5 pb-32 pt-6">
        <header className="flex items-center justify-between">
          <button
            onClick={() => setScreen("home")}
            className="text-sm font-semibold text-brand-700"
          >
            ← Back
          </button>
          <span className="section-label">Scan Worksite</span>
        </header>

        <div>
          <h2 className="text-2xl font-extrabold text-brand-900">
            Scan your worksite
          </h2>
          <p className="mt-1 text-sm text-brand-800/70">
            One photo → heat risk → safety action.
          </p>
        </div>

        <ScanCard
          image={image}
          isDemo={isDemo}
          onImage={(url) => {
            setImage(url);
            setIsDemo(false);
          }}
          onUseDemo={() => {
            setImage(DEMO_WORKSITE);
            setIsDemo(true);
          }}
          onClear={() => {
            setImage(null);
            setIsDemo(false);
          }}
        />

        <div>
          <h3 className="mb-3 text-base font-bold text-brand-900">
            Select work type
          </h3>
          <WorkTypePills selected={workType} onSelect={setWorkType} />
        </div>

        {/* Sticky analyze CTA */}
        <div className="sticky bottom-4 mt-2">
          <Button
            variant="glow"
            disabled={!canAnalyze}
            onClick={startAnalysis}
            className="py-5 text-lg"
          >
            ⚡ Analyze Risk
          </Button>
          {!canAnalyze && (
            <p className="mt-2 text-center text-xs text-brand-700/60">
              Add a photo (or use the demo site) and pick a work type.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ---- Home / hero screen --------------------------------------------------
  return (
    <div className="flex min-h-full flex-col gap-8 px-5 pb-16 pt-10">
      <section className="flex flex-col items-center text-center">
        <span className="section-label animate-fade-up">🤖 AI Safety Agent</span>

        <div className="mt-6 animate-scale-in">
          <RobotMascot size={190} />
        </div>

        <h1 className="mt-6 animate-fade-up text-4xl font-extrabold tracking-tight text-brand-900 [animation-delay:100ms]">
          Meet Starkz AI
        </h1>
        <p className="mt-3 max-w-xs animate-fade-up text-base text-brand-800/80 [animation-delay:180ms]">
          Your AI safety agent for extreme heat worksites.
        </p>

        <div className="mt-8 w-full animate-fade-up [animation-delay:260ms]">
          <Button
            variant="glow"
            onClick={() => setScreen("scan")}
            className="py-5 text-lg"
          >
            📷 Scan Worksite
          </Button>
          <p className="mt-3 text-sm font-medium text-brand-700/70">
            One scan → heat risk → safety action
          </p>
        </div>
      </section>

      {/* Agent crew preview */}
      <section className="flex flex-col gap-3">
        <h2 className="px-1 text-base font-bold text-brand-900">
          Three agents have your back
        </h2>
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} state="idle" />
        ))}
      </section>

      <Link
        href="/video"
        className="mx-auto text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
      >
        ▶ Watch Promo
      </Link>

      <footer className="pt-2 text-center text-xs text-brand-700/60">
        Starkz AI · Demo mode · Simulated analysis · Built for UAE extreme heat
      </footer>
    </div>
  );
}
