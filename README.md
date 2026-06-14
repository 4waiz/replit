# 🤖 Starkz AI — Heat Safety Agent

**Your AI safety agent for extreme heat worksites.**
One phone scan → instant heat & fatigue risk dashboard → a clear safety action plan and multilingual worker alert.

---

## 🏆 Hackathon pitch

In the UAE and across the Gulf, outdoor workers — on construction sites, delivery routes, landscaping crews, security posts — face **extreme heat that regularly exceeds 45–50°C**. Heat stress is a leading, *preventable* cause of worksite injury, yet supervisors rarely have a fast, objective way to judge risk and act.

**Starkz AI turns one phone photo into an instant safety decision.**
A supervisor scans the worksite, picks the work type, and in ~3 seconds gets:

- a **Critical / High risk score** with heat-exposure and fatigue breakdown,
- a **supervisor action** and **task adjustment** plan,
- a **break & rotation schedule**, and
- a **multilingual worker alert** (English, Arabic, Hindi, Urdu) ready to send.

> One simple trigger → one beautiful, immediate, actionable result.

It's designed as a **mobile-first AI companion app** — warm, friendly, and serious about worker safety.

---

## 📱 Demo flow (works fully offline — no internet, no API keys)

1. Open the app — meet the **Starkz** robot.
2. Tap **Scan Worksite**.
3. Tap **Use Demo Site** (guaranteed to work live — no camera needed).
4. Select a work type, e.g. **Construction**.
5. Tap **Analyze Risk**.
6. Watch the **3 agents** work through a short cinematic loading sequence.
7. See the **Critical risk dashboard** (87/100 gauge, metrics, actions).
8. Scroll to the **multilingual worker alert**.
9. Share the **Shareable Safety Report** card.
10. Open **`/video`** for an auto-playing promo you can screen-record.

The work type changes the analysis slightly (e.g. Construction → heavy-labor risk, Delivery → route fatigue, Security → long standing periods, Maintenance → reflective/hot surfaces).

---

## 🛰️ What the three AI agents do

| Agent | Role |
| --- | --- |
| **Safety Agent** | Detects immediate heat and site hazards |
| **Schedule Agent** | Adjusts breaks, rotations, and heavy tasks |
| **Worker Communication Agent** | Creates multilingual safety alerts |

In this prototype the agents run on **deterministic mock intelligence** — realistic, instant, and reliable for a live demo. The architecture is ready to swap in real analysis later.

---

## 🚀 Running locally / in Replit

```bash
npm install
npm run dev      # dev server on 0.0.0.0:5000
npm run build    # production build
npm run start    # serve production build on 0.0.0.0:5000
```

Open <http://localhost:5000>. The promo page is at <http://localhost:5000/video>.

**Replit:** the "Start application" workflow runs `npm run dev`. The preview is a proxied iframe, so `next.config.mjs` allows the repl's dev origin via `allowedDevOrigins`.

---

## 🎨 Design

- Mobile-first **phone shell**: full width on phones, a centered phone frame on desktop/projector.
- Warm **orange glassmorphism** — peach/amber/orange + soft purple gradients, glowing blobs, translucent glass cards.
- Friendly floating **robot mascot** with an orange glow.
- Smooth CSS animations only — **no heavy dependencies** (no Framer Motion, no chart libs).

## 🧱 Tech stack

- **Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS 3**
- No backend, no API keys, no external AI service — fully self-contained.

## 🔭 Future real-world version

- Wire a real `POST /api/analyze` route that sends the photo + work type to a vision-capable model (e.g. Claude) for genuine site-hazard detection.
- Pull live weather/heat-index data for the site location.
- Persist reports, push worker alerts via SMS/WhatsApp, and log compliance.
- On-device inference for fully offline field use.

The current UI already models this flow, so connecting real intelligence is a drop-in replacement for `getAnalysis()` in `lib/mockData.ts`.
