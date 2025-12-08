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
    <div className="relative w-full h-full flex items-center justify-center">
        
        {/* CLICK WHEEL */}
        <div className="relative w-64 h-64 md:w-64 md:h-64 scale-90 md:scale-100">
            {/* Outer Wheel */}
            <div className="absolute inset-0 rounded-full bg-[#181818] shadow-[0_0_2px_rgba(255,255,255,0.1),inset_0_0_5px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)] border border-[#222]">
                <div className="absolute inset-0 rounded-full opacity-50 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.03)_90deg,transparent_180deg,rgba(255,255,255,0.03)_270deg,transparent_360deg)]"></div>
            </div>

            {/* Buttons */}
            <button onClick={onMenu} className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 hover:text-white tracking-widest uppercase transition-colors p-4">MENU</button>
            <button onClick={onPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2"></line></svg>
            </button>
            <button onClick={onNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors p-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2"></line></svg>
            </button>
            <button onClick={onTogglePlay} className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white transition-colors flex gap-1 p-4">
                {isPlaying ? <span className="text-xs font-bold">||</span> : <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>}
                <span className="text-xs">▶||</span>
            </button>

            {/* Center Button */}
            <button 
                onClick={onCenter}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-gradient-to-b from-[#111] to-[#000] border border-[#222] shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_2px_5px_rgba(0,0,0,0.5)] active:scale-95 active:shadow-inner transition-transform flex items-center justify-center group"
            >
                <div className="w-full h-full rounded-full bg-[#111] opacity-0 group-active:opacity-20"></div>
            </button>
        </div>

        {/* SETTINGS BUTTON (New 3D Button) */}
        <div className="absolute bottom-0 left-8 md:bottom-[-20px] md:left-0 flex flex-col items-center gap-1">
            <button 
                onClick={onSettings}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-[#333] to-[#111] border border-[#444] shadow-[0_4px_6px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)] active:translate-y-[1px] active:shadow-none flex items-center justify-center group transition-all"
                title="Configuration"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-white transition-colors"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </button>
            <span className="text-[9px] text-gray-500 font-bold tracking-wider uppercase">Mode</span>
        </div>

    </div>
  );
};

export default Controls;