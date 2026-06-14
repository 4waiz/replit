import Section from "@/components/ui/Section";
import GlassCard from "@/components/ui/GlassCard";
import { workTypes } from "@/lib/mockData";

export default function WorkTypeSelector() {
  return (
    <Section
      id="work-type"
      label="Step 2"
      title="Select work type"
      description="Pick the kind of work happening on site."
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {workTypes.map((type) => (
          <GlassCard
            key={type.id}
            className="flex cursor-pointer flex-col items-center gap-2 py-4 text-center transition hover:bg-white/60"
          >
            <span className="text-2xl">{type.icon}</span>
            <span className="text-sm font-semibold text-brand-900">
              {type.label}
            </span>
          </GlassCard>
        ))}
      </div>
    </Section>
  );
}
