import React, { useState } from 'react';
import { RadioStation } from '../types';

interface SettingsMenuProps {
  stations: RadioStation[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string, genre: string, country: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ stations, onSelectStation, onAddStation }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'filter' | 'add' | 'yt'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  
  // Add Form State
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');

  // Derived Data
  const uniqueCountries = ['All', ...Array.from(new Set(stations.map(s => s.country)))];
  
  const filteredStations = stations.filter(s => {
      if (activeTab === 'search') {
          return s.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      if (activeTab === 'filter') {
          return selectedCountry === 'All' || s.country === selectedCountry;
      }
      return true;
  });

  const handleManualAdd = () => {
      if(newName && newUrl) {
          onAddStation(newName, newUrl, 'Custom', 'User');
          setNewName('');
          setNewUrl('');
          // Visual feedback removed to keep it cleaner
      }
  };

  const handleYtAdd = () => {
      if(ytUrl) {
          // Nota importante per l'utente
          if (ytUrl.includes('youtube.com') || ytUrl.includes('youtu.be')) {
             alert("Nota: I link video di YouTube non funzionano direttamente nei player web standard senza un proxy. Inserisci un link diretto a un file audio (mp3/stream) o usa un servizio di conversione.");
          }
          
          onAddStation('Web Stream', ytUrl, 'Stream', 'Web');
          setYtUrl('');
      }
  };

  return (
    <div className="w-full min-h-full bg-[#111] text-white font-sans flex flex-col">
      
      {/* Settings Header */}
      <div className="bg-gradient-to-b from-[#222] to-[#111] border-b border-white/10 p-2">
          <h2 className="text-center font-bold text-xs text-gray-300 uppercase tracking-widest">System Config</h2>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 bg-[#0a0a0a]">
          {['search', 'filter', 'add', 'link'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider ${activeTab === (tab === 'link' ? 'yt' : tab) ? 'bg-[#222] text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="flex-1 p-4">
          
          {/* SEARCH TAB */}
          {activeTab === 'search' && (
              <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Search station..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <div className="space-y-1">
                      {filteredStations.slice(0, 10).map(s => (
                          <div key={s.id} onClick={() => onSelectStation(s)} className="p-2 hover:bg-white/10 rounded cursor-pointer flex justify-between items-center group">
                              <span className="text-xs font-bold text-gray-300 group-hover:text-white">{s.name}</span>
                              <span className="text-[9px] text-gray-600">{s.genre}</span>
                          </div>
                      ))}
                      {filteredStations.length === 0 && <p className="text-xs text-gray-600 text-center mt-4">No results.</p>}
                  </div>
              </div>
          )}

          {/* FILTER TAB */}
          {activeTab === 'filter' && (
              <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                      {uniqueCountries.map(c => (
                          <button 
                            key={c}
                            onClick={() => setSelectedCountry(c)}
                            className={`px-3 py-1 rounded-full text-[10px] border ${selectedCountry === c ? 'bg-blue-600 border-blue-500 text-white' : 'bg-transparent border-[#333] text-gray-400'}`}
                          >
                              {c}
                          </button>
                      ))}
                  </div>
                  <div className="h-[1px] bg-white/5 w-full"></div>
                  <div className="space-y-1">
                      {filteredStations.slice(0, 10).map(s => (
                          <div key={s.id} onClick={() => onSelectStation(s)} className="p-2 hover:bg-white/10 rounded cursor-pointer flex justify-between items-center">
                              <span className="text-xs font-bold text-gray-300">{s.name}</span>
                              <span className="text-[9px] px-1 rounded bg-white/5 text-gray-500">{s.genre}</span>
                          </div>
                      ))}
                  </div>
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
                        placeholder="https://stream.example.com/audio.mp3"
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

          {/* LINK/YOUTUBE TAB */}
          {activeTab === 'yt' && (
              <div className="space-y-4 pt-2 text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full mx-auto flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="black"></polygon></svg>
                  </div>
                  <p className="text-[10px] text-gray-400 leading-relaxed px-4">
                      Inserisci URL diretto audio (mp3, aac, m3u).<br/>
                      <span className="text-red-400 opacity-70 italic">Link YouTube video non supportati.</span>
                  </p>
                  <input 
                    type="text" 
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                  <button 
                    onClick={handleYtAdd}
                    className="w-full py-2 bg-red-700 hover:bg-red-600 rounded text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95"
                  >
                      Load Stream
                  </button>
              </div>
          )}

      </div>
    </div>
  );
};

export default SettingsMenu;