<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# MemoryFlex

This contains everything you need to run the app locally and package it in a native wrapper with Capacitor.

View your app in AI Studio: https://ai.studio/apps/drive/14b5C7ZEFs6_qkF8WqC15xSC_RLGwoqlB

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
3. Run the app:
   `npm run dev`

## Native wrapper (Capacitor)

This project is now configured for Capacitor via [`capacitor.config.ts`](capacitor.config.ts).

### First-time setup

1. Install dependencies:
   `npm install`
2. Build and sync web assets into native projects:
   `npm run build:mobile`
3. Create platform projects (once per machine):
   - Android: `npm run cap:add:android`
   - iOS: `npm run cap:add:ios`

### Ongoing workflow

1. Build + sync after web changes:
   `npm run build:mobile`
2. Open native IDE projects:
   - Android Studio: `npm run cap:open:android`
   - Xcode: `npm run cap:open:ios`

> Note: iOS builds require macOS + Xcode.
