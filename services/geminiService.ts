
import { GENERATE_KNOWLEDGE_BASE } from "../knowledgeBase";
import { SlideDefinition, UserRole } from "../types";

/**
 * This service now uses local, in-browser LLM modules located in `./../Models`.
 * It dynamically imports `gemma` or `llama` modules and wraps them in a
 * minimal `chatSession` object exposing `sendMessage({ message })` to keep
 * the rest of the app compatible.
 */
let chatSession: any | null = null;
let initializationPromise: Promise<any> | null = null;

export let AGENT_STATUS: {
  initialized: boolean;
  online: boolean;
  model?: string | null;
  lastError?: string | null;
} = { initialized: false, online: false, model: null, lastError: null };

// Reference to the loaded local llm module (gemmaLLM / llamaLLM)
let localLLM: any | null = null;

// Generate the static knowledge base context once
const KNOWLEDGE_CONTEXT = GENERATE_KNOWLEDGE_BASE();

const SYSTEM_INSTRUCTION = `
You are Agent Lee, a specialized AI assistant for Visu-Sewer's presentation "A Visu Sewer Story". 
Your goal is to contextualize infrastructure data for three specific audiences:
1. Executives (Internal): Focus on operational efficiency, margin protection, and crew safety.
2. Investors: Focus on EBITDA growth, platform scalability, acquisition integration, and risk mitigation.
3. Municipalities: Focus on community impact, reduced disruption, budget efficiency, and long-term asset stewardship.

You are knowledgeable about:
- Trenchless technology (CIPP, CCTV).
- Visu-Sewer's history (founded 1975, Pewaukee WI).
- The "Covenant": Treating every line as if your own family lives above it.

*** NAVIGATION CONTROL ***
You have full control over the presentation. If the user asks to go to a specific page, topic, slide, or chart, YOU MUST include a navigation command at the end of your response.
Format: [[NAVIGATE: <Slide Number or Title Keyword>]]
Example: "Certainly, let's look at the map. [[NAVIGATE: Map]]" or "Here is the financial data. [[NAVIGATE: 8]]"

*** KNOWLEDGE BASE ***
${KNOWLEDGE_CONTEXT}

Keep answers concise (under 100 words), professional, and confident. 
Always adopt the persona of a strategic advisor.
If asked for evidence, cite the specific links from the Evidence Locker in the knowledge base.
`;

