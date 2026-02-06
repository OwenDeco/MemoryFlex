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

### Troubleshooting

If you get `npm ERR! Missing script: "cap:add:android"`:

1. Make sure you are in the same project folder that contains this `package.json`.
2. Confirm the script exists:
   `npm run`
3. Pull the latest changes and reinstall dependencies:
   `npm install`
4. Use either command style (both are supported now):
   - `npm run cap:add:android`
   - `npm run cap-add-android`
5. You can always run Capacitor directly if npm scripts are out of date:
   `npx cap add android`

If Android already exists, use:
- `npm run cap:sync` (or `npm run cap-sync`)
- `npm run cap:open:android` (or `npm run cap-open-android`)

### Android rendering checklist

If the app opens in Android Studio but looks broken or partially unstyled:

1. Rebuild web assets and resync into Android:
   - `npm run build`
   - `npm run cap:sync`
2. In Android Studio, run **Build > Clean Project** and then **Run** again.
3. Ensure the Android WebView has internet access on first launch (this app currently uses Tailwind CDN from `index.html`).
4. If styles still look clipped under the status bar, update to this version (it adds `viewport-fit=cover` and safe-area padding support).

> Tip: after each web code change, always run `npm run build:mobile` before running from Android Studio.

