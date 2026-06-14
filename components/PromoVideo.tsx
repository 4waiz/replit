"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RobotMascot from "@/components/RobotMascot";
import RiskGauge from "@/components/RiskGauge";
import { agents } from "@/lib/mockData";

type Scene = {
  title: string;
  subtitle?: string;
  /** seconds this scene stays on screen at normal speed */
  seconds: number;
  render?: () => React.ReactNode;
};

const SCENES: Scene[] = [
  {
    title: "Meet Starkz AI",
    subtitle: "Your AI safety agent for extreme heat worksites",
    seconds: 7,
    render: () => <RobotMascot size={200} />,
  },
  {
    title: "Outdoor heat is not just uncomfortable.",
    subtitle: "It can become a serious worksite risk.",
    seconds: 8,
    render: () => <div className="text-7xl animate-glow-pulse">🌡️</div>,
  },
  {
    title: "One scan. Instant safety intelligence.",
    subtitle: "Snap a photo → get a complete heat & fatigue plan.",
    seconds: 7,
    render: () => <div className="text-7xl">📷</div>,
  },
  {
    title: "Three agents analyze the risk.",
    seconds: 8,
    render: () => (
      <div className="flex flex-col gap-2">
        {agents.map((a, i) => (
          <div
            key={a.id}
            className="glass flex animate-slide-in items-center gap-3 px-4 py-3"
            style={{ animationDelay: `${i * 250}ms` }}
          >
            <span className="text-xl">{a.icon}</span>
            <span className="text-sm font-bold text-brand-900">{a.name}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Risk detected: Critical",
    seconds: 8,
    render: () => <RiskGauge score={87} level="Critical" />,
  },
  {
    title: "Protect workers before incidents happen.",
    subtitle: "Scan → Analyze → Act",
    seconds: 7,
    render: () => <RobotMascot size={170} />,
  },
];

export default function PromoVideo() {
  const [scene, setScene] = useState(0);
  const [fast, setFast] = useState(false);
  const [playing, setPlaying] = useState(true);

  // Fast Demo Mode compresses the ~45s sequence to ~26s.
  const speed = fast ? 0.58 : 1;

  useEffect(() => {
    if (!playing) return;
    if (scene >= SCENES.length) return;
    const ms = SCENES[scene].seconds * 1000 * speed;
    const t = setTimeout(() => setScene((s) => s + 1), ms);
    return () => clearTimeout(t);
  }, [scene, playing, speed]);

  const finished = scene >= SCENES.length;

  function playAgain(useFast: boolean) {
    setFast(useFast);
    setScene(0);
    setPlaying(true);
  }

  const totalSeconds = Math.round(
    SCENES.reduce((sum, s) => sum + s.seconds, 0) * speed,
  );

  return (
    <div className="relative flex min-h-full flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-6">
        <Link href="/" className="text-sm font-semibold text-brand-700">
          ← Back to App
        </Link>
        <span className="section-label">
          Promo · {fast ? "Fast" : "Full"} ({totalSeconds}s)
        </span>
      </div>

      {/* Stage */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        {!finished ? (
          <div key={scene} className="flex flex-col items-center gap-6">
            <div className="animate-scale-in">{SCENES[scene].render?.()}</div>
            <h1 className="animate-fade-up text-3xl font-extrabold leading-tight text-brand-900 [animation-delay:120ms]">
              {SCENES[scene].title}
            </h1>
            {SCENES[scene].subtitle && (
              <p className="max-w-xs animate-fade-up text-lg text-brand-800/80 [animation-delay:240ms]">
                {SCENES[scene].subtitle}
              </p>
            )}
          </div>
        ) : (
          <div className="flex animate-scale-in flex-col items-center gap-5">
            <RobotMascot size={150} />
            <h1 className="text-3xl font-extrabold text-brand-900">
              Starkz AI
            </h1>
            <p className="max-w-xs text-base text-brand-800/80">
              One scan → beautiful risk dashboard → safety action plan.
            </p>
          </div>
        )}
      </div>

      {/* Scene progress dots */}
      <div className="flex justify-center gap-2 pb-3">
        {SCENES.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === scene && !finished
                ? "w-6 bg-brand-500"
                : i < scene || finished
                  ? "w-1.5 bg-brand-400"
                  : "w-1.5 bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-3 px-5 pb-10">
        <button
          onClick={() => playAgain(false)}
          className="rounded-2xl bg-brand-500 py-3.5 text-sm font-semibold text-white shadow-glass transition hover:bg-brand-600 active:scale-[0.97]"
        >
          ↻ Play Again
        </button>
        <button
          onClick={() => playAgain(true)}
          className="rounded-2xl border border-brand-300/70 bg-white/50 py-3.5 text-sm font-semibold text-brand-700 backdrop-blur transition hover:bg-white/70 active:scale-[0.97]"
        >
          ⚡ Fast Demo Mode
        </button>
        <Link
          href="/"
          className="rounded-2xl border border-brand-300/70 bg-white/50 py-3.5 text-center text-sm font-semibold text-brand-700 backdrop-blur transition hover:bg-white/70 active:scale-[0.97]"
        >
          ← Back to App
        </Link>
        <Link
          href="/"
          className="rounded-2xl bg-gradient-to-r from-brand-500 to-orange-500 py-3.5 text-center text-sm font-semibold text-white shadow-glow-lg transition active:scale-[0.97]"
        >
          🚀 Launch Demo
        </Link>
      </div>
    </div>
  );
}
