
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RADIO_STATIONS } from './constants';
import { RadioStation, PlayerState, VisualizerMode, TextureMode } from './types';
import StationList from './components/StationList';
import Controls from './components/Controls';
import AudioVisualizer from './components/AudioVisualizer';
import SettingsMenu from './components/SettingsMenu';
import { getStationVibe } from './services/geminiService';

const App: React.FC = () => {
  // --- STATE ---
  const [stations, setStations] = useState<RadioStation[]>(() => {
    const saved = localStorage.getItem('my_custom_stations');
    if (saved) {
      try { return [...RADIO_STATIONS, ...JSON.parse(saved)]; } catch (e) { return RADIO_STATIONS; }
    }
    return RADIO_STATIONS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_favorites');
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [currentStation, setCurrentStation] = useState<RadioStation>(stations[0]);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false, volume: 0.8, isMuted: false, isLoading: false, error: null,
  });
  
  const [viewMode, setViewMode] = useState<'player' | 'menu' | 'settings'>('player'); 
  const [visualizerMode, setVisualizerMode] = useState<VisualizerMode>('bars');
  const [textureMode, setTextureMode] = useState<TextureMode>('iPod');
  const [stationVibe, setStationVibe] = useState<string>("Loading vibes...");
  const [wakeLock, setWakeLock] = useState<any>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // --- AI VIBE ---
  useEffect(() => {
    let isMounted = true;
    setStationVibe("Scanning frequencies...");
    getStationVibe(currentStation).then(vibe => {
      if (isMounted) setStationVibe(vibe);
    });
    return () => { isMounted = false; };
  }, [currentStation]);

  // --- AUDIO SETUP ---
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

  // --- WAKE LOCK ---
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

  // --- AUDIO LISTENERS ---
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = "anonymous";
    const audio = audioRef.current;
    
    const onWaiting = () => setPlayerState(p => ({ ...p, isLoading: true, error: null }));
    const onPlaying = () => {
        setPlayerState(p => ({ ...p, isLoading: false, isPlaying: true, error: null }));
        if (audioContextRef.current?.state === 'suspended') audioContextRef.current.resume();
    };
    const onError = () => setPlayerState(p => ({ ...p, isLoading: false, isPlaying: false, error: "Stream Offline" }));

    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  // --- HANDLERS ---
  const handleSelectStation = useCallback((station: RadioStation) => {
    setCurrentStation(station);
    setViewMode('player'); 
    
    if (audioRef.current) {
      setPlayerState(p => ({ ...p, isLoading: true, error: null }));
      audioRef.current.src = station.url;
      audioRef.current.load();
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => initAudioContext())
          .catch(e => console.log("Autoplay blocked or stream error"));
      }
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
      audioRef.current.play().catch(() => setPlayerState(p => ({...p, error: "Tap Play"})));
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
        // In player, toggle visualizer
        const modes: VisualizerMode[] = ['bars', 'wave', 'orb', 'particles'];
        const next = modes[(modes.indexOf(visualizerMode) + 1) % modes.length];
        setVisualizerMode(next);
    }
  };

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
      
      if (!url.startsWith('blob:')) {
         const customStations = newStations.filter(s => s.id.startsWith('custom-'));
         localStorage.setItem('my_custom_stations', JSON.stringify(customStations));
      }
      handleSelectStation(newStation);
  };

  const handleReorderFavorites = (newOrder: string[]) => {
      setFavorites(newOrder);
      localStorage.setItem('my_favorites', JSON.stringify(newOrder));
  };

  const getTextureStyles = () => {
    switch(textureMode) {
      case 'Cyberpunk': return "bg-black md:rounded-none md:border-2 md:border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.3)]";
      case 'Retro': return "bg-gradient-to-br from-[#3e2723] to-[#1a1110] md:rounded-[10px] md:border-4 md:border-[#5d4037] shadow-[0_0_0_2px_#222]";
      case 'iPod': default: return "bg-gradient-to-b from-[#4a4a4a] via-[#2b2b2b] to-[#1a1a1a] md:rounded-[40px] md:shadow-[0_0_0_2px_#111,0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.2)]";
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#000] items-center justify-center overflow-hidden font-sans select-none">
      
      {/* Background */}
      <div className="hidden md:block absolute inset-0 bg-neutral-900 z-0">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#333_0%,_#000_100%)]"></div>
          {textureMode === 'Cyberpunk' && <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>}
      </div>

      {/* DEVICE */}
      <div className={`relative z-10 w-full h-full md:max-w-[380px] md:h-[90vh] md:max-h-[700px] p-0 md:p-6 flex flex-col items-center gap-0 md:gap-8 transition-all duration-500 ${getTextureStyles()}`}>
          
          {/* SCREEN */}
          <div className={`w-full h-[50vh] md:h-auto md:aspect-[4/3] bg-black overflow-hidden relative border-b-4 md:border-[4px] border-[#1a1a1a]
             ${textureMode === 'Retro' ? 'md:rounded-none border-[#8d6e63]' : 'md:rounded-lg'}
             ${textureMode === 'Cyberpunk' ? 'border-cyan-900 shadow-[0_0_10px_rgba(0,255,255,0.2)]' : 'shadow-[inset_0_0_20px_rgba(0,0,0,1)]'}
          `}>
              <div className="absolute inset-0 flex flex-col">
                  {/* Status Bar */}
                  <div className={`h-8 md:h-6 flex items-center justify-between px-3 text-[10px] font-bold shrink-0
                      ${textureMode === 'Cyberpunk' ? 'bg-cyan-950 text-cyan-400 border-b border-cyan-800' : 'bg-gradient-to-b from-[#222] to-[#111] text-gray-400 border-b border-white/10'}
                  `}>
                      <div className="flex items-center gap-2">
                          {playerState.isPlaying ? <span className={`${textureMode==='Cyberpunk'?'text-cyan-300':'text-blue-400'} animate-pulse`}>▶ LIVE</span> : <span>❚❚ PAUSED</span>}
                          <span>| {viewMode === 'player' ? 'NOW PLAYING' : viewMode.toUpperCase()}</span>
                      </div>
                      <div className="font-mono">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 relative overflow-hidden bg-[#050505]">
                      
                      {viewMode === 'menu' && (
                          <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                              <StationList 
                                stations={stations}
                                currentStation={currentStation}
                                favorites={favorites}
                                onSelectStation={handleSelectStation}
                                onAddStation={() => {}} 
                                onDeleteStation={() => {}}
                                onReorderFavorites={handleReorderFavorites}
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
                                currentTexture={textureMode}
                                onSetTexture={setTextureMode}
                              />
                          </div>
                      )}

                      {viewMode === 'player' && (
                          <div className="absolute inset-0 flex flex-col p-4">
                              {/* Station Info */}
                              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                                  {playerState.isLoading ? (
                                      <div className="animate-spin text-2xl">↻</div>
                                  ) : (
                                    <>
                                        <div className="w-16 h-16 rounded bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg border border-white/10 flex items-center justify-center mb-2">
                                            <span className="text-2xl font-bold text-gray-500">{currentStation.name.substring(0,2).toUpperCase()}</span>
                                        </div>
                                        <h2 className="text-lg font-bold text-white tracking-wide">{currentStation.name}</h2>
                                        <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">{currentStation.genre}</p>
                                        <p className="text-[10px] text-gray-500 italic mt-2 max-w-[80%]">{stationVibe}</p>
                                        {playerState.error && <p className="text-red-500 text-xs font-bold mt-2 bg-red-900/20 px-2 py-1 rounded border border-red-900">{playerState.error}</p>}
                                    </>
                                  )}
                              </div>

                              {/* Visualizer Area */}
                              <div className="h-20 w-full mt-4 bg-black/50 rounded border border-white/5 overflow-hidden">
                                  <AudioVisualizer 
                                      analyser={analyserNode} 
                                      isPlaying={playerState.isPlaying}
                                      color={textureMode === 'Cyberpunk' ? '#06b6d4' : (currentStation.color || '#3b82f6')}
                                      mode={visualizerMode}
                                  />
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* CONTROLS AREA */}
          <div className="flex-1 w-full flex flex-col items-center justify-center relative">
               <Controls 
                  isPlaying={playerState.isPlaying}
                  onTogglePlay={togglePlay}
                  onNext={() => changeStation('next')}
                  onPrev={() => changeStation('prev')}
                  onMenu={() => setViewMode(prev => prev === 'menu' ? 'player' : 'menu')}
                  onCenter={handleCenterClick}
                  onSettings={() => setViewMode(prev => prev === 'settings' ? 'player' : 'settings')}
               />
          </div>

      </div>
    </div>
  );
};

export default App;
