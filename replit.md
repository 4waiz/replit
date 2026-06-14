# Starkz AI

AI safety agent for outdoor workers in extreme heat. A supervisor uploads or takes one worksite photo, selects the work type, and receives a heat/fatigue risk dashboard, task adjustment plan, break schedule, and a multilingual worker safety message.

This is a polished, demo-ready **mobile-first** prototype driven entirely by deterministic mock data. There is no real AI, backend, or image processing yet — see `README.md` for the full pitch and demo flow.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**

## Project structure

```
app/
  layout.tsx           # Root layout, metadata, warm gradient background
  page.tsx             # Home — PhoneShell + StarkzApp
  video/page.tsx       # /video — PhoneShell + PromoVideo (cinematic promo)
  globals.css          # Tailwind layers + glassmorphism / pill utilities
components/
  StarkzApp.tsx        # Mobile flow state machine: home → scan → loading → result
  PromoVideo.tsx       # Auto-playing 6-scene promo (full + fast demo modes)
  RobotMascot.tsx      # Floating, glowing robot mascot
  ScanCard.tsx         # Scanner-style upload + "Use Demo Site"
  WorkTypePills.tsx    # Tappable work-type pills
  LoadingAnalysis.tsx  # Cinematic ~3s agentic loading sequence
  ResultDashboard.tsx  # The mobile risk dashboard (wow moment)
  RiskGauge.tsx        # Large circular SVG risk gauge
  MetricCard.tsx       # Glass metric tile with gradient bar
  AgentCard.tsx        # Agent row (idle / working / done states)
  MultilingualAlert.tsx# EN / AR / HI / UR worker alert
  SafetyReport.tsx     # Shareable, screenshot-worthy report card
  ui/                  # PhoneShell, Button
lib/
  mockData.ts          # Deterministic mock intelligence + getAnalysis()
public/
  robot-mascot.png     # Robot mascot
```

## Running locally / in Replit

The "Start application" workflow runs `npm run dev`, serving on `0.0.0.0:5000`.

- `npm run dev` — start the dev server (port 5000)
- `npm run build` — production build
- `npm run start` — serve the production build (port 5000)

## Design direction

- Warm orange/amber theme (`brand` color scale in `tailwind.config.ts`)
- Soft glassmorphism on cards/sections (`.glass` / `.glass-soft` utilities)
- Friendly robot mascot placeholder in the hero
- Mobile-first layout

## Notes

- The Replit preview is a proxied iframe, so `next.config.mjs` allows the repl's
  dev origin via `allowedDevOrigins` (read from `REPLIT_DOMAINS`).
- All content is mock data — wiring real analysis is a later phase.

## User preferences

- Keep early phases simple and lightweight; do not overbuild.
