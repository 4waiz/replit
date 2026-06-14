# 🔥 Starkz AI — Field Heat-Safety Agent

**A premium mobile AI safety agent for outdoor workers in extreme heat.**
One scan → real risk intelligence → action plan.

A supervisor opens the app, scans or uploads a worksite photo, picks the work
type, and Starkz AI generates a **real** heat-safety decision from live weather +
work-type risk: a 0–100 risk score, sub-scores, a break schedule, a supervisor
action, a multilingual worker alert and a shareable safety report.

---

## ⚙️ Tech stack

- **Expo SDK 52** · **Expo Router** · **React Native 0.76** · **TypeScript** (strict)
- **Open-Meteo** for live weather (no API key required)
- **Groq** (`llama-3.3-70b-versatile`) for live agent reasoning + multilingual alerts
- Dark command-center UI — graphite black, heat-orange/amber gradients, glassmorphism

This is an **Expo mobile app** (runs on Android + web). It is no longer a Next.js project.

---

## 🧠 Real intelligence (not a mock)

| Layer | File | What it does |
| --- | --- | --- |
| Weather | `lib/weatherService.ts` | Live Open-Meteo fetch for the Abu Dhabi worksite; falls back to realistic UAE demo conditions (43°C / UV 10) if offline |
| Scoring | `lib/heatRiskEngine.ts` | Real 0–100 risk score: temperature + UV + humidity heat-index + wind relief + midday boost × work-type weight |
| Agents | `lib/agentEngine.ts` | Orchestrates 4 agents (Weather Risk, Workload, Schedule, Communication), each with evidence, a decision and a confidence score |
| Reasoning | `lib/groqService.ts` | Groq turns the numbers into natural reasoning + EN/AR/HI/UR worker alerts |

**Risk levels:** 0–39 Low · 40–64 Moderate · 65–84 High · 85–100 Critical.
If Groq is unavailable (no key / rate-limited / offline) the app falls back to
deterministic reasoning so the demo never breaks.

---

## 🚀 Running locally

```bash
npm install

# Optional but recommended — enables live Groq reasoning:
cp .env.example .env          # then paste your key from https://console.groq.com/keys

npm run web                   # web preview at http://localhost:5000
npm run android               # Android emulator/device (needs one connected)
npm start                     # same as web
```

`EXPO_PUBLIC_GROQ_API_KEY` in `.env` powers the live agent reasoning. Without it
the app still runs end-to-end with the deterministic engine.

---

## 🎬 Hackathon demo flow

1. Open Starkz AI — agent wakes up, shows **live** site temperature.
2. Tap **Start Site Scan**.
3. Tap **Use Demo Site** (guaranteed to work — no camera needed).
4. Select **Construction**.
5. Tap **Run Safety Analysis** — watch the 4 agents reason over real conditions.
6. See the **risk gauge** + breakdown + supervisor action + break schedule.
7. Open the **multilingual worker alert** (English · Arabic · Hindi · Urdu).
8. View the **shareable safety report**.

---

## 🗂️ Architecture

```
app/            index (wake) · scan · loading (analysis) · result (dashboard) · alert · report
lib/            weatherService · heatRiskEngine · agentEngine · groqService
constants/      colors (palette) · workTypes (risk weights)
components/      RiskGauge · AgentRunCard · WeatherEvidenceCard · WorkerAlertCard
                SafetyReportCard · MascotAssistant · GlassPanel · MetricBar · WorkTypePill
context/        AppContext (state + live weather)
```
