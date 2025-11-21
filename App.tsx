
import React, { useState, useEffect, useCallback, useRef } from "react";
import { STORY_CONFIG, MOCK_DATA } from "./constants";
import { SlideViewer } from "./components/SlideViewer";
import { AgentLee } from "./components/AgentLee";
import { IntroScreen } from "./components/IntroScreen";
import { FlagBackground } from "./components/FlagBackground";
import { UserRole, PresentationMode } from "./types";
import { ttsService } from "./services/ttsService";

const App: React.FC = () => {
  // State
  const [hasStarted, setHasStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userRole] = useState<UserRole>("Executive"); 
  const [presentationMode, setPresentationMode] = useState<PresentationMode>("Auto");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Ref to prevent race conditions in auto-pilot
  const isManualOverride = useRef(false);

  const slides = STORY_CONFIG.slides;
  const currentSlide = slides[activeIndex];
  const totalSlides = slides.length;

  // Navigation Handlers
  const goToNext = useCallback(() => {
    isManualOverride.current = true; // Flag manual interaction
    ttsService.cancel(); // Stop talking immediately
    setIsSpeaking(false);
    
    // Small delay to ensure state clears before moving
    setTimeout(() => {
        setActiveIndex((prev) => Math.min(prev + 1, totalSlides - 1));
    }, 10);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    isManualOverride.current = true; // Flag manual interaction
    ttsService.cancel(); // Stop talking immediately
    setIsSpeaking(false);
    
    setTimeout(() => {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
    }, 10);
  }, []);

  // Agent Lee Navigation Handler
  const handleAgentNavigation = (target: string) => {
    const targetLower = target.toLowerCase();
    let targetIndex = -1;

    // 1. Try to parse as a number (e.g., "5" or "Page 5")
    const numberMatch = target.match(/(\d+)/);
    if (numberMatch) {
        const pageNum = parseInt(numberMatch[1], 10);
        if (pageNum >= 1 && pageNum <= totalSlides) {
            targetIndex = pageNum - 1;
        }
    }

    // 2. Try to fuzzy match titles or IDs if not a number
    if (targetIndex === -1) {
        targetIndex = slides.findIndex(s => 
            s.title.toLowerCase().includes(targetLower) || 
            s.id.toLowerCase().includes(targetLower) ||
            (s.chartKind && s.chartKind.toLowerCase().includes(targetLower))
        );
    }

    // Execute Navigation
    if (targetIndex !== -1 && targetIndex !== activeIndex) {
        isManualOverride.current = true;
        ttsService.cancel();
        setIsSpeaking(false);
        setTimeout(() => {
            setActiveIndex(targetIndex);
        }, 100);
    }
  };

  // Playback Controls
  const togglePause = () => {
    if (isPaused) {
      ttsService.resume();
      setIsPaused(false);
    } else {
      ttsService.pause();
      setIsPaused(true);
    }
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    ttsService.setMute(newMuteState);
  };

  // Internal Auto-Advance Helper (ignores manual flag)
  const autoAdvance = useCallback(() => {
    if (activeIndex < totalSlides - 1 && !isPaused) {
        setActiveIndex((prev) => prev + 1);
    }
  }, [activeIndex, totalSlides, isPaused]);

  // Start Presentation Handler
  const handleStart = (mode: PresentationMode) => {
    setPresentationMode(mode);
    setHasStarted(true);
    // Ensure we start fresh regarding overrides
    isManualOverride.current = false;
  };

  const toggleMode = (mode: PresentationMode) => {
      setPresentationMode(mode);
      setIsManualOverride(mode === 'Manual');
      if (mode === 'Manual') {
          ttsService.cancel();
          setIsSpeaking(false);
      }
      setIsSettingsOpen(false);
  };

  // Set manual override ref helper
  const setIsManualOverride = (val: boolean) => {
      isManualOverride.current = val;
  };

  // TTS Narration Logic
  useEffect(() => {
    if (!hasStarted) return;

    // If paused, don't start new speech
    if (isPaused) return;

    // MANUAL MODE FIX: Strictly disable auto-speech.
    // User must read manually. No auto-turn will happen because onEnd is never triggered.
    if (presentationMode === "Manual") {
        setIsSpeaking(false);
        return;
    }

    const textToSpeak = `${currentSlide.title}. ${currentSlide.narration.paragraphs.join(" ")}`;

    // Small timeout to allow UI to settle before speaking
    const timer = setTimeout(() => {
        // Double check manual override hasn't happened in the specific interim
        if (isManualOverride.current) return;

        ttsService.speak(
            textToSpeak,
            () => {
                // On End
                if (isManualOverride.current) return; // Don't auto-advance if user interrupted

                setIsSpeaking(false);
                // Only auto-advance if we are in Auto mode AND the user hasn't just clicked a button to go elsewhere
                if (presentationMode === "Auto" && !isPaused) {
                    setTimeout(() => autoAdvance(), 1000);
                }
            },
            () => {
                // On Start
                setIsSpeaking(true);
                // Reset override flag when speech starts
                if (!isManualOverride.current) {
                     // Safe to proceed
                }
            }
        );
    }, 800); 

    return () => {
        clearTimeout(timer);
        // Ensure speech stops if we navigate away or unmount
        if (!isPaused) {
             ttsService.cancel();
        }
    };
  }, [hasStarted, activeIndex, currentSlide, presentationMode, autoAdvance, isPaused]);

  // Keyboard Support
  useEffect(() => {
    if (!hasStarted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrev();
      } else if (e.key === " ") {
        togglePause();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted, goToNext, goToPrev, isPaused]);

  if (!hasStarted) return <IntroScreen onStart={handleStart} />;

  return (
    <div className="h-screen w-screen bg-slate-950 text-white overflow-hidden flex flex-col relative">
        {/* Absolute Background: Realistic Flag */}
        <FlagBackground />

        {/* Main Content Layer (z-10 to sit above flag) */}
        <div className="flex-1 overflow-hidden p-4 lg:p-8 relative z-10">
            <SlideViewer slide={currentSlide} dataSources={MOCK_DATA} isSpeaking={isSpeaking} />
        </div>

        {/* Footer / Watermark / Navigation */}
        <div className="h-16 shrink-0 grid grid-cols-3 items-center px-8 border-t border-blue-900 bg-slate-950/90 backdrop-blur-md text-xs text-slate-400 uppercase tracking-widest z-40 relative shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
            
            {/* Left: Agent Lee Button & Playback Controls */}
            <div className="flex items-center justify-start gap-3 relative">
                 <AgentLee 
                    role={userRole} 
                    currentSlide={currentSlide} 
                    isSpeaking={isSpeaking && !isPaused} 
                    onNavigate={handleAgentNavigation}
                 />
                 
                 {/* Playback Controls */}
                 {presentationMode === "Auto" && (
                    <div className="flex items-center gap-1 bg-slate-900/80 rounded-lg border border-blue-900/50 p-1 shadow-inner">
                        <button 
                        onClick={togglePause}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-900/50 text-white transition-colors"
                        title={isPaused ? "Resume Presentation" : "Pause Presentation"}
                        >
                        {isPaused ? "▶️" : "⏸️"}
                        </button>
                        <button 
                        onClick={toggleMute}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-blue-900/50 text-white transition-colors"
                        title={isMuted ? "Unmute" : "Mute"}
                        >
                        {isMuted ? "🔇" : "🔊"}
                        </button>
                    </div>
                 )}
                 {presentationMode === "Manual" && (
                     <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-500 border border-slate-700">MANUAL</span>
                 )}
                 
                 {/* Settings Toggle Button */}
                 <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-8 h-8 flex items-center justify-center rounded bg-slate-800 hover:bg-blue-900 border border-slate-700 hover:border-blue-500 transition-all text-white"
                    title="Presentation Settings"
                 >
                    ⚙️
                 </button>
            </div>

            {/* Center: Navigation Controls (Prev/Next/Page) */}
            <div className="flex items-center justify-center gap-4">
                <button 
                    onClick={goToPrev} 
                    disabled={activeIndex === 0}
                    className="w-12 h-10 flex items-center justify-center bg-slate-800 hover:bg-blue-900 disabled:opacity-30 rounded border border-slate-700 hover:border-blue-500 transition-all text-white font-bold shadow-lg active:scale-95"
                    title="Previous Slide"
                >
                    ←
                </button>
                <div className="flex flex-col items-center justify-center w-20">
                    <span className="text-white font-bold text-sm leading-none">{activeIndex + 1}</span>
                    <div className="w-full h-0.5 bg-slate-700 mt-1 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-500 transition-all duration-500" 
                            style={{width: `${((activeIndex + 1) / totalSlides) * 100}%`}}
                        />
                    </div>
                    <span className="text-[9px] text-slate-500 leading-none mt-1">OF {totalSlides}</span>
                </div>
                <button 
                    onClick={goToNext}
                    disabled={activeIndex === totalSlides - 1}
                    className="w-12 h-10 flex items-center justify-center bg-red-800 hover:bg-red-700 disabled:opacity-30 rounded border border-red-600 hover:border-red-400 transition-all text-white font-bold shadow-lg active:scale-95"
                    title="Next Slide"
                >
                    →
                </button>
            </div>

            {/* Right: Branding */}
            <div className="flex items-center justify-end gap-4">
                 <span className="font-bold text-slate-400 hidden md:inline">Created by Leeway Industries</span>
                 <span className="text-[10px] px-2 py-0.5 bg-blue-900/30 rounded border border-blue-800/50">v4.2</span>
            </div>
        </div>

        {/* Settings Modal */}
        {isSettingsOpen && (
            <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
                <div className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
                    <div className="p-4 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-bold text-lg">Presentation Settings</h3>
                        <button onClick={() => setIsSettingsOpen(false)} className="text-slate-500 hover:text-slate-800 text-xl font-bold">×</button>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Presentation Mode</label>
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={() => toggleMode("Auto")}
                                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                                        presentationMode === "Auto" 
                                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" 
                                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                                    }`}
                                >
                                    <div className="text-2xl mb-1">🤖</div>
                                    <div className="text-sm">Auto-Pilot</div>
                                </button>
                                <button 
                                    onClick={() => toggleMode("Manual")}
                                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                                        presentationMode === "Manual" 
                                        ? "border-blue-600 bg-blue-50 text-blue-700 font-bold" 
                                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                                    }`}
                                >
                                    <div className="text-2xl mb-1">🖐️</div>
                                    <div className="text-sm">Manual</div>
                                </button>
                            </div>
                        </div>
                        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                            {presentationMode === "Auto" 
                                ? "Agent Lee will automatically read slides and turn pages." 
                                : "You control the pace. Use arrows to navigate. Agent Lee waits for you."}
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default App;
