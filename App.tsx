import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RADIO_STATIONS } from './constants';
import { RadioStation, PlayerState, VisualizerMode, EqualizerBand } from './types';
import StationList from './components/StationList';
import Controls from './components/Controls';
import AudioVisualizer from './components/AudioVisualizer';
import SettingsMenu from './components/SettingsMenu';

const App: React.FC = () => {
  // --- STATE ---
  const [stations, setStations] = useState<RadioStation[]>(() => {
    const saved = localStorage.getItem('my_custom_stations');
    if (saved) {
      try { return [...RADIO_STATIONS, ...JSON.parse(saved)]; } catch (e) { return RADIO_STATIONS; }
    }
    return RADIO_STATIONS;
  });

  const [currentStation, setCurrentStation] = useState<RadioStation>(stations[0]);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false, volume: 0.8, isMuted: false, isLoading: false, error: null,
  });
  
  // UI State
  const [viewMode, setViewMode] = useState<'player' | 'menu' | 'settings'>('player'); 
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [wakeLock, setWakeLock] = useState<any>(null);

  // Audio Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // --- AUDIO LOGIC ---
  const initAudioContext = useCallback(() => {
    if (!audioRef.current || audioContextRef.current) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      setAnalyserNode(analyser);
    } catch (e) { console.warn("AudioContext error", e); }
  }, []);

  // Wake Lock
  useEffect(() => {
    const requestLock = async () => {
       if ('wakeLock' in navigator && playerState.isPlaying) {
         try { const l = await (navigator as any).wakeLock.request('screen'); setWakeLock(l); } catch(e){}
       } else if (wakeLock) {
         wakeLock.release().catch(() => {}); setWakeLock(null);
       }
    };
    requestLock();
    return () => { if(wakeLock) wakeLock.release().catch(()=>{}); };
  }, [playerState.isPlaying]);

  // Player Listeners
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    const audio = audioRef.current;
    
    const onWaiting = () => setPlayerState(p => ({ ...p, isLoading: true, error: null }));
    const onPlaying = () => {
        setPlayerState(p => ({ ...p, isLoading: false, isPlaying: true, error: null }));
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    };
    const onError = () => setPlayerState(p => ({ ...p, isLoading: false, isPlaying: false, error: "Offline / Error" }));

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // --- ACTIONS ---
  const handleSelectStation = useCallback((station: RadioStation) => {
    setCurrentStation(station);
    setViewMode('player'); 
    
    if (audioRef.current) {
      setPlayerState(p => ({ ...p, isLoading: true, error: null }));
      audioRef.current.src = station.url;
      audioRef.current.load();
      audioRef.current.play().then(() => initAudioContext()).catch(e => console.log("Autoplay blocked"));
    }
  }, [initAudioContext]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    initAudioContext();
    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(p => ({ ...p, isPlaying: false }));
    } else {
      if (!audioRef.current.src || audioRef.current.src !== currentStation.url) {
        audioRef.current.src = currentStation.url;
      }
      audioRef.current.play().catch(() => setPlayerState(p => ({...p, error: "Premi Play"})));
    }
  };

  const changeStation = (direction: 'next' | 'prev') => {
    const idx = stations.findIndex(s => s.id === currentStation.id);
    let newIdx;
    if (direction === 'next') newIdx = (idx + 1) % stations.length;
    else newIdx = (idx - 1 + stations.length) % stations.length;
    handleSelectStation(stations[newIdx]);
  };

  const handleCenterClick = () => {
    if (viewMode === 'menu' || viewMode === 'settings') {
        setViewMode('player');
    } else {
        const modes: VisualizerMode[] = ['bars', 'wave', 'orb', 'particles'];
        const next = modes[(modes.indexOf(visualizerMode) + 1) % modes.length];
        setVisualizerMode(next);
    }
  };

  const handleMenuClick = () => {
      // Se siamo in settings, torna a player, altrimenti toggle menu/player
      if (viewMode === 'settings') setViewMode('player');
      else setViewMode(prev => prev === 'menu' ? 'player' : 'menu');
  };

  const handleSettingsClick = () => {
      setViewMode(prev => prev === 'settings' ? 'player' : 'settings');
  }

  const handleAddCustomStation = (name: string, url: string, genre: string = 'Custom', country: string = 'User') => {
      const newStation: RadioStation = {
          id: `custom-${Date.now()}`,
          name: name || 'Unknown Station',
          url: url,
          genre: genre,
          country: country,
          color: '#ffffff',
          logo: ''
      };
      
      const newStations = [...stations, newStation];
      setStations(newStations);
      
      // Save custom only
      const customStations = newStations.filter(s => s.id.startsWith('custom-'));
      localStorage.setItem('my_custom_stations', JSON.stringify(customStations));

      handleSelectStation(newStation);
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen w-full bg-[#000] items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Background Ambience (Desktop only) */}
      <div className="hidden md:block absolute inset-0 bg-neutral-900 z-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_100%)]"></div>
      </div>

      {/* THE DEVICE */}
      {/* Mobile: Full Screen (w-full h-full, no rounding). Desktop: Rounded device shape. */}
      <div className="relative z-10 w-full h-full md:max-w-[380px] md:h-[90vh] md:max-h-[700px] bg-gradient-to-b from-[#4a4a4a] via-[#2b2b2b] to-[#1a1a1a] md:rounded-[40px] p-0 md:p-6 shadow-none md:shadow-[0_0_0_2px_#111,0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)] flex flex-col items-center gap-0 md:gap-8">
          
          {/* THE SCREEN */}
          {/* Mobile: Top half. Desktop: Fixed Aspect Ratio */}
          <div className="w-full h-[50vh] md:h-auto md:aspect-[4/3] bg-black md:rounded-lg overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,1)] border-b-4 md:border-[4px] border-[#1a1a1a]">
              
              <div className="absolute inset-0 flex flex-col">
                  
                  {/* Status Bar */}
                  <div className="h-8 md:h-6 bg-gradient-to-b from-[#222] to-[#111] flex items-center justify-between px-3 text-[10px] text-gray-400 font-bold border-b border-white/10 shrink-0">
                      <div className="flex items-center gap-2">
                          {playerState.isPlaying ? <span className="text-blue-400 animate-pulse">▶ LIVE</span> : <span>❚❚ PAUSED</span>}
                          <span>| {viewMode.toUpperCase()}</span>
                      </div>
                      <div className="font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>

                  {/* Main View Area */}
                  <div className="flex-1 relative overflow-hidden bg-[#050505]">
                      
                      {viewMode === 'menu' && (
                          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                              <StationList 
                                stations={stations}
                                currentStation={currentStation}
                                onSelectStation={handleSelectStation}
                                onAddStation={() => {}} 
                                onDeleteStation={() => {}}
                                isPlaying={playerState.isPlaying}
                                isCompact={true}
                              />
                          </div>
                      )}

                      {viewMode === 'settings' && (
                          <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-[#111]">
                              <SettingsMenu 
                                stations={stations}
                                onSelectStation={handleSelectStation}
                                onAddStation={handleAddCustomStation}
                              />
                          </div>
                      )}

                      {viewMode === 'player' && (
                          <div className="absolute inset-0 flex flex-col">
                              {/* Visualizer Area */}
                              <div className="flex-1 relative bg-gradient-to-b from-gray-900 to-black flex items-center justify-center overflow-hidden group">
                                  <div className="absolute inset-0 opacity-20 transition-all duration-1000" style={{background: `radial-gradient(circle at center, ${currentStation.color}, transparent 80%)`}}></div>
                                  
                                  <div className="w-full h-full opacity-100 mix-blend-screen px-0 md:px-2 pt-4">
                                     <AudioVisualizer 
                                        analyser={analyserNode}
                                        isPlaying={playerState.isPlaying}
                                        color={currentStation.color}
                                        mode={visualizerMode}
                                     />
                                  </div>
                              </div>

                              {/* Info Panel (Cleaned up) */}
                              <div className="h-auto py-4 bg-[#0a0a0a] border-t border-white/10 flex flex-col justify-center items-center text-center relative z-10 px-6">
                                   <div className="w-full overflow-hidden whitespace-nowrap mb-1">
                                        <h2 className="text-white font-display font-black text-xl md:text-2xl animate-marquee inline-block min-w-full drop-shadow-md">
                                            {currentStation.name}
                                        </h2>
                                   </div>
                                   <div className="flex gap-2 justify-center items-center mt-1">
                                       <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] text-gray-300 font-bold uppercase tracking-wider border border-white/5">{currentStation.country}</span>
                                       <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] text-gray-300 font-bold uppercase tracking-wider border border-white/5">{currentStation.genre}</span>
                                   </div>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {/* Glass Reflection */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none z-20"></div>
          </div>

          {/* THE CONTROLS AREA */}
          <div className="flex-1 w-full bg-[#1a1a1a] md:bg-transparent flex flex-col items-center justify-center relative pb-8 md:pb-0">
              <Controls 
                  isPlaying={playerState.isPlaying}
                  onTogglePlay={togglePlay}
                  onNext={() => changeStation('next')}
                  onPrev={() => changeStation('prev')}
                  onMenu={handleMenuClick}
                  onCenter={handleCenterClick}
                  onSettings={handleSettingsClick}
              />
          </div>

      </div>

      <style>{`
        @keyframes marquee {
            0% { transform: translateX(0); }
            10% { transform: translateX(0); }
            40% { transform: translateX(-50%); }
            60% { transform: translateX(-50%); }
            90% { transform: translateX(0); }
            100% { transform: translateX(0); }
        }
        .animate-marquee {
            animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;