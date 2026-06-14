import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function AnalyzeButton() {
  return (
    <Section id="analyze">
      <Button variant="primary" className="py-4 text-base">
        ⚡ Analyze risk
      </Button>
      <p className="text-center text-xs text-brand-700/60">
        Demo mode uses simulated AI analysis.
      </p>
    </Section>
  );
}
