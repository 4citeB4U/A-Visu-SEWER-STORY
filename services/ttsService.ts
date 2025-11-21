
// Simple wrapper for Web Speech API
class TTSService {
  private synth: SpeechSynthesis;
  private voice: SpeechSynthesisVoice | null = null;
  private isMuted = false;

  constructor() {
    this.synth = window.speechSynthesis;
    // Initialize voices (browsers load async)
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
    this.loadVoices();
  }

  private loadVoices() {
    const voices = this.synth.getVoices();
    // Try to find a professional-sounding male voice (Google US English, Microsoft David, etc.)
    // Fallback to any English voice
    this.voice = 
        voices.find(v => v.name.includes("Google US English")) ||
        voices.find(v => v.name.includes("Microsoft David")) || 
        voices.find(v => v.lang === "en-US") || 
        voices[0];
  }

  public speak(text: string, onEnd?: () => void, onStart?: () => void) {
    // Cancel any currently speaking
    this.cancel();

    // Small delay to ensure cancellation takes effect
    setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(text);
        if (this.voice) {
            utterance.voice = this.voice;
        }
        
        // Rate/Pitch adjustments for "Agent" persona
        utterance.rate = 1.0; 
        utterance.pitch = 1.0;
        
        // Handle Mute via Volume
        utterance.volume = this.isMuted ? 0 : 1;

        utterance.onstart = () => {
            if (onStart) onStart();
        };

        utterance.onend = () => {
            if (onEnd) onEnd();
        };

        utterance.onerror = (e) => {
            // Ignore "interrupted" or "canceled" errors which happen frequently during manual nav
            if (e.error === 'interrupted' || e.error === 'canceled') {
                return;
            }
            console.warn("TTS Event:", e.error);
            // Even on error, trigger onEnd to not hang the auto-pilot
            if (onEnd) onEnd();
        };

        this.synth.speak(utterance);
    }, 50);
  }

  public pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  public resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  public cancel() {
    // Explicitly check if speaking to avoid unnecessary calls
    if (this.synth.speaking || this.synth.pending || this.synth.paused) {
        this.synth.cancel();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.synth.speaking) {
        this.cancel();
    }
  }
}

export const ttsService = new TTSService();
