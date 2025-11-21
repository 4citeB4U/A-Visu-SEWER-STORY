// Generic OpenRouter adapter for chat completions
// Expects an API key either in window.OPENROUTER_API_KEY or localStorage('OPENROUTER_API_KEY')
// Provides generateText(prompt) and supports simple multimodal (Gemini) via [image:URL] tokens.

class OpenRouterAdapter {
  constructor(modelId, modelName, options = {}) {
    this.modelId = modelId; // internal id e.g. llama3_8b_or
    this.remoteModel = modelName; // remote spec e.g. meta-llama/llama-3.3-8b-instruct:free
    this.isLoaded = false; // remote models are effectively ready once key present
    this.multimodal = options.multimodal || false;
    this.baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    this.siteUrl = options.siteUrl || window.location.origin;
    this.siteTitle = options.siteTitle || 'PHI4 Demo';
  }

  getApiKey() {
    try {
      if (window.OPENROUTER_API_KEY && String(window.OPENROUTER_API_KEY).trim()) return window.OPENROUTER_API_KEY;
    } catch (_) {}
    try {
      if (typeof __OPENROUTER_KEY__ !== 'undefined' && __OPENROUTER_KEY__) return __OPENROUTER_KEY__;
    } catch (_) {}
    const fromLocal = (typeof localStorage !== 'undefined') ? localStorage.getItem('OPENROUTER_API_KEY') : '';
    return fromLocal || '';
  }

  async initialize() {
    const key = this.getApiKey();
    if (!key) throw new Error('OpenRouter API key missing. Set via UI before using remote models.');
    // We could do a tiny test call; keep it minimal to avoid latency.
    this.isLoaded = true;
    return true;
  }

  buildMessages(prompt) {
    // Multimodal: detect pattern [image:URL] inside prompt. Extract and build messages accordingly.
    if (this.multimodal) {
      const imgPattern = /\[image:(https?:[^\]]+)\]/gi;
      const images = [];
      let cleaned = prompt.replace(imgPattern, (m, url) => { images.push(url); return ''; }).trim();
      if (images.length) {
        return [
          { role: 'user', content: [
            { type: 'text', text: cleaned || 'Describe image(s).' },
            ...images.map(url => ({ type: 'image_url', image_url: { url } }))
          ] }
        ];
      }
    }
    return [{ role: 'user', content: prompt }];
  }

  async generateText(prompt) {
    if (!this.isLoaded) await this.initialize();
    const key = this.getApiKey();
    if (!key) throw new Error('OpenRouter API key not set');

    const headers = {
      'Authorization': `Bearer ${key}`,
      'HTTP-Referer': this.siteUrl,
      'X-Title': this.siteTitle,
      'Content-Type': 'application/json'
    };
    const body = {
      model: this.remoteModel,
      messages: this.buildMessages(prompt),
      // Deterministic-ish
      temperature: 0.7,
      top_p: 0.9
    };

    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        const resp = await fetch(this.baseUrl, { method: 'POST', headers, body: JSON.stringify(body) });
        if (resp.ok) {
          const json = await resp.json();
          const choice = json.choices?.[0];
          const content = choice?.message?.content;
          // content could be array of parts or string
          let text = '';
          if (Array.isArray(content)) {
            text = content.map(part => (typeof part === 'string' ? part : part?.text || '')).join(' ').trim();
          } else if (typeof content === 'string') {
            text = content.trim();
          } else if (content?.text) {
            text = content.text.trim();
          } else {
            text = JSON.stringify(content);
          }
          return text;
        } else if (resp.status === 429) {
          // Rate limited, retry with exponential backoff
          const retryAfter = resp.headers.get('Retry-After') || Math.pow(2, attempts) * 1000; // default exponential backoff
          console.warn(`Rate limited for ${this.modelId}, retrying in ${retryAfter}ms (attempt ${attempts + 1}/${maxAttempts})`);
          await new Promise(resolve => setTimeout(resolve, parseInt(retryAfter)));
          attempts++;
        } else {
          const txt = await resp.text();
          throw new Error(`OpenRouter error ${resp.status}: ${txt.slice(0,200)}`);
        }
      } catch (error) {
        if (attempts >= maxAttempts - 1) throw error;
        attempts++;
        console.warn(`Request failed for ${this.modelId}, retrying (attempt ${attempts}/${maxAttempts}): ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }
    throw new Error(`Failed to generate text after ${maxAttempts} attempts`);
  }
}

// Factory cache on window
window.__openRouterAdapters = window.__openRouterAdapters || {};
window.getOpenRouterAdapter = function(modelId, remoteName, opts) {
  if (!window.__openRouterAdapters[modelId]) {
    window.__openRouterAdapters[modelId] = new OpenRouterAdapter(modelId, remoteName, opts);
  }
  return window.__openRouterAdapters[modelId];
};

export { OpenRouterAdapter };

