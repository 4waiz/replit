import Section from "@/components/ui/Section";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function WorksiteUpload() {
  return (
    <Section
      id="upload"
      label="Step 1"
      title="Scan your worksite"
      description="Capture or upload one photo of the worksite to analyze."
    >
      <GlassCard className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed border-brand-300/70 bg-white/30">
          <div className="flex flex-col items-center gap-1 text-brand-700/80">
            <span className="text-3xl">📷</span>
            <span className="text-sm font-medium">
              Capture or upload worksite photo
            </span>
            <span className="text-xs text-brand-700/60">
              JPG, PNG, WEBP · max 25MB
            </span>
          </div>
        </div>
        <Button variant="primary">Select source</Button>
      </GlassCard>
    </Section>
  );
}
