
import React, { useState, useEffect, useRef } from "react";
import { UserRole, SlideDefinition } from "../types";
import { initChatSession, sendMessageToAgentLee } from "../services/geminiService";

interface AgentLeeProps {
  role: UserRole;
  currentSlide: SlideDefinition;
  isSpeaking: boolean;
  onNavigate: (target: string) => void;
}

interface Message {
  id: number;
  sender: "user" | "agent";
  text: string;
  isStreaming?: boolean;
}

// Helper component for Streaming Text effect
const TypewriterText: React.FC<{ text: string; onComplete: () => void }> = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(intervalId);
        onComplete();
      }
    }, 20); // Speed of streaming

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return <span>{displayedText}</span>;
};

export const AgentLee: React.FC<AgentLeeProps> = ({ role, currentSlide, isSpeaking, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false); // Default closed, waiting for user to open
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "agent", text: `Hello. I am Agent Lee. I am ready to clarify any data on this slide.` }
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initChatSession(role);
  }, [role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = { id: Date.now(), sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsThinking(true);

    const response = await sendMessageToAgentLee(userMsg.text, currentSlide);
    
    setIsThinking(false);
    const agentMsg: Message = { 
        id: Date.now() + 1, 
        sender: "agent", 
        text: response.text,
        isStreaming: true 
    };
    setMessages(prev => [...prev, agentMsg]);

    // Execute Navigation if commanded
    if (response.navigationTarget) {
        onNavigate(response.navigationTarget);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleStreamComplete = (id: number) => {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isStreaming: false } : m));
  };

  // Closed State Button
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-green-950/90 hover:bg-green-900 text-white px-4 py-3 rounded-lg border border-green-700 transition-all hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] whitespace-nowrap backdrop-blur-sm z-50"
      >
        <div className={`w-3 h-3 rounded-full bg-green-500 border border-white ${isSpeaking ? 'animate-[ping_1s_ease-in-out_infinite]' : ''}`}></div>
        <span className="font-bold text-sm uppercase tracking-wider text-green-100">Agent Lee</span>
      </button>
    );
  }

  // Open State Window
  return (
    <div className="fixed bottom-20 left-8 w-[380px] h-[500px] bg-slate-950 border border-green-800/50 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden font-sans animate-[slideUp_0.3s_ease-out]">
      
      {/* Fixed Header - Deeply Green */}
      <div className={`bg-green-950/80 p-4 flex justify-between items-center border-b border-green-800 backdrop-blur-md shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full bg-green-500 border border-green-200 ${isSpeaking ? 'animate-pulse' : ''}`}></div>
            {isSpeaking && <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></div>}
          </div>
          <div>
            <span className="font-black text-white text-base tracking-wide block leading-none">AGENT LEE</span>
            <span className="text-[9px] text-green-400 uppercase tracking-widest font-mono">Intelligence Unit</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-green-400 hover:text-white transition-colors text-xl font-bold">×</button>
      </div>

      {/* Scrollable Messages Area - Fixed Height Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/40 custom-scrollbar relative">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] p-3 rounded-lg text-sm leading-relaxed font-medium shadow-sm ${
              msg.sender === 'user' 
                ? 'bg-blue-900/80 text-white rounded-br-none border border-blue-700' 
                : 'bg-slate-900/90 text-slate-200 rounded-bl-none border border-green-900/30'
            }`}>
              {msg.sender === 'agent' && msg.isStreaming ? (
                  <TypewriterText text={msg.text} onComplete={() => handleStreamComplete(msg.id)} />
              ) : (
                  msg.text
              )}
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-900/90 p-3 rounded-lg rounded-bl-none border border-slate-800 flex gap-1 items-center">
              <span className="text-xs text-green-500 font-mono animate-pulse">Processing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input Area */}
      <div className="p-3 bg-slate-950 border-t border-green-900/50 shrink-0">
        <div className="flex gap-2">
            <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask strategic questions..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/50 placeholder-slate-500 transition-all"
            />
            <button 
            onClick={handleSend}
            disabled={!input.trim() || isThinking}
            className="px-4 py-2 bg-green-800 hover:bg-green-700 text-white rounded text-sm font-bold transition-colors disabled:opacity-50 shadow-lg"
            >
            ➤
            </button>
        </div>
      </div>
    </div>
  );
};
