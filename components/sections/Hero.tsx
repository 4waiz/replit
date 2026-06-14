import Image from "next/image";

export default function Hero() {
  return (
    <section className="glass relative overflow-hidden p-6 text-center">
      <span className="section-label mx-auto">Real-time heat safety</span>

      <div className="mt-4 flex justify-center">
        <div className="relative h-40 w-40 sm:h-48 sm:w-48">
          <Image
            src="/robot-mascot.png"
            alt="Starkz, the friendly safety robot mascot"
            fill
            priority
            sizes="(max-width: 640px) 160px, 192px"
            className="object-contain drop-shadow-[0_10px_25px_rgba(234,88,12,0.35)]"
          />
        </div>
      </div>

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-brand-900">
        Starkz AI
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm text-brand-800/80">
        Your AI safety agent for outdoor crews in extreme heat. Snap one
        worksite photo, pick the work type, and get an instant heat &amp;
        fatigue risk plan.
      </p>
    </section>
  );
}
