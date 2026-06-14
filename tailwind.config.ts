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
        },
      },
      backgroundImage: {
        "warm-glow":
          "radial-gradient(1200px 600px at 50% -10%, rgba(251,146,60,0.35), transparent), radial-gradient(800px 500px at 100% 20%, rgba(245,158,11,0.25), transparent)",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(124, 45, 18, 0.18)",
      },
    },
  },
  plugins: [],
};

export default config;