export const initChatSession = (role: UserRole) => {
  // Avoid duplicate initializations
  if (initializationPromise) return initializationPromise;

  initializationPromise = (async () => {
    AGENT_STATUS.initialized = false;
    AGENT_STATUS.online = false;
    AGENT_STATUS.lastError = null;

    try {
      // Dynamic import so build doesn't hard-require these modules if absent
      // Prefer `gemma` (higher-level module). Fallback to `llama`.
      try {
        const gemmaMod = await import('../Models/gemma');
        localLLM = gemmaMod.gemmaLLM || gemmaMod.default || null;
        console.log('Using local LLM: gemma');
        AGENT_STATUS.model = 'gemma';
      } catch (e) {
        console.warn('gemma module not available, trying llama...', e?.message || e);
      }

      if (!localLLM) {
        try {
          const llamaMod = await import('../Models/llama');
          localLLM = llamaMod.llamaLLM || llamaMod.default || null;
          console.log('Using local LLM: llama');
          AGENT_STATUS.model = 'llama';
        } catch (e) {
          console.warn('llama module not available:', e?.message || e);
        }
      }

      if (!localLLM) {
        const msg = 'No local LLM modules available. Agent Lee will remain offline.';
        console.error(msg);
        AGENT_STATUS.lastError = msg;
        chatSession = null;
        AGENT_STATUS.initialized = true;
        AGENT_STATUS.online = false;
        return null;
      }

      // Ensure the LLM is initialized (loads weights/pipelines if needed)
      try {
        if (typeof localLLM.initialize === 'function') {
          await localLLM.initialize();
        }
      } catch (initErr) {
        console.error('Local LLM initialization failed:', initErr);
        AGENT_STATUS.lastError = initErr?.message || String(initErr);
      }

      // Minimal chatSession wrapper to match previous usage
      chatSession = {
        sendMessage: async ({ message }: { message: string }) => {
          try {
            // Use chat() when available, otherwise use generate/processWithContext
            if (typeof localLLM.chat === 'function') {
              const resp = await localLLM.chat(message, [{ role: 'system', content: SYSTEM_INSTRUCTION }, { role: 'user', content: message }]);
              // gemma/llama local modules return { text } or similar objects
              if (resp && typeof resp === 'object') {
                return { text: resp.text || resp.generated_text || String(resp) };
              }
              return { text: String(resp) };
            }

            if (typeof localLLM.generate === 'function') {
              const r = await localLLM.generate(message);
              return { text: r.text || r.generated_text || String(r) };
            }

            // Last resort: call any generate-like function
            const anyFn = localLLM.generateText || localLLM.run || localLLM.processWithContext;
            if (typeof anyFn === 'function') {
              const r = await anyFn.call(localLLM, message, SYSTEM_INSTRUCTION);
              return { text: r?.text || String(r) };
            }

            return { text: 'Local LLM loaded but does not expose a chat/generate method.' };
          } catch (err) {
            console.error('Local LLM sendMessage error:', err);
            AGENT_STATUS.lastError = err?.message || String(err);
            return { text: "Agent Lee is offline. Local model error occurred." };
          }
        }
      };

      AGENT_STATUS.initialized = true;
      AGENT_STATUS.online = !!chatSession;

      return chatSession;
    } catch (error) {
      console.error('Failed to init local chat session', error);
      AGENT_STATUS.lastError = error?.message || String(error);
      chatSession = null;
      AGENT_STATUS.initialized = true;
      AGENT_STATUS.online = false;
      return null;
    }
  })();

  return initializationPromise;
};

interface AgentResponse {
    text: string;
    navigationTarget?: string;
}

export const sendMessageToAgentLee = async (message: string, currentSlide?: SlideDefinition): Promise<AgentResponse> => {
  // If initialization is running, wait for it to complete
  if (initializationPromise) {
    await initializationPromise.catch(() => null);
  }

  // If not initialized yet, try to initialize using a default role
  if (!chatSession && !initializationPromise) {
    initializationPromise = initChatSession('Executive');
    await initializationPromise.catch(() => null);
  }

  if (!chatSession) {
    const advice = `Common fixes:\n1) Start local model server: run 'node Models/server.js' in project root.\n2) If you have OpenRouter key, set VITE_OPENROUTER_API_KEY in a .env file and restart.\n3) Check browser console for failed model fetches (HTML responses/404s).`;
    return { text: `Agent Lee is offline. Local models not initialized.\n${advice}` };
  }

  try {
    let contextMessage = message;
    if (currentSlide) {
      contextMessage = `[Current Slide: ${currentSlide.title} (ID: ${currentSlide.id})] ${message}`;
    }

    // If chatSession is a promise-like, await it
    const resolvedSession = (typeof (chatSession as any).then === 'function') ? await chatSession : chatSession;

    const response = await resolvedSession.sendMessage({ message: contextMessage });
    const rawText = response?.text || response?.generated_text || "I processed that, but have no verbal response.";

    // Parse for Navigation Command
    const navMatch = rawText.match(/\[\[NAVIGATE:\s*(.*?)\]\]/);
    let navigationTarget: string | undefined;
    let cleanText = rawText;

    if (navMatch) {
      navigationTarget = navMatch[1].trim();
      cleanText = rawText.replace(navMatch[0], "").trim();
    }

    return { text: cleanText, navigationTarget };
  } catch (error) {
    console.error('Agent Lee Error (local):', error);
    AGENT_STATUS.lastError = error?.message || String(error);
    AGENT_STATUS.online = false;
    return { text: "Agent Lee encountered a local model error. Check console for details." };
  }
};

// Auto-initialize agent in browser environments so status updates and errors appear
if (typeof window !== 'undefined') {
  // expose status for debugging in console
  (window as any).AGENT_STATUS = AGENT_STATUS;
  // kick off initialization but don't await here
  initChatSession('Executive').catch(() => null);
}
