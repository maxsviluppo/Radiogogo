
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
          const parsed = JSON.parse(saved);
          // Filter out blob URLs (local files) as they are invalid after refresh
          const validStations = parsed.filter((s: RadioStation) => !s.url.startsWith('blob:'));
          // If all stations were blobs and we have none left, return default
          return validStations.length > 0 ? validStations : RADIO_STATIONS;
      } catch (e) { return RADIO_STATIONS; }
    }
    return RADIO_STATIONS;
  });

  useEffect(() => {
      // Don't save blob URLs to localStorage
      const stationsToSave = stations.filter(s => !s.url.startsWith('blob:'));
      localStorage.setItem('my_custom_stations', JSON.stringify(stationsToSave));
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

  // --- AUDIO REFS ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null); // Singleton source
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // EQ Audio Nodes Refs
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);

  // --- AUDIO GRAPH INITIALIZATION ---
  const initAudioGraph = useCallback(() => {
    if (!audioRef.current) return;
    
    // 1. Resume Context if needed
    if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume().catch(console.warn);
    }

    // 2. Create Context ONLY ONCE
    if (!audioContextRef.current) {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            const ctx = new AudioContextClass();
            audioContextRef.current = ctx;

            // Create Nodes
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512; 
            analyser.smoothingTimeConstant = 0.85; 

            const bassNode = ctx.createBiquadFilter();
            bassNode.type = 'lowshelf';
            bassNode.frequency.value = 200;

            const midNode = ctx.createBiquadFilter();
            midNode.type = 'peaking';
            midNode.frequency.value = 1000;
            midNode.Q.value = 1;

            const trebleNode = ctx.createBiquadFilter();
            trebleNode.type = 'highshelf';
            trebleNode.frequency.value = 3000;

            // Store Refs
            analyserRef.current = analyser;
            bassFilterRef.current = bassNode;
            midFilterRef.current = midNode;
            trebleFilterRef.current = trebleNode;

            // Update State for Visualizer
            setAnalyserNode(analyser);
        } catch (e) {
            console.warn("Audio Context creation failed", e);
            return;
        }
    }

    const ctx = audioContextRef.current;
    if (!ctx) return;

    // 3. Create Source Node ONLY ONCE per audio element
    if (!sourceNodeRef.current && audioRef.current) {
        try {
            const source = ctx.createMediaElementSource(audioRef.current);
            sourceNodeRef.current = source;
            
            // Connect Graph: Source -> Bass -> Mid -> Treble -> Analyser -> Dest
            if (bassFilterRef.current && midFilterRef.current && trebleFilterRef.current && analyserRef.current) {
                source.connect(bassFilterRef.current);
                bassFilterRef.current.connect(midFilterRef.current);
                midFilterRef.current.connect(trebleFilterRef.current);
                trebleFilterRef.current.connect(analyserRef.current);
                analyserRef.current.connect(ctx.destination);
            }
        } catch (e) {
            console.error("Error connecting audio graph:", e);
        }
    }

  }, []);

  // --- APPLY EQ VALUES ---
  useEffect(() => {
      if (bassFilterRef.current) bassFilterRef.current.gain.value = eqValues.bass;
      if (midFilterRef.current) midFilterRef.current.gain.value = eqValues.mid;
      if (trebleFilterRef.current) trebleFilterRef.current.gain.value = eqValues.treble;
  }, [eqValues]);

  // --- PLAYBACK ---
  const togglePlay = async () => {
    if (!audioRef.current) return;
    initAudioGraph(); // Ensure graph exists

    if (playerState.isPlaying) {
      audioRef.current.pause();
      setPlayerState(p => ({ ...p, isPlaying: false }));
    } else {
      try {
        await audioRef.current.play();
        setPlayerState(p => ({ ...p, isPlaying: true, error: null }));
        getStationVibe(currentStation).then(setCurrentVibe);
      } catch (e: any) {
        if (e.name !== 'AbortError') {
             console.error("Playback error detail:", e);
             
             let errorMessage = "Playback Failed";
             if (e.name === 'NotSupportedError') {
                 errorMessage = "Format Not Supported";
             } else if (e.name === 'NotAllowedError') {
                 errorMessage = "Tap to Play";
             }

             setPlayerState(p => ({ ...p, isPlaying: false, error: errorMessage, isLoading: false }));
             setCurrentVibe(`ERROR: ${errorMessage.toUpperCase()}`);
        }
      }
    }
  };

  const handleEqChange = (band: 'bass' | 'mid' | 'treble', value: number) => {
      setEqValues(prev => ({ ...prev, [band]: value }));
  };

  const handleStreamError = () => {
      // Don't override explicit playback errors if we just handled one
      if (playerState.error) return; 
      
      console.warn(`Station ${currentStation.name} is offline/error.`);
      setPlayerState(p => ({ ...p, isPlaying: false, error: "Stream Offline", isLoading: false }));
      setCurrentVibe("ERROR: SIGNAL LOST");
      
      // Mark station as offline locally
      setStations(prev => prev.map(s => 
          s.id === currentStation.id ? { ...s, status: 'offline' } : s
      ));
  };

  const changeStation = (station: RadioStation) => {
    setCurrentStation(station);
    setPlayerState(p => ({ ...p, isLoading: true, isPlaying: false, error: null }));
    setCurrentVibe("TUNING...");
    
    // Short timeout to allow UI update before heavy DOM operation (loading audio)
    setTimeout(() => {
        if(audioRef.current) {
            audioRef.current.load();
            togglePlay();
        }
    }, 50);
  };

  // --- DATA MANAGEMENT ---
  const handleResetStations = () => {
      if(window.confirm("Ripristinare stazioni default?")) {
          setStations(RADIO_STATIONS);
          setCurrentStation(RADIO_STATIONS[0]);
          setViewMode('player');
      }
  };

  const handleClearOffline = () => {
      const working = stations.filter(s => s.status !== 'offline');
      setStations(working.length ? working : RADIO_STATIONS);
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const newFavs = prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id];
      localStorage.setItem('my_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const handleReorderFavorites = (newOrder: string[]) => {
      setFavorites(newOrder);
      localStorage.setItem('my_favorites', JSON.stringify(newOrder));
  };

  const getNextStationIndex = (currentIndex: number, direction: 1 | -1): number => {
      let nextIdx = currentIndex;
      let count = 0;
      do {
          nextIdx = (nextIdx + direction + stations.length) % stations.length;
          count++;
      } while (stations[nextIdx].status === 'offline' && count < stations.length);
      return nextIdx;
  };

  const handleNext = () => changeStation(stations[getNextStationIndex(stations.findIndex(s => s.id === currentStation.id), 1)]);
  const handlePrev = () => changeStation(stations[getNextStationIndex(stations.findIndex(s => s.id === currentStation.id), -1)]);

  // --- ADD STATION (CUSTOM OR FILE) ---
  const handleAddStation = (name: string, url: string, genre = 'Custom', country = 'User', autoPlay = true) => {
      const newStation: RadioStation = {
          id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name,
          url,
          genre,
          country,
          color: '#ffffff',
          logo: ''
      };
      
      setStations(prev => [...prev, newStation]);
      
      if (autoPlay) {
          setCurrentStation(newStation);
          setPlayerState(p => ({ ...p, isLoading: true, isPlaying: false, error: null }));
          setViewMode('player');
          
          setTimeout(() => {
              if(audioRef.current) {
                  audioRef.current.load();
                  togglePlay();
              }
          }, 100);
      }
  };

  const handleDeleteStation = (id: string) => {
      setStations(prev => prev.filter(s => s.id !== id));
      // If we deleted the current station, switch to the first available
      if (currentStation.id === id) {
          const remaining = stations.filter(s => s.id !== id);
          if (remaining.length > 0) {
              changeStation(remaining[0]);
          } else {
              setStations(RADIO_STATIONS);
              changeStation(RADIO_STATIONS[0]);
          }
      }
  };

  // --- MEDIA SESSION (Background Playback) ---
  useEffect(() => {
    if ('mediaSession' in navigator) {
      try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentStation.name,
            artist: currentStation.country === 'My Device' ? 'Local File' : currentStation.genre,
            album: "NeonStream Radio",
            artwork: [
                { src: currentStation.logo?.startsWith('http') ? currentStation.logo : 'https://cdn-icons-png.flaticon.com/512/4430/4430494.png', sizes: '512x512', type: 'image/png' }
            ]
          });

          const actionHandlers = [
              ['play', () => {
                 if (audioRef.current) {
                     audioRef.current.play().catch(console.error);
                     setPlayerState(p => ({ ...p, isPlaying: true }));
                 }
              }],
              ['pause', () => {
                 if (audioRef.current) {
                     audioRef.current.pause();
                     setPlayerState(p => ({ ...p, isPlaying: false }));
                 }
              }],
              ['previoustrack', handlePrev],
              ['nexttrack', handleNext]
          ] as const;

          actionHandlers.forEach(([action, handler]) => {
              try {
                  navigator.mediaSession.setActionHandler(action, handler);
              } catch (e) {
                  // Silently ignore if action is not supported
              }
          });
      } catch (e) {
          console.warn("Media Session setup failed:", e);
      }
    }
  }, [currentStation, stations]);

  // --- RENDER ---
  return (
    <div className="flex items-center justify-center min-h-[100dvh] bg-[#050505] p-2 sm:p-4 font-sans select-none overflow-hidden touch-pan-y">
      
      <div className="relative w-full max-w-[360px] sm:max-w-[370px] h-[95dvh] sm:h-[90vh] max-h-[820px] bg-gradient-to-b from-[#1a1a1a] via-[#0d0d0d] to-[#000000] rounded-[2.5rem] sm:rounded-[3rem] shadow-[0_0_0_1px_#333,0_30px_60px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col z-0 shrink-0">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>

        <div className="relative h-[55%] sm:h-[55%] bg-black mx-3 sm:mx-4 mt-4 sm:mt-6 rounded-t-xl overflow-hidden border border-[#222] shadow-[inset_0_0_15px_rgba(0,0,0,1)] z-10 flex flex-col">
            <div className="flex-1 flex flex-col relative z-20 overflow-hidden">
                <div className="h-6 bg-black/90 flex justify-between items-center px-3 pt-1 border-b border-white/5 relative z-30 shrink-0">
                    <div className="flex gap-2 items-center">
                       <div className={`w-1.5 h-1.5 rounded-full ${playerState.isPlaying ? 'bg-green-500 animate-pulse shadow-[0_0_5px_#22c55e]' : 'bg-red-500'}`}></div>
                       <span className="text-[9px] text-gray-500 font-mono tracking-widest truncate max-w-[120px]">{currentVibe}</span>
                    </div>
                    <div className="text-[9px] text-gray-400 font-bold font-mono">
                        {new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden bg-black flex flex-col h-full">
                    {viewMode === 'menu' && (
                        <StationList 
                            stations={stations}
                            currentStation={currentStation}
                            favorites={favorites}
                            onSelectStation={(s) => { changeStation(s); setViewMode('player'); }}
                            onAddStation={(n, u) => handleAddStation(n, u)}
                            onDeleteStation={handleDeleteStation}
                            onReorderFavorites={handleReorderFavorites}
                            onToggleFavorite={toggleFavorite}
                            isPlaying={playerState.isPlaying}
                        />
                    )}
                    
                    {viewMode === 'settings' && (
                        <SettingsMenu 
                             stations={stations}
                             onSelectStation={(s) => { changeStation(s); setViewMode('player'); }}
                             onAddStation={handleAddStation}
                             onDeleteStation={handleDeleteStation}
                             currentTexture={textureMode}
                             onSetTexture={setTextureMode}
                             onResetStations={handleResetStations}
                             onClearOffline={handleClearOffline}
                        />
                    )}

                    {viewMode === 'player' && (
                        <div className="flex flex-col h-full relative w-full">
                             <div className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000 z-0" style={{backgroundColor: currentStation.color}}></div>
                             <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen pointer-events-none">
                                 <AudioVisualizer analyser={analyserNode} isPlaying={playerState.isPlaying} color={currentStation.color} mode="wave" />
                             </div>
                             <div className="relative z-20 flex flex-col items-center justify-start h-full pt-12 sm:pt-16 p-6 text-center">
                                 <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] max-w-[90%]">
                                     <h1 className="text-xl sm:text-2xl font-display font-bold text-white mb-2 drop-shadow-md truncate w-full text-glow">
                                         {currentStation.name}
                                     </h1>
                                     <div className="h-[1px] w-12 bg-white/20 mx-auto mb-2"></div>
                                     <p className="text-xs text-blue-300 font-mono tracking-widest uppercase mb-1">{currentStation.genre}</p>
                                     <p className="text-[10px] text-gray-500">{currentStation.country}</p>
                                     {currentStation.status === 'offline' && <div className="mt-3 px-3 py-1 bg-red-900/50 border border-red-500 rounded text-[10px] text-red-200 animate-pulse font-bold tracking-widest">⚠ SIGNAL LOST</div>}
                                     {playerState.error && <div className="mt-3 px-3 py-1 bg-red-900/50 border border-red-500 rounded text-[10px] text-red-200 animate-pulse font-bold tracking-widest">{playerState.error}</div>}
                                     {favorites.includes(currentStation.id) && <span className="text-pink-500 text-[10px] mt-2 block font-bold tracking-wider">♥ FAVORITE</span>}
                                 </div>
                             </div>
                        </div>
                    )}

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

      <audio 
         ref={audioRef} 
         src={currentStation.url} 
         crossOrigin="anonymous" 
         preload="auto"
         onError={handleStreamError}
         onPlaying={() => setPlayerState(p => ({...p, isLoading:false, isPlaying:true, error: null}))}
         onWaiting={() => setPlayerState(p => ({...p, isLoading:true}))}
      />
    </div>
  );
};

export default App;
