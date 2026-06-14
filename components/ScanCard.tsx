"use client";

import { useRef } from "react";
import Image from "next/image";

type Props = {
  image: string | null;
  isDemo: boolean;
  onImage: (dataUrl: string) => void;
  onUseDemo: () => void;
  onClear: () => void;
};

/** Scanner-style upload area with an animated scan line + demo fallback. */
export default function ScanCard({
  image,
  isDemo,
  onImage,
  onUseDemo,
  onClear,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {image ? (
        // Premium preview inside a glass card
        <div className="glass relative overflow-hidden p-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt="Worksite preview"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/40 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold text-white shadow">
              ✓ {isDemo ? "Demo worksite loaded" : "Photo ready"}
            </span>
          </div>
          <button
            type="button"
            onClick={onClear}
            className="mt-2 w-full rounded-xl bg-white/50 py-2 text-sm font-semibold text-brand-700 transition hover:bg-white/70"
          >
            Retake / change photo
          </button>
        </div>
      ) : (
        // Empty scanner frame with animated scan line
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="glass relative flex aspect-[4/3] w-full flex-col items-center justify-center overflow-hidden p-6 text-center"
        >
          {/* corner brackets */}
          <span className="pointer-events-none absolute left-3 top-3 h-7 w-7 rounded-tl-xl border-l-4 border-t-4 border-brand-400/80" />
          <span className="pointer-events-none absolute right-3 top-3 h-7 w-7 rounded-tr-xl border-r-4 border-t-4 border-brand-400/80" />
          <span className="pointer-events-none absolute bottom-3 left-3 h-7 w-7 rounded-bl-xl border-b-4 border-l-4 border-brand-400/80" />
          <span className="pointer-events-none absolute bottom-3 right-3 h-7 w-7 rounded-br-xl border-b-4 border-r-4 border-brand-400/80" />
          {/* scan line */}
          <span className="animate-scanline pointer-events-none absolute left-4 right-4 h-0.5 rounded-full bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-glow" />

          <span className="text-4xl">📷</span>
          <span className="mt-2 text-base font-bold text-brand-900">
            Tap to scan worksite
          </span>
          <span className="mt-1 text-xs text-brand-700/70">
            Take a photo or upload one image
          </span>
        </button>
      )}

      <button
        type="button"
        onClick={onUseDemo}
        className="w-full rounded-2xl border border-brand-300/70 bg-white/50 py-3 text-sm font-semibold text-brand-700 backdrop-blur transition hover:bg-white/70 active:scale-[0.98]"
      >
        ⚡ Use Demo Site
      </button>
    </div>
  );
}
