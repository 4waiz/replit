import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

/** Friendly floating Starkz robot with a warm glow beneath it. */
export default function RobotMascot({ size = 170, className = "" }: Props) {
  return (
    <div
      className={`relative mx-auto flex items-end justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow halo behind the robot */}
      <div className="absolute inset-x-0 top-2 mx-auto h-[88%] w-[88%] rounded-full bg-brand-400/60 blur-2xl animate-glow-pulse" />
      {/* Floor glow */}
      <div className="absolute -bottom-1 left-1/2 h-4 w-3/5 -translate-x-1/2 rounded-full bg-brand-500/50 blur-md" />

      <div className="relative h-full w-full animate-float">
        <Image
          src="/robot-mascot.png"
          alt="Starkz, the friendly AI safety robot"
          fill
          priority
          sizes="200px"
          className="object-contain drop-shadow-[0_12px_28px_rgba(234,88,12,0.45)]"
        />
      </div>
    </div>
  );
}
