// Simple Express static server with proper headers for shared array buffer / WASM threading
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'url';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const distPath = path.join(__dirname, 'dist');

// Security & performance headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.use(serveStatic(distPath, {
  maxAge: '1h'
}));

app.get('/healthz', (req, res) => res.json({ ok: true }));

// Dynamic client config: expose safe runtime flags and API key if provided via .env
app.get('/config.js', (req, res) => {
  const key = process.env.OPENROUTER_API_KEY || '';
  const lines = [
    '/* runtime config */',
    `window.OPENROUTER_API_KEY = ${JSON.stringify(key)};`
  ].join('\n');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.send(lines);
});

// Single Page App fallback: serve index.html for any unknown GET that accepts HTML
app.use((req, res, next) => {
  try {
    if (req.method === 'GET') {
      const accept = req.headers.accept || '';
      if (accept.includes('text/html')) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
    }
  } catch (e) {
    // ignore and continue
  }
  return next();
});

// Prefer 8080, but also respect PORT if provided; listen on both if they differ
const PORT = Number(process.env.PORT) || 8000;
console.log(`process.env.HOST: ${process.env.HOST}`);
const HOST = process.env.HOST || '127.0.0.1';
console.log(`Binding to HOST: ${HOST}, PORT: ${PORT}`);
try {
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server listening on http://${HOST}:${PORT}`);
    // Self-test fetch to confirm reachability
    fetch(`http://${HOST}:${PORT}/healthz`).then(r => r.text()).then(t => {
      console.log('[self-test] /healthz response:', t.slice(0,80));
    }).catch(e => console.warn('[self-test] healthz fetch failed', e.message));
  });
  server.on('error', (err) => {
    console.error('Server error:', err);
  });
} catch (e) {
  console.error('Failed to start server:', e);
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});
// no export; script runs server when executed
