import Section from "@/components/ui/Section";
import GlassCard from "@/components/ui/GlassCard";
import { agents } from "@/lib/mockData";

export default function AgentCards() {
  return (
    <Section
      id="agents"
      label="Your crew"
      title="Safety agents"
      description="Specialized AI agents working behind the scenes."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {agents.map((agent) => (
          <GlassCard key={agent.id} className="flex items-start gap-3">
            <span className="text-2xl">{agent.icon}</span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-brand-900">
                  {agent.name}
                </h3>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  {agent.status}
                </span>
              </div>
              <p className="text-xs text-brand-800/70">{agent.role}</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
