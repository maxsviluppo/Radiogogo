
import React from 'react';

interface ControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onMenu: () => void;
  onCenter: () => void;
  onSettings: () => void;
}

const Controls: React.FC<ControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  onNext, 
  onPrev,
  onMenu,
  onCenter,
  onSettings
}) => {
  
  return (
    <div className="relative w-full h-full flex items-center justify-center pb-2 sm:pb-6">
        
        {/* CLICK WHEEL - DARK 3D */}
        {/* Added scale-90 for mobile to ensure it fits in shorter viewports */}
        <div className="relative w-64 h-64 group select-none scale-[0.85] sm:scale-100 transition-transform origin-center">
            
            {/* 1. Outer Ring Shadow (Drop Shadow on Chassis) */}
            <div className="absolute inset-0 rounded-full bg-black shadow-[0_10px_30px_rgba(0,0,0,1)] translate-y-2 blur-md opacity-80"></div>

            {/* 2. Main Ring Body (Dark Grey Matte) */}
            <div className="absolute inset-0 rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-[#333]">
                 {/* Gradient Overlay for subtle sheen */}
                 <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50"></div>
                 {/* Inner Shadow to create depth towards center */}
                 <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.05),inset_0_-2px_10px_rgba(0,0,0,0.8)]"></div>
            </div>

            {/* --- TOUCH ZONES / BUTTONS --- */}
            {/* Top: MENU */}
            <button 
                onClick={onMenu} 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-20 w-32 flex items-start justify-center pt-4 z-20 active:brightness-75 transition-all"
            >
                <span className="text-[12px] font-black text-gray-400 tracking-widest uppercase font-sans drop-shadow-[0_-1px_0_rgba(0,0,0,0.8)]">MENU</span>
            </button>
            
            {/* Left: PREV */}
            <button 
                onClick={onPrev} 
                className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-32 flex items-center justify-start pl-4 z-20 active:brightness-75 transition-all"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 drop-shadow-[0_-1px_0_rgba(0,0,0,0.8)]"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2.5"></line></svg>
            </button>
            
            {/* Right: NEXT */}
            <button 
                onClick={onNext} 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-32 flex items-center justify-end pr-4 z-20 active:brightness-75 transition-all"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400 drop-shadow-[0_-1px_0_rgba(0,0,0,0.8)]"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2.5"></line></svg>
            </button>
            
            {/* Bottom: PLAY/PAUSE */}
            <button 
                onClick={onTogglePlay} 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-20 w-32 flex items-end justify-center pb-4 z-20 active:brightness-75 transition-all"
            >
                <div className="flex items-center gap-1 text-gray-400 drop-shadow-[0_-1px_0_rgba(0,0,0,0.8)]">
                    {isPlaying ? 
                        <span className="text-[12px] font-black tracking-widest">||</span> : 
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="mb-0.5"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    }
                    <span className="text-[10px] font-bold opacity-80">II</span>
                </div>
            </button>

            {/* --- CENTER BUTTON (CONCAVE BLACK) --- */}
            <button 
                onClick={onCenter}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-[#080808] border border-[#222] shadow-[inset_0_5px_15px_rgba(0,0,0,1),0_0_0_1px_rgba(0,0,0,0.8)] active:scale-95 transition-all z-30 group-active:shadow-[inset_0_2px_5px_rgba(0,0,0,1)]"
            >
                {/* Glossy Reflection on dark button */}
                <div className="absolute top-2 left-2 right-2 h-[40%] bg-gradient-to-b from-white/5 to-transparent rounded-t-full opacity-30"></div>
            </button>
        </div>

        {/* SETTINGS BUTTON (Tactile Metallic) */}
        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-10 z-40">
            <button 
                onClick={onSettings}
                className="w-10 h-10 rounded-full bg-[#111] border border-[#333] shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center transition-all group"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-blue-400 transition-colors"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
        </div>

    </div>
  );
};

export default Controls;
