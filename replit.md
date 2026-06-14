# Starkz AI

AI safety agent for outdoor workers in extreme heat. A supervisor takes/uploads one worksite photo, selects the work type, and receives a heat/fatigue risk dashboard, task adjustment plan, break schedule, and a multilingual worker safety message.

This is a polished, demo-ready **mobile-first** Expo (React Native) app driven entirely by deterministic mock data. There is no real AI, backend, or image processing yet.

## Tech stack

- **Expo SDK 52** (expo-router, Stack navigation)
- **React Native** 0.76.9
- **TypeScript**
- **expo-linear-gradient**, **expo-image-picker**, **expo-haptics**
- **@expo-google-fonts/inter** (400/500/600/700)
- **react-native-reanimated**, **react-native-gesture-handler**
- **react-native-safe-area-context**, **react-native-keyboard-controller**
- **@expo/vector-icons** (Ionicons)
- **@tanstack/react-query**

## App flow

```
Home → /scan → /loading → /result
```

Single Stack navigator, no tabs. All screens use `headerShown: false`.

## Project structure

```
app/
  _layout.tsx        # Root layout — providers, Stack screens, font loading
  index.tsx          # Home — mascot, agent cards, "SCAN WORKSITE" CTA
  scan.tsx           # Photo upload + work type selector + analyze button
  loading.tsx        # 3-second animated loading with per-step agent progress
  result.tsx         # Risk dashboard — score gauge, metrics, schedule, messages
components/
  ErrorBoundary.tsx  # Class-based error boundary
  GlassCard.tsx      # Semi-transparent card with border
  AgentCard.tsx      # Agent row (idle / working / done states)
  WorkTypePill.tsx   # Tappable work-type pill
  MetricCard.tsx     # Glass metric tile with tone bar
constants/
  colors.ts          # Light + dark palettes (AppColors type)
hooks/
  useColors.ts       # Returns light or dark colors based on color scheme
context/
  AppContext.tsx      # photo, workTypeId, result — shared across the stack
lib/
  mockData.ts        # workTypes, agents, loadingSteps, getAnalysis()
assets/
  images/
    robot.png        # Robot mascot (transparent PNG)
    icon.png         # AI-generated app icon
    splash-icon.png  # AI-generated splash image
```

## Running

The "Start application" workflow runs `npm start` → `expo start --web --port 5000`.

- `npm start` — Expo dev server on port 5000 (web preview)
- `npm run android` — open on Android
- `npm run ios` — open on iOS / Expo Go

## Design direction

- Warm orange/amber brand (`#f97316` primary, `#ea580c` accent)
- Home + Loading screens: dark brown gradient (`#1c0800 → #c2410c`)
- Light cream background (`#fff7ed`) for Scan + Result screens
- Glass-morphism cards with amber borders
- Inter font family (all weights)
- @expo/vector-icons (Ionicons) — no emojis

## Important Expo rules (do not break)

- NEVER edit package.json directly — use installLanguagePackages tool
- NEVER run `npx expo start` directly in bash — use restart_workflow
- NEVER create app.config.ts — use static app.json only
- Web-only insets: 67px top, 34px bottom (on `Platform.OS === 'web'`)
- Use `useSafeAreaInsets()` for native, never hardcode padding

## User preferences

- Keep early phases simple and lightweight; do not overbuild.
