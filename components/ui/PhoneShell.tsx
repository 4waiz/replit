import { ReactNode } from "react";

/**
 * Centers the app inside a phone-sized shell.
 * - Mobile: full width, fills the screen like a native app.
 * - Desktop: a rounded phone frame floating on the warm gradient.
 */
export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full items-stretch justify-center sm:items-center sm:py-8">
      <div className="relative flex min-h-dvh w-full max-w-phone flex-col overflow-hidden bg-phone-glow sm:min-h-0 sm:h-[860px] sm:rounded-[2.75rem] sm:border-[10px] sm:border-brand-950/80 sm:shadow-phone">
        {/* Decorative drifting blobs behind everything */}
        <div className="pointer-events-none absolute -left-16 top-24 h-56 w-56 rounded-full bg-brand-400/40 blur-3xl animate-blob-drift" />
        <div className="pointer-events-none absolute -right-16 top-72 h-52 w-52 rounded-full bg-purple-400/30 blur-3xl animate-blob-drift [animation-delay:-5s]" />
        <div className="pointer-events-none absolute bottom-10 left-10 h-48 w-48 rounded-full bg-amber-400/30 blur-3xl animate-blob-drift [animation-delay:-9s]" />

        {/* Scrollable app content */}
        <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
