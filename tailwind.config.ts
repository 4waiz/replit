import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
      },
      maxWidth: {
        phone: "430px",
      },
      backgroundImage: {
        "warm-glow":
          "radial-gradient(1200px 600px at 50% -10%, rgba(251,146,60,0.35), transparent), radial-gradient(800px 500px at 100% 20%, rgba(245,158,11,0.25), transparent), radial-gradient(700px 500px at 0% 80%, rgba(167,139,250,0.2), transparent)",
        "phone-glow":
          "radial-gradient(520px 380px at 50% 0%, rgba(251,146,60,0.45), transparent), radial-gradient(440px 360px at 90% 70%, rgba(167,139,250,0.3), transparent), radial-gradient(440px 380px at 5% 90%, rgba(245,158,11,0.28), transparent)",
        "critical-gauge":
          "conic-gradient(from 180deg, #f97316, #ef4444, #b91c1c)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(124, 45, 18, 0.18)",
        glow: "0 0 45px rgba(249, 115, 22, 0.55)",
        "glow-lg": "0 18px 60px rgba(249, 115, 22, 0.45)",
        phone:
          "0 40px 80px -20px rgba(124,45,18,0.45), 0 0 0 1px rgba(255,255,255,0.4)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.08)" },
        },
        "blob-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -25px) scale(1.1)" },
          "66%": { transform: "translate(-18px, 18px) scale(0.95)" },
        },
        scanline: {
          "0%": { top: "0%", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { top: "100%", opacity: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "blob-drift": "blob-drift 14s ease-in-out infinite",
        scanline: "scanline 2.2s ease-in-out infinite",
        "fade-up": "fade-up 0.6s ease-out both",
        "scale-in": "scale-in 0.5s ease-out both",
        "slide-in": "slide-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
