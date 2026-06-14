---
name: Expo Replit Setup
description: How Expo SDK 52 is configured to run correctly in Replit's environment.
---

## Port & Workflow

- Expo web preview must run on **port 5000** (the only webview port Replit supports).
- Workflow command: `expo start --web --port 5000` (via `npm start`).
- configureWorkflow: `waitForPort: 5000, outputType: "webview"`.
- NEVER run `npx expo start` directly in bash — always via restart_workflow tool.

**Why:** Replit's webview iframe only proxies port 5000. Port 8081 (Expo default) is not in Replit's supported webview port list.

## Missing expo-asset

- `expo-asset` is NOT automatically installed with `expo` SDK 52 but IS required by `@expo/metro-config` at startup.
- Must be listed explicitly in `dependencies` and installed.

**Why:** Expo CLI throws `The required package expo-asset cannot be found` and crashes before Metro starts.

## Old node_modules Cleanup

- `rm -rf node_modules` sometimes fails with "Directory not empty" for react-native subdirs.
- Use `find node_modules -delete && rm -rf node_modules` to force-clean.

**Why:** react-native has deeply nested directories that confuse the standard rm -rf on NixOS.

## react-native-keyboard-controller Version

- Version `~1.15.4` does not exist on npm; latest stable is `1.21.x`.
- Use `"^1.21.0"` for this package.
