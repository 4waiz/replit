import Hero from "@/components/sections/Hero";
import WorksiteUpload from "@/components/sections/WorksiteUpload";
import WorkTypeSelector from "@/components/sections/WorkTypeSelector";
import AnalyzeButton from "@/components/sections/AnalyzeButton";
import ResultDashboard from "@/components/sections/ResultDashboard";
import AgentCards from "@/components/sections/AgentCards";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 pb-16 pt-8 sm:max-w-xl">
      <Hero />
      <WorksiteUpload />
      <WorkTypeSelector />
      <AnalyzeButton />
      <ResultDashboard />
      <AgentCards />

      <footer className="pt-4 text-center text-xs text-brand-700/70">
        Starkz AI · Demo mode · Simulated analysis only
      </footer>
    </main>
  );
}
