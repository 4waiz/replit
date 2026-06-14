import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starkz AI — Heat Safety Agent",
  description:
    "AI safety agent for outdoor workers in extreme heat. Upload a worksite photo, pick a work type, and get a heat & fatigue risk plan.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f97316",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-dvh bg-warm-glow">{children}</body>
    </html>
  );
}
