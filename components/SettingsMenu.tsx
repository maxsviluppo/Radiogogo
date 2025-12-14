
import React, { useState } from 'react';
import { RadioStation, TextureMode } from '../types';

interface SettingsMenuProps {
  stations: RadioStation[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string, genre: string, country: string) => void;
  currentTexture: TextureMode;
  onSetTexture: (texture: TextureMode) => void;
  eqValues?: { bass: number; mid: number; treble: number };
  onEqChange?: (band: 'bass' | 'mid' | 'treble', value: number) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  stations, 
  onSelectStation, 
  onAddStation,
  currentTexture,
  onSetTexture,
  eqValues,
  onEqChange
}) => {
  const [activeTab, setActiveTab] = useState<'eq' | 'skin' | 'upload' | 'add' | 'link'>('eq');
  
  // Add Form State
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');

  const handleManualAdd = () => {
      if(newName && newUrl) {
          onAddStation(newName, newUrl, 'Custom', 'User');
          setNewName('');
          setNewUrl('');
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      onAddStation(file.name.replace(/\.[^/.]+$/, ""), objectUrl, 'Local File', 'My Device');
    }
    // Reset input value to allow selecting the same file again if needed
    e.target.value = '';
  };

  const textures: {id: TextureMode, name: string, color: string}[] = [
    { id: 'iPod', name: 'iPod Classic', color: '#4a4a4a' },
    { id: 'Cyberpunk', name: 'Cyberpunk Neon', color: '#000000' },
    { id: 'Retro', name: 'Retro Gold', color: '#3e2723' },
  ];

  const renderMixerFader = (label: string, value: number, onChange: (val: number) => void, color: string) => (
      <div className="flex flex-col items-center h-48 w-full group">
          <div className="mb-2 text-[10px] font-mono text-gray-500 font-bold tracking-widest">{value > 0 ? `+${value}` : value}dB</div>
          <div className="relative h-full w-full flex justify-center">
              {/* Track Background */}
              <div className="absolute top-0 bottom-0 w-2 bg-[#000] rounded-full border border-gray-800 shadow-[inset_0_0_5px_rgba(0,0,0,1)]"></div>
              {/* Center Line */}
              <div className="absolute top-0 bottom-0 w-[1px] bg-white/10 z-0"></div>
              
              {/* Fill Level */}
              <div 
                  className="absolute bottom-0 w-1 rounded-full transition-all duration-75 opacity-60"
                  style={{
                      height: `${((value + 12) / 24) * 100}%`,
                      backgroundColor: color,
                      boxShadow: `0 0 10px ${color}`
                  }}
              ></div>

              <input
                type="range"
                min="-12"
                max="12"
                step="1"
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 appearance-none"
                style={{ WebkitAppearance: 'slider-vertical' }}
              />

              {/* Custom Thumb Visual (Calculated position) */}
              <div 
                 className="absolute w-8 h-5 bg-[#1a1a1a] border border-gray-600 rounded-sm shadow-lg pointer-events-none z-10 flex items-center justify-center transition-all duration-75 group-hover:border-white/50"
                 style={{
                     bottom: `calc(${((value + 12) / 24) * 100}% - 10px)`
                 }}
              >
                  <div className="w-full h-[1px] bg-white opacity-50"></div>
                  <div className="absolute w-full h-full opacity-20" style={{backgroundColor: color}}></div>
              </div>
          </div>
          <div className="mt-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-800 px-2 py-0.5 rounded bg-black/40">
              {label}
          </div>
      </div>
  );

  return (
    <div className="w-full min-h-full bg-[#111] text-white font-sans flex flex-col">
      
      {/* Settings Header */}
      <div className="bg-gradient-to-b from-[#222] to-[#111] border-b border-white/10 p-2">
          <h2 className="text-center font-bold text-xs text-gray-300 uppercase tracking-widest">System Config</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#0a0a0a] overflow-x-auto no-scrollbar">
          {['eq', 'skin', 'upload', 'add', 'link'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-2 text-[9px] font-bold uppercase tracking-wider min-w-[50px] ${activeTab === tab ? 'bg-[#222] text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          
          {/* EQ TAB (MIXER) */}
          {activeTab === 'eq' && eqValues && onEqChange && (
              <div className="h-full flex flex-col pt-2">
                  <div className="flex items-center justify-between mb-4 px-2">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">Master EQ</span>
                      <div className="flex gap-1">
                          <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-[8px] text-green-500 font-mono">ACTIVE</span>
                      </div>
                  </div>
                  
                  <div className="flex justify-between gap-4 px-2 pb-4 bg-[#080808] border border-[#222] rounded-lg p-4 shadow-inner">
                      {renderMixerFader("LOW", eqValues.bass, (v) => onEqChange('bass', v), '#ef4444')}
                      {renderMixerFader("MID", eqValues.mid, (v) => onEqChange('mid', v), '#fbbf24')}
                      {renderMixerFader("HIGH", eqValues.treble, (v) => onEqChange('treble', v), '#3b82f6')}
                  </div>
                  
                  <div className="mt-4 text-center">
                      <button 
                         onClick={() => {
                             onEqChange('bass', 0);
                             onEqChange('mid', 0);
                             onEqChange('treble', 0);
                         }}
                         className="px-4 py-1.5 bg-[#222] hover:bg-[#333] border border-[#333] rounded text-[9px] text-gray-400 font-bold uppercase tracking-widest transition-all active:scale-95"
                      >
                          Reset Flat
                      </button>
                  </div>
              </div>
          )}

          {/* SKIN TAB */}
          {activeTab === 'skin' && (
             <div className="space-y-4 pt-2">
                <p className="text-[10px] text-gray-400 text-center mb-4">Seleziona Texture Dispositivo</p>
                <div className="grid grid-cols-1 gap-3">
                  {textures.map((tex) => (
                    <button
                      key={tex.id}
                      onClick={() => onSetTexture(tex.id)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border transition-all
                        ${currentTexture === tex.id 
                          ? 'border-blue-500 bg-white/10 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                          : 'border-[#333] bg-[#222] hover:bg-[#333]'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border border-white/20" style={{backgroundColor: tex.color}}></div>
                        <span className="text-xs font-bold">{tex.name}</span>
                      </div>
                      {currentTexture === tex.id && <span className="text-blue-400 text-[10px]">● ACTIVE</span>}
                    </button>
                  ))}
                </div>
             </div>
          )}

          {/* UPLOAD TAB */}
          {activeTab === 'upload' && (
             <div className="space-y-4 pt-2 text-center">
                <div className="w-16 h-16 bg-blue-900/30 rounded-full mx-auto flex items-center justify-center mb-2 border border-blue-500/50">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed px-4">
                    Carica file audio (mp3, wav, ogg) dal tuo dispositivo.<br/>
                    <span className="text-gray-600 italic">I file rimangono locali e non vengono caricati su server.</span>
                </p>
                
                <label className="block w-full cursor-pointer">
                  <input 
                    type="file" 
                    accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac" 
                    onChange={handleFileUpload} 
                    className="hidden" 
                  />
                  <div className="w-full py-3 bg-blue-700 hover:bg-blue-600 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                     <span>Seleziona File</span>
                  </div>
                </label>
             </div>
          )}

          {/* ADD URL TAB */}
          {activeTab === 'add' && (
              <div className="space-y-4 pt-2">
                  <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Station Name</label>
                      <input 
                        type="text" 
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                      />
                  </div>
                  <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Stream URL (mp3/m3u8)</label>
                      <input 
                        type="text" 
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500"
                      />
                  </div>
                  <button 
                    onClick={handleManualAdd}
                    className="w-full py-2 bg-green-700 hover:bg-green-600 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95"
                  >
                      Save Station
                  </button>
              </div>
          )}

          {/* LINK (YT) TAB */}
          {activeTab === 'link' && (
              <div className="space-y-4 pt-2 text-center">
                  <p className="text-[10px] text-gray-400 leading-relaxed px-4 mb-2">
                      Aggiungi stream web diretto.<br/>
                      <span className="text-red-400 opacity-70 italic">Link YouTube video non supportati nativamente.</span>
                  </p>
                  <input 
                    type="text" 
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                  <button 
                    onClick={() => {
                       if(ytUrl) {
                          onAddStation('Web Stream', ytUrl, 'Stream', 'Web');
                          setYtUrl('');
                       }
                    }}
                    className="w-full py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-800 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95"
                  >
                      Add Link
                  </button>
              </div>
          )}

      </div>
    </div>
  );
};

export default SettingsMenu;
