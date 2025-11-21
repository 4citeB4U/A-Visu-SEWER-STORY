# Local Development Notes (README_LOCAL)

This file supplements the existing `README.md` with explicit instructions for running the local Models server and debugging Agent Lee.

Overview
- Frontend: React + TypeScript, Vite. Slides and visuals live in `components/`.
- Local LLM integration: `services/geminiService.ts` dynamically imports modules under `Models/` (e.g. `gemma.js`, `llama.js`).
- Local model static server: `Models/server.js` serves model artifacts and sets COOP/COEP headers required for browser WASM.

Quick start (development)
1. Install dependencies

```powershell
npm install
```

2. Start the local Models server (separate terminal)

```powershell
npm run models
# or
node Models/server.js
```

This serves `Models/dist` (if present) and exposes `/healthz` and `/config.js`.

3. Start the dev server

```powershell
npm run dev
```

Open `http://localhost:3001/` (vite may pick an alternative port if 3000 is busy).

Agent Lee troubleshooting
- If Agent Lee is offline, open DevTools and check `window.AGENT_STATUS` for `initialized`, `online`, and `lastError`.
- Check the Network tab for failed model artifact requests; failing requests returning HTML mean the SPA fallback served `index.html` instead of the model asset. Ensure `Models/server.js` is running and the requested paths exist under `Models/dist`.
- You can optionally use OpenRouter as a fallback by setting `VITE_OPENROUTER_API_KEY` in a `.env.local` file.

If you'd like, I can try again to update the main `README.md` directly or create a clean merged README once you confirm it's safe to overwrite the existing file.