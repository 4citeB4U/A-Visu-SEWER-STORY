/* LEEWAY HEADER
TAG: AI.MODEL.GEMMA
COLOR_ONION_HEX: NEON=#39FF14 FLUO=#0DFF94 PASTEL=#C7FFD8
ICON_FAMILY: lucide
ICON_GLYPH: brain
ICON_SIG: CD534113
5WH: WHAT=Gemma LLM integration for Agent Lee;
WHY=Power AI chat responses locally in browser;
WHO=LeeWay Industries + VisuSewer;
WHERE=b:\Visu-Sewer Strategic Asset & Growth Deck\gemma.js;
WHEN=2025-11-08;
HOW=OpenRouter (preferred) with google/gemma-3n-e2b-it:free, fallback to Xenova Transformers
AGENTS: GEMINI, CLAUDE, GPT4, LLAMA
SPDX-License-Identifier: MIT
*/
/**
 * Gemma 2B LLM Module
 * Chat, summarization, and reasoning model
 */

import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@latest';

class GemmaLLM {
    constructor() {
        this.model = null;
        this.isLoaded = false;
        this.isLoading = false;
        this.useOpenRouter = false;
        this.orModel = 'google/gemma-3n-e2b-it:free';
        this.orKey = '';
        this.siteUrl = '';
        this.siteTitle = '';
        // Use compatible models
        this.fallbackModels = [
            'Xenova/LaMini-Flan-T5-248M',     // Small instruction-tuned model
            'Xenova/distilgpt2',              // DistilGPT-2 for generation
            'microsoft/DialoGPT-medium'        // Dialog model
        ];
        this.modelName = this.fallbackModels[0];
        this.maxTokens = 1024; // Conservative for compatibility
        this.loadingProgress = 0;
    }

    async initialize() {
        if (this.isLoaded || this.isLoading) return this.model;

        console.log('🔄 Initializing GemmaLLM...');

        // Try OpenRouter first if configured
        try {
            // Prefer Vite build-time envs, fall back to any window globals set at runtime
            let env = {};
            try { env = import.meta.env || {}; } catch (e) { env = {}; }
            this.orKey = env.VITE_OPENROUTER_API_KEY || window.OPENROUTER_API_KEY || '';
            this.orModel = env.VITE_OPENROUTER_MODEL || window.OPENROUTER_MODEL || 'google/gemma-3n-e2b-it:free';
            this.siteUrl = env.VITE_SITE_URL || window.SITE_URL || '';
            this.siteTitle = env.VITE_SITE_TITLE || window.SITE_TITLE || '';
            if (this.orKey) {
                this.useOpenRouter = true;
                this.isLoaded = true; // no local model to load
                console.log(`✅ OpenRouter configured, using remote model: ${this.orModel}`);
                window.dispatchEvent(new CustomEvent('llmReady', {
                    detail: { model: 'gemma', hemisphere: 'openrouter' }
                }));
                return null;
            }
        } catch (e) {
            console.warn('OpenRouter env read failed, falling back to local model:', e);
        }

        this.isLoading = true;
        console.log('🔄 Loading Gemma compatible model...');

        // Try models in order of preference
        for (const modelName of this.fallbackModels) {
            try {
                console.log(`🔄 Attempting to load: ${modelName}`);

                this.model = await pipeline(
                    'text-generation',
                    modelName,
                    {
                        progress_callback: (progress) => {
                            if (progress.status === 'downloading') {
                                this.loadingProgress = Math.round((progress.loaded / progress.total) * 100);
                                console.log(`📥 Gemma loading: ${this.loadingProgress}%`);

                                window.dispatchEvent(new CustomEvent('llmLoadingProgress', {
                                    detail: { model: 'gemma', progress: this.loadingProgress }
                                }));
                            }
                        }
                    }
                );

                this.modelName = modelName;
                this.isLoaded = true;
                this.isLoading = false;
                console.log(`✅ Gemma loaded successfully: ${modelName}`);

                window.dispatchEvent(new CustomEvent('llmReady', {
                    detail: { model: 'gemma', hemisphere: 'gemini' }
                }));

                return this.model;

            } catch (error) {
                console.error(`⚠️ Failed to load ${modelName}: ${error.message}`);
            }
        }

        this.isLoading = false;
        throw new Error('Failed to load any Gemma compatible model');
    }

