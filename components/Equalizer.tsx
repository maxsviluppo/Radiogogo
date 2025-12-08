import React, { useMemo } from 'react';
import { EqualizerBand } from '../types';

interface EqualizerProps {
  bands: EqualizerBand[];
  onChange: (index: number, value: number) => void;
  onClose: () => void;
  accentColor?: string;
}

const PRESETS: Record<string, number[]> = {
  'FLAT': [0, 0, 0, 0, 0],
  'BASS': [8, 5, 2, 0, 0],
  'VOCAL': [-2, 0, 4, 2, 1],
  'TREBLE': [0, 0, 2, 5, 8],
  'CLUB': [6, 2, -2, 4, 6]
};

const Equalizer: React.FC<EqualizerProps> = ({ bands, onChange, onClose, accentColor = '#38bdf8' }) => {
  
  const activePreset = useMemo(() => {
    const current = bands.map(b => b.value);
    const match = Object.entries(PRESETS).find(([_, values]) => 
      values.every((v, i) => Math.abs(v - current[i]) < 0.1)
    );
    return match ? match[0] : null;
  }, [bands]);

  const applyPreset = (values: number[]) => {
    values.forEach((v, i) => onChange(i, v));
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
      <div 
        className="relative bg-slate-900/90 border border-white/10 rounded-2xl w-full max-w-xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        style={{ boxShadow: `0 0 30px ${accentColor}20, inset 0 0 20px rgba(0,0,0,0.5)` }}
      >
        {/* Neon Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="flex justify-between items-center mb-8">
           <h3 className="text-xl font-display font-bold text-white tracking-widest flex items-center gap-3">
             <span className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor, boxShadow: `0 0 10px ${accentColor}` }}></span>
             EQUALIZER
           </h3>
           <button 
             onClick={onClose}
             className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
           >
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
           </button>
        </div>

        {/* Sliders Container */}
        <div className="flex justify-between items-end h-48 mb-8 px-2">
           {bands.map((band, index) => (
             <div key={index} className="flex flex-col items-center gap-4 h-full justify-end group">
                <div className="font-mono text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity mb-[-10px]">
                  {band.value > 0 ? '+' : ''}{band.value}dB
                </div>
                <div className="relative h-full w-2 bg-black/40 rounded-full border border-white/5">
                   {/* Fill */}
                   <div 
                     className="absolute bottom-0 left-0 right-0 rounded-full w-full transition-all duration-100"
                     style={{ 
                       height: `${((band.value + 12) / 24) * 100}%`,
                       backgroundColor: accentColor,
                       boxShadow: `0 0 10px ${accentColor}`
                     }}
                   ></div>
                   
                   {/* Handle */}
                   <div 
                      className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-slate-900 z-10 cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                      style={{ 
                        bottom: `calc(${((band.value + 12) / 24) * 100}% - 8px)`
                      }}
                   ></div>

                   <input
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={band.value}
                    onChange={(e) => onChange(index, parseFloat(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                    style={{ WebkitAppearance: 'slider-vertical' }}
                  />
                </div>
                <div className="text-[10px] md:text-xs font-mono text-slate-500 font-bold uppercase tracking-wider">{band.label}</div>
             </div>
           ))}
        </div>

        {/* Presets */}
        <div className="flex flex-wrap justify-center gap-3 pt-4 border-t border-white/5">
            {Object.entries(PRESETS).map(([name, values]) => {
              const isActive = activePreset === name;
              return (
                <button 
                  key={name}
                  onClick={() => applyPreset(values)}
                  className={`
                    px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all duration-300 border
                    ${isActive 
                      ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-105' 
                      : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30 hover:text-white'
                    }
                  `}
                >
                  {name}
                </button>
              );
            })}
        </div>
      </div>
      
      <style>{`
        input[type=range] {
            writing-mode: bt-lr; /* IE/Edge */
            -webkit-appearance: slider-vertical; /* Webkit */
        }
      `}</style>
    </div>
  );
};

export default Equalizer;