# Starkz AI

AI safety agent for outdoor workers in extreme heat. A supervisor uploads or takes one worksite photo, selects the work type, and receives a heat/fatigue risk dashboard, task adjustment plan, break schedule, and a multilingual worker safety message.

This repository currently contains the **foundation scaffold** only — a clean, working UI shell driven entirely by mock data. There is no real AI, backend, or image processing yet.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS 3**

## Project structure

```
app/
  layout.tsx        # Root layout, metadata, fonts, global background
  page.tsx          # Home page — composes all sections
  globals.css       # Tailwind layers + glassmorphism utility classes
components/
  ui/               # Reusable building blocks (Button, GlassCard, Section)
  sections/         # Page sections (Hero, WorksiteUpload, WorkTypeSelector,
                    #   AnalyzeButton, ResultDashboard, AgentCards)
lib/
  mockData.ts       # All placeholder data (work types, metrics, agents, etc.)
public/
  robot-mascot.png  # Hero mascot placeholder
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