    async chatOpenRouter(message, context = []) {
        const url = 'https://openrouter.ai/api/v1/chat/completions';
        const headers = {
            'Authorization': `Bearer ${this.orKey}`,
            'Content-Type': 'application/json',
        };
        if (this.siteUrl) headers['HTTP-Referer'] = this.siteUrl;
        if (this.siteTitle) headers['X-Title'] = this.siteTitle;

        const messages = context.map(entry => ({
            role: entry.role === 'model' ? 'assistant' : entry.role,
            content: entry.content || entry.text || ''
        }));
        messages.push({ role: 'user', content: message });

        const body = { model: this.orModel, messages };

        let retries = 0;
        const maxRetries = 3;
        const retryDelay = 2000; // 2 seconds

        while (retries < maxRetries) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body),
                });

                if (res.status === 429) {
                    console.warn('Rate limit exceeded. Retrying...');
                    retries++;
                    await new Promise(resolve => setTimeout(resolve, retryDelay * retries));
                    continue;
                }

                if (!res.ok) {
                    const txt = await res.text().catch(() => '');
                    throw new Error(`OpenRouter HTTP ${res.status}: ${txt}`);
                }

                const json = await res.json();
                const text = json?.choices?.[0]?.message?.content || '';
                return {
                    text,
                    model: this.orModel,
                    tokens: text.split(/\s+/).length,
                    hemisphere: 'openrouter'
                };
            } catch (error) {
                console.error(`Error during OpenRouter request: ${error.message}`);
                retries++;
                if (retries >= maxRetries) {
                    console.warn('Max retries reached. Falling back to local model.');
                    // Clear OpenRouter key so initialize() won't short-circuit to remote-only mode
                    try {
                        this.orKey = '';
                        this.useOpenRouter = false;
                        this.isLoaded = false;
                    } catch (e) {
                        /* ignore */
                    }
                    // Ensure a local model is loaded before invoking the fallback
                    try {
                        await this.initialize();
                    } catch (initErr) {
                        console.warn('Local initialize after OpenRouter failure also failed:', initErr);
                    }
                    return this.chatLocalFallback(message, context);
                }
            }
        }
    }

    async chatLocalFallback(message, context = []) {
        console.log('Using local fallback model.');
        const prompt = context.map(entry => `${entry.role}: ${entry.content}`).join('\n') + `\nUser: ${message}\nAssistant:`;
        // Ensure the local model is loaded and callable
        if (!this.model || typeof this.model !== 'function') {
            console.log('Local model not ready; attempting to initialize local model...');
            // Force local-only mode and attempt to load a compatible pipeline
            try {
                this.orKey = '';
                this.useOpenRouter = false;
                await this.initialize();
            } catch (e) {
                console.error('Failed to initialize local model for fallback:', e);
                throw new Error('No local model available');
            }
        }

        // Some Xenova pipelines return an array/object; normalize to text
        try {
            const raw = await this.model(prompt, { max_length: this.maxTokens });
            let text = '';
            if (typeof raw === 'string') text = raw;
            else if (Array.isArray(raw) && raw.length > 0) {
                // attempt to find generated_text property
                if (raw[0].generated_text) text = raw[0].generated_text;
                else text = String(raw[0]);
            } else if (raw && raw.generated_text) text = raw.generated_text;
            else text = String(raw);

            return {
                text,
                model: this.modelName,
                tokens: text.split(/\s+/).length,
                hemisphere: 'local'
            };
        } catch (err) {
            console.error('Error invoking local model pipeline:', err);
            throw err;
        }
    }

    async generate(prompt, options = {}) {
        if (!this.isLoaded) {
            await this.initialize();
        }

        if (this.useOpenRouter) {
            // emulate generate via chat with a single user message
            const resp = await this.chatOpenRouter(prompt, []);
            return { ...resp, model: this.orModel };
        }

        const config = {
            max_new_tokens: options.maxTokens || 100, // Reduced for faster response
            temperature: options.temperature || 0.75, // Slightly higher for more natural responses
            do_sample: true,
            top_p: options.topP || 0.92,
            top_k: 50, // Limit vocabulary for faster generation
            repetition_penalty: 1.15, // Prevent repetition
            num_beams: 1, // Disable beam search for speed
            early_stopping: true,
            ...options
        };

        try {
            console.log('💎 Gemma generating response (optimized for speed)...');
            const startTime = performance.now();
            
            const response = await this.model(prompt, config);
            
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);
            
            const generatedText = response[0].generated_text.replace(prompt, '').trim();
            
            console.log(`✅ Gemma response generated in ${responseTime}ms`);
            return {
                text: generatedText,
                model: 'gemma',
                tokens: generatedText.split(' ').length,
                hemisphere: 'gemini',
                responseTime
            };
        } catch (error) {
            console.error('❌ Gemma generation failed:', error);
            throw error;
        }
    }

    async chat(message, context = []) {
        if (!this.isLoaded) {
            await this.initialize();
        }

        if (this.useOpenRouter) {
            try {
                return await this.chatOpenRouter(message, context);
            } catch (e) {
                console.warn('OpenRouter chat failed, falling back to local model:', e);
            }
        }

        // Simplified prompt format for faster processing (local fallback)
        let prompt = '';
        
        // Only include last 2 messages for context to speed up processing
        const recentContext = context.slice(-3);
        
        if (recentContext.length > 0) {
            recentContext.forEach(msg => {
                const role = msg.role === 'system' ? 'System' : msg.role === 'user' ? 'User' : 'Assistant';
                prompt += `${role}: ${msg.content}\n\n`;
            });
        }
        
        prompt += `User: ${message}\n\nAssistant:`;
        
        // Use faster settings for chat
        return await this.generate(prompt, { maxTokens: 120, temperature: 0.8 });
    }

    async agentOperation(task, context = '') {
        let prompt = 'Agent Operation Task\n\n';
        if (context) {
            prompt += `Context: ${context}\n\n`;
        }
        prompt += `Task: ${task}\n\nAgent Response:`;
        
        return await this.generate(prompt, { maxTokens: 150 });
    }

    async generateEcho(userInput, systemState) {
        const prompt = `Generate an intelligent echo response for Agent Lee system.

User Input: ${userInput}
System State: ${JSON.stringify(systemState)}

Generate a helpful, contextual response that acknowledges the input and provides relevant information or next steps:`;
        
        return await this.generate(prompt, { maxTokens: 100, temperature: 0.8 });
    }

    async processWithContext(input, context) {
        if (!this.isLoaded) {
            await this.initialize();
        }

        const combinedInput = `${context}\n${input}`;
        console.log('Processing with context:', combinedInput);

        const result = await this.model(combinedInput, {
            max_length: this.maxTokens,
        });

        return result;
    }

    getStatus() {
        return {
            model: 'gemma',
            name: 'Gemma 2B',
            isLoaded: this.isLoaded,
            isLoading: this.isLoading,
            progress: this.loadingProgress,
            hemisphere: 'gemini',
            color: '#FF8C00',
            capabilities: ['chat', 'agents', 'echo', 'summarization'],
            contextLength: this.maxTokens
        };
    }
}

export const gemmaLLM = new GemmaLLM();
window.gemmaLLM = gemmaLLM;
// Expose the constructor on window so external modules can instantiate new instances
// of GemmaLLM directly. Without this, LEW.llm falls back to stub classes.
window.GemmaLLM = GemmaLLM;
