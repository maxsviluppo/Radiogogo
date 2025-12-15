import React, { useState } from 'react';
import { RadioStation } from '../types';

interface SettingsMenuProps {
  stations: RadioStation[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string, genre: string, country: string, autoPlay?: boolean) => void;
  onDeleteStation?: (id: string) => void;
  onResetStations?: () => void;
  onClearOffline?: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  stations, 
  onSelectStation,
  onAddStation,
  onDeleteStation,
  onResetStations,
  onClearOffline
}) => {
  // Default to 'local' since Skin is removed
  const [activeTab, setActiveTab] = useState<'local' | 'data' | 'add' | 'link'>('local');
  
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');

  const handleManualAdd = () => {
      if(newName && newUrl) {
          onAddStation(newName, newUrl, 'Custom', 'User', true);
          setNewName('');
          setNewUrl('');
      }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
        Array.from(files).forEach((file: File) => {
            const objectUrl = URL.createObjectURL(file);
            // Don't auto-play when batch importing
            onAddStation(file.name.replace(/\.[^/.]+$/, ""), objectUrl, 'Local File', 'My Device', false);
        });
    }
    e.target.value = '';
  };

  // Filter for Local Files
  const localStations = stations.filter(s => s.country === 'My Device' || s.genre === 'Local File');

  return (
    <div className="w-full h-full bg-[#111] text-white font-sans flex flex-col overflow-hidden">
      <div className="bg-gradient-to-b from-[#222] to-[#111] border-b border-white/10 p-2 shrink-0">
          <h2 className="text-center font-bold text-xs text-gray-300 uppercase tracking-widest">System Config</h2>
      </div>

      <div className="flex border-b border-white/10 bg-[#0a0a0a] overflow-x-auto no-scrollbar shrink-0">
          {['local', 'data', 'add', 'link'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 px-2 text-[9px] font-bold uppercase tracking-wider min-w-[50px] ${activeTab === tab ? 'bg-[#222] text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar touch-pan-y">
          
          {activeTab === 'local' && (
             <div className="flex flex-col h-full pt-2">
                <div className="text-center mb-4 shrink-0">
                    <p className="text-[10px] text-gray-400 mb-2">
                        Seleziona file dal tuo dispositivo per creare la tua libreria.
                    </p>
                    
                    <label className="block w-full cursor-pointer">
                      <input 
                        type="file" 
                        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac" 
                        multiple 
                        onChange={handleFileUpload} 
                        className="hidden" 
                      />
                      <div className="w-full py-3 bg-blue-700 hover:bg-blue-600 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                         <span>+ Importa Musica</span>
                      </div>
                    </label>
                </div>

                {/* SCROLLABLE LIST OF LOCAL FILES */}
                <div className="flex-1 overflow-y-auto custom-scrollbar border border-[#222] rounded bg-[#080808] p-1">
                    {localStations.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-2 min-h-[100px]">
                            <span className="text-xl">♫</span>
                            <span className="text-[10px]">Nessun file caricato</span>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            {localStations.map((station) => (
                                <div key={station.id} className="group flex items-center justify-between p-2 rounded hover:bg-[#1a1a1a] transition-colors border border-transparent hover:border-[#333]">
                                    <button 
                                        className="flex-1 flex items-center gap-3 text-left overflow-hidden"
                                        onClick={() => onSelectStation(station)}
                                    >
                                        <div className="w-8 h-8 rounded bg-blue-900/20 flex items-center justify-center text-blue-400 shrink-0">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                        </div>
                                        <div className="flex flex-col truncate">
                                            <span className="text-[11px] font-bold text-gray-300 truncate group-hover:text-white">{station.name}</span>
                                            <span className="text-[9px] text-gray-600">Local Audio</span>
                                        </div>
                                    </button>
                                    
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); if(onDeleteStation) onDeleteStation(station.id); }}
                                        className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
             </div>
          )}

          {activeTab === 'data' && (
              <div className="space-y-4 pt-2 text-center">
                  <div className="p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-lg">
                      <h3 className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest mb-2">Gestione Dati</h3>
                      <p className="text-[9px] text-gray-400 mb-4 leading-relaxed">
                          Gestisci la tua libreria radio.<br/>
                          Usa queste opzioni per pulire o ripristinare.
                      </p>
                      
                      <div className="space-y-2">
                          <button onClick={onResetStations} className="w-full py-2 bg-[#222] hover:bg-yellow-900/40 border border-[#333] hover:border-yellow-700 rounded text-xs font-bold uppercase tracking-wider transition-all">
                              ↻ Aggiorna / Ripristina
                          </button>
                          <button onClick={onClearOffline} className="w-full py-2 bg-[#222] hover:bg-red-900/40 border border-[#333] hover:border-red-700 rounded text-xs font-bold uppercase tracking-wider transition-all">
                              ⚠ Pulisci Radio Offline
                          </button>
                      </div>
                  </div>
                  <div className="text-[9px] text-gray-600 mt-4 font-mono">DATABASE: {stations.length} STATIONS</div>
              </div>
          )}

          {activeTab === 'add' && (
              <div className="space-y-4 pt-2">
                  <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Station Name</label>
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
                  </div>
                  <div>
                      <label className="block text-[10px] text-gray-500 uppercase font-bold mb-1">Stream URL (mp3/m3u8)</label>
                      <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-green-500" />
                  </div>
                  <button onClick={handleManualAdd} className="w-full py-2 bg-green-700 hover:bg-green-600 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95">
                      Save Station
                  </button>
              </div>
          )}

          {activeTab === 'link' && (
              <div className="space-y-4 pt-2 text-center">
                  <p className="text-[10px] text-gray-400 leading-relaxed px-4 mb-2">Aggiungi stream web diretto.</p>
                  <input type="text" value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://..." className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" />
                  <button onClick={() => { if(ytUrl) { onAddStation('Web Stream', ytUrl, 'Stream', 'Web', true); setYtUrl(''); }}} className="w-full py-2 bg-red-900/50 hover:bg-red-800/50 border border-red-800 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95">
                      Add Link
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};

export default SettingsMenu;