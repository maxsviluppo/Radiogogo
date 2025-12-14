
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RADIO_STATIONS } from './constants';
import { RadioStation, PlayerState, TextureMode } from './types';
import StationList from './components/StationList';
import Controls from './components/Controls';
import SettingsMenu from './components/SettingsMenu';
import AudioVisualizer from './components/AudioVisualizer';
import Equalizer from './components/Equalizer';
import { getStationVibe } from './services/geminiService';

const App: React.FC = () => {
  // --- STATE ---
  const [stations, setStations] = useState<RadioStation[]>(() => {
    const saved = localStorage.getItem('my_custom_stations');
    if (saved) {
      try { 
          // Merge saved with defaults to ensure we have structure, but prefer saved order if needed
          // For simplicity, we append custom ones to defaults or use the saved full list
          return JSON.parse(saved); 
      } catch (e) { return RADIO_STATIONS; }
    }
    return RADIO_STATIONS;
  });

  // Save stations whenever they change (to persist offline status or additions)
  useEffect(() => {
      localStorage.setItem('my_custom_stations', JSON.stringify(stations));
  }, [stations]);

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('my_favorites');
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [currentStation, setCurrentStation] = useState<RadioStation>(stations[0]);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false, volume: 0.8, isMuted: false, isLoading: false, error: null,
  });
  
  const [viewMode, setViewMode] = useState<'player' | 'menu' | 'settings'>('player'); 
  const [textureMode, setTextureMode] = useState<TextureMode>('Cyberpunk'); 
  const [currentVibe, setCurrentVibe] = useState<string>("SYSTEM: READY");
  const [showEq, setShowEq] = useState(false);
  
  // EQ State
  const [eqValues, setEqValues] = useState({ bass: 0, mid: 0, treble: 0 });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // EQ Audio Nodes Refs
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  // --- AUDIO SETUP ---
  const initAudioContext = useCallback(() => {
    if (!audioRef.current) return;
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(console.warn);
    }

    if (audioContextRef.current) return; // Already initialized

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512; 
      analyser.smoothingTimeConstant = 0.85; 

      // EQ Nodes
      const bassNode = ctx.createBiquadFilter();
      bassNode.type = 'lowshelf';
      bassNode.frequency.value = 200;
      bassNode.gain.value = eqValues.bass;

      const midNode = ctx.createBiquadFilter();
      midNode.type = 'peaking';
      midNode.frequency.value = 1000;
      midNode.Q.value = 1;
      midNode.gain.value = eqValues.mid;

      const trebleNode = ctx.createBiquadFilter();
      trebleNode.type = 'highshelf';
      trebleNode.frequency.value = 3000;
      trebleNode.gain.value = eqValues.treble;

      bassFilterRef.current = bassNode;
      midFilterRef.current = midNode;
      trebleFilterRef.current = trebleNode;

      // Connect Source safely
      try {
         const source = ctx.createMediaElementSource(audioRef.current);
         source.connect(bassNode);
         bassNode.connect(midNode);
         midNode.connect(trebleNode);
         trebleNode.connect(analyser);
         analyser.connect(ctx.destination);
      } catch (e) {
         // If media element source already connected, just ignore
      }

      audioContextRef.current = ctx;
      analyserRef.current = analyser;
      setAnalyserNode(analyser);

    } catch (e) { console.warn("AudioContext init warning:", e); }
  }, [eqValues]); 

  // --- HANDLE EQ CHANGE ---
  const handleEqChange = (band: 'bass' | 'mid' | 'treble', value: number) => {
      setEqValues(prev => ({ ...prev, [band]: value }));
      if (band === 'bass' && bassFilterRef.current) bassFilterRef.current.gain.value = value;
      else if (band === 'mid' && midFilterRef.current) midFilterRef.current.gain.value = value;
      else if (band === 'treble' && trebleFilterRef.current) trebleFilterRef.current.gain.value = value;
  };

  // --- FAVORITES LOGIC ---
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) 
        ? prev.filter(fid => fid !== id)
        : [...prev, id];
      localStorage.setItem('my_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleReorderFavorites = (newOrder: string[]) => {
      setFavorites(newOrder);
      localStorage.setItem('my_favorites', JSON.stringify(newOrder));
  };

  // --- DATA MANAGEMENT ---
  const handleResetStations = () => {
      if(window.confirm("Vuoi ripristinare la lista stazioni originale? Le radio custom verranno perse.")) {
          setStations(RADIO_STATIONS);
          setCurrentStation(RADIO_STATIONS[0]);
          setViewMode('player');
      }
  };

  const handleClearOffline = () => {
      const workingStations = stations.filter(s => s.status !== 'offline');
      if (workingStations.length === 0) {
          alert("Attenzione: tutte le stazioni sembrano offline. Ripristino default.");
          setStations(RADIO_STATIONS);
      } else {
          setStations(workingStations);
      }
  };

  // --- PLAYBACK ---
  const togglePlay = async () => {
    if (!audioRef.current) return;
    initAudioContext();

    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(p => ({ ...p, isPlaying: false }));
    } else {
      try {
        await audioRef.current.play();
        setPlayerState(p => ({ ...p, isPlaying: true, error: null }));
        getStationVibe(currentStation).then(setCurrentVibe);
      } catch (e: any) {
        // Ignore AbortError which happens on rapid skipping
        if (e.name !== 'AbortError') {
             console.error("Playback error:", e);
             handleStreamError();
        }
      }
    }
  };

  const handleStreamError = () => {
      console.warn(`Station ${currentStation.name} is offline.`);
      setPlayerState(p => ({ ...p, isPlaying: false, error: "Stream Offline / Error", isLoading: false }));
      setCurrentVibe("ERROR: STREAM LOST");
      
      // Mark station as offline in the list
      setStations(prev => prev.map(s => 
          s.id === currentStation.id ? { ...s, status: 'offline' } : s
      ));
  };

  const changeStation = (station: RadioStation) => {
    setCurrentStation(station);
    setPlayerState(p => ({ ...p, isLoading: true, isPlaying: false, error: null }));
    setCurrentVibe("TUNING...");
    
    // Use timeout to allow React to update state and Audio element to reset
    setTimeout(() => {
        if(audioRef.current) {
            audioRef.current.load(); // Force reload for new source
            togglePlay();
        }
    }, 50);
  };

  const getNextWorkingStationIndex = (currentIndex: number, direction: 1 | -1): number => {
      let nextIdx = currentIndex;
      let count = 0;
      // Try to find the next station that is NOT marked offline
      // Limit loop to length of stations to prevent infinite loop if all are offline
      do {
          nextIdx = (nextIdx + direction + stations.length) % stations.length;
          count++;
      } while (stations[nextIdx].status === 'offline' && count < stations.length);
      
      return nextIdx;
  };

  const handleNext = () => {
      const idx = stations.findIndex(s => s.id === currentStation.id);
      const nextIdx = getNextWorkingStationIndex(idx, 1);
      changeStation(stations[nextIdx]);
  };

  const handlePrev = () => {
      const idx = stations.findIndex(s => s.id === currentStation.id);
      const nextIdx = getNextWorkingStationIndex(idx, -1);
      changeStation(stations[nextIdx]);
  };

  const handleAddStation = (name: string, url: string) => {
      const newStation: RadioStation = {
          id: `custom-${Date.now()}`,
          name,
          url,
          genre: 'Custom',
          country: 'User',
          color: '#ffffff',
          logo: ''
      };
      const newStations = [...stations, newStation];
      setStations(newStations);
  };

  // --- RENDER ---
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#050505] p-2 sm:p-4 font-sans select-none overflow-hidden touch-pan-y">
      
      {/* --- DEVICE SHELL (DARK 3D CHASSIS) --- */}
      <div className="relative w-full max-w-[360px] sm:max-w-[370px] h-[95dvh] sm:h-[90vh] max-h-[820px] bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#000000] rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_0_0_1px_#333,0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col z-0 shrink-0">
        
        {/* Subtle Texture on Chassis */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

        {/* --- SCREEN BEZEL & AREA --- */}
        <div className="relative h-[55%] sm:h-[55%] bg-black mx-3 sm:mx-4 mt-4 sm:mt-6 rounded-t-xl overflow-hidden border border-[#222] shadow-[inset_0_0_15px_rgba(0,0,0,1)] z-10 flex flex-col">
            
            {/* Viewport Content */}
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
                {/* Status Bar */}
                <div className="h-6 bg-black/90 flex justify-between items-center px-3 pt-1 border-b border-white/5 relative z-30 shrink-0">
                    <div className="flex gap-2 items-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${playerState.isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`}></div>
                       <span className="text-[9px] text-gray-500 font-mono tracking-widest truncate max-w-[120px]">{currentVibe}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-bold font-mono">
                        {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 relative overflow-hidden bg-black flex flex-col h-full">
                    {viewMode === 'menu' && (
                        <StationList 
                            stations={stations}
                            currentStation={currentStation}
                            favorites={favorites}
                            onSelectStation={(s) => { changeStation(s); setViewMode('player'); }}
                            onAddStation={handleAddStation}
                            onDeleteStation={() => {}}
                            onReorderFavorites={handleReorderFavorites}
                            onToggleFavorite={toggleFavorite}
                            isPlaying={playerState.isPlaying}
                        />
                    )}
                    
                    {viewMode === 'settings' && (
                        <SettingsMenu 
                             stations={stations}
                             onSelectStation={() => {}}
                             onAddStation={handleAddStation}
                             currentTexture={textureMode}
                             onSetTexture={setTextureMode}
                             eqValues={eqValues}
                             onEqChange={handleEqChange}
                             onResetStations={handleResetStations}
                             onClearOffline={handleClearOffline}
                        />
                    )}

                    {viewMode === 'player' && (
                        <div className="flex flex-col h-full relative w-full">
                             {/* Ambient Backlight */}
                             <div 
                                className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000 z-0"
                                style={{backgroundColor: currentStation.color}}
                             ></div>

                             {/* Visualizer Layer */}
                             <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
                                 <AudioVisualizer 
                                    analyser={analyserNode}
                                    isPlaying={playerState.isPlaying}
                                    color={currentStation.color}
                                    mode="wave"
                                 />
                             </div>

                             {/* Info Layer (Text on top) */}
                             <div className="relative z-20 flex flex-col items-center justify-start h-full pt-12 sm:pt-16 p-6 text-center">
                                 <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-w-[90%]">
                                     <h1 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 drop-shadow-md truncate w-full text-glow">
                                         {currentStation.name}
                                     </h1>
                                     <div className="h-[1px] w-12 bg-white/20 mx-auto mb-2"></div>
                                     <p className="text-xs text-blue-300 font-mono tracking-widest uppercase mb-1">{currentStation.genre}</p>
                                     <p className="text-[10px] text-gray-500">{currentStation.country}</p>
                                     
                                     {currentStation.status === 'offline' && (
                                         <div className="mt-3 px-3 py-1 bg-red-900/50 border border-red-500 rounded text-[10px] text-red-200 animate-pulse font-bold tracking-widest">
                                             ⚠ SIGNAL LOST
                                         </div>
                                     )}

                                     {favorites.includes(currentStation.id) && (
                                         <span className="text-pink-500 text-[10px] mt-2 block font-bold tracking-wider">♥ FAVORITE</span>
                                     )}
                                 </div>
                             </div>
                        </div>
                    )}

                    {/* EQ Popup */}
                    {showEq && (
                        <div className="absolute inset-0 z-50">
                            <Equalizer 
                                bands={[
                                    { frequency: 60, label: 'LOW', value: eqValues.bass, type: 'lowshelf' },
                                    { frequency: 1000, label: 'MID', value: eqValues.mid, type: 'peaking' },
                                    { frequency: 3000, label: 'HIGH', value: eqValues.treble, type: 'highshelf' },
                                ]}
                                onChange={(idx, val) => {
                                    if(idx===0) handleEqChange('bass', val);
                                    if(idx===1) handleEqChange('mid', val);
                                    if(idx===2) handleEqChange('treble', val);
                                }}
                                onClose={() => setShowEq(false)}
                                accentColor={currentStation.color}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* --- CONTROLS AREA --- */}
        <div className="flex-1 relative z-20 flex items-center justify-center">
            <Controls 
               isPlaying={playerState.isPlaying}
               onTogglePlay={togglePlay}
               onNext={handleNext}
               onPrev={handlePrev}
               onMenu={() => setViewMode(m => m === 'menu' ? 'player' : 'menu')}
               onCenter={() => setShowEq(prev => !prev)}
               onSettings={() => setViewMode(m => m === 'settings' ? 'player' : 'settings')}
            />
        </div>

      </div>

      {/* Hidden Audio Element */}
      <audio 
         ref={audioRef} 
         src={currentStation.url} 
         crossOrigin="anonymous" 
         preload="none"
         onError={(e) => {
             // Handle Error by marking station offline
             handleStreamError();
         }}
         onPlaying={() => setPlayerState(p => ({...p, isLoading:false, isPlaying:true, error: null}))}
         onWaiting={() => setPlayerState(p => ({...p, isLoading:true}))}
      />
    </div>
  );
};

export default App;
