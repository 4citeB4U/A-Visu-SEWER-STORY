
import React, { useState } from "react";
import { PresentationMode } from "../types";

interface IntroScreenProps {
  onStart: (mode: PresentationMode) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedMode, setSelectedMode] = useState<PresentationMode>("Auto");

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-slate-950"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[800px] md:h-[800px] border border-slate-800/50 rounded-full opacity-30 animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[600px] md:h-[600px] border border-slate-800/50 rounded-full opacity-30 animate-[spin_40s_linear_infinite_reverse]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-3xl w-full flex flex-col items-center text-center space-y-10 animate-[fadeIn_0.8s_ease-out]">
        
        {/* Logo / Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.3)] transform hover:scale-105 transition-transform duration-500">
          <span className="text-4xl font-bold text-white tracking-tighter">V</span>
        </div>

        {/* Titles */}
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-500 text-[10px] font-mono uppercase tracking-widest mb-2">
            Confidential Presentation
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
            A Visu Sewer Story
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            From Pipes to Progress: An interactive journey through the infrastructure underground.
          </p>
        </div>

        {/* Consent / Start Block */}
        <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl">
           <div className="space-y-3 text-left border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                 <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                 <span>System initialized</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                 <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                 <span>AI Agent Lee standby</span>
              </div>
           </div>

           {/* Mode Selection */}
           <div className="grid grid-cols-2 gap-4">
             <button
                onClick={() => setSelectedMode("Auto")}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedMode === "Auto" 
                    ? "bg-orange-600/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
             >
                <div className="text-2xl mb-2">🤖</div>
                <div className="font-bold text-sm uppercase mb-1">Auto-Pilot</div>
                <div className="text-[10px] leading-tight opacity-80">Agent Lee narrates & controls page turns automatically.</div>
             </button>

             <button
                onClick={() => setSelectedMode("Manual")}
                className={`p-4 rounded-lg border text-left transition-all ${
                  selectedMode === "Manual" 
                    ? "bg-orange-600/20 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]" 
                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                }`}
             >
                <div className="text-2xl mb-2">🖐️</div>
                <div className="font-bold text-sm uppercase mb-1">Manual</div>
                <div className="text-[10px] leading-tight opacity-80">Narration plays, but you control the pace and turning.</div>
             </button>
           </div>

           <label className="flex items-start gap-3 cursor-pointer group text-left">
              <div className="relative flex items-center pt-0.5">
                <input 
                    type="checkbox" 
                    checked={isChecked} 
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-600 bg-slate-800 transition-all checked:border-orange-500 checked:bg-orange-500 hover:border-orange-400"
                />
                <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 14 14" fill="none">
                    <path d="M3 8L6 11L11 3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                  I acknowledge the <span className="text-orange-400 font-bold">Covenant</span> and grant permission for Agent Lee to {selectedMode === "Auto" ? "narrate and navigate" : "narrate"} the presentation.
              </div>
           </label>

           <button 
             onClick={() => onStart(selectedMode)}
             disabled={!isChecked}
             className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold rounded-lg shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform active:scale-[0.98]"
           >
             Start Presentation
           </button>
        </div>
        
        <div className="text-[10px] text-slate-600 uppercase tracking-widest">
            Created by Leeway Industries
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
