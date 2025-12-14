
import React, { useState, useMemo, useRef } from 'react';
import { RadioStation } from '../types';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation;
  favorites: string[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string) => void;
  onDeleteStation: (id: string) => void;
  onReorderFavorites: (newOrder: string[]) => void;
  onToggleFavorite?: (id: string) => void; // New Prop
  isPlaying: boolean;
  isCompact?: boolean;
}

const StationList: React.FC<StationListProps> = ({ 
  stations, 
  currentStation,
  favorites,
  onSelectStation,
  onReorderFavorites,
  onToggleFavorite,
  isPlaying,
  isCompact
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'fav'>('all');
  
  // Touch Swipe State
  const [swipedStationId, setSwipedStationId] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const touchCurrentX = useRef<number | null>(null);

  const displayedStations = useMemo(() => {
    if (filterMode === 'fav') {
      return favorites
        .map(favId => stations.find(s => s.id === favId))
        .filter((s): s is RadioStation => !!s);
    }
    return stations;
  }, [filterMode, stations, favorites]);

  const handleReorder = (e: React.MouseEvent, index: number, direction: -1 | 1) => {
    e.stopPropagation();
    if (filterMode !== 'fav') return;
    const newFavs = [...favorites];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newFavs.length) {
       [newFavs[index], newFavs[targetIndex]] = [newFavs[targetIndex], newFavs[index]];
       onReorderFavorites(newFavs);
    }
  };

  // --- SWIPE LOGIC ---
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
      touchStartX.current = e.targetTouches[0].clientX;
      setSwipedStationId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      touchCurrentX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (id: string) => {
      if (touchStartX.current !== null && touchCurrentX.current !== null) {
          const diff = touchCurrentX.current - touchStartX.current;
          // Swipe Right Threshold (SX -> DX)
          if (diff > 80 && onToggleFavorite) {
              onToggleFavorite(id);
              // Haptic feedback if available
              if (navigator.vibrate) navigator.vibrate(50);
          }
      }
      touchStartX.current = null;
      touchCurrentX.current = null;
      setSwipedStationId(null);
  };

  return (
    <div className="w-full h-full bg-[#050505] text-gray-200 font-sans flex flex-col select-none relative">
      {/* Header - No sticky here, we scroll the content below */}
      <div className="bg-gradient-to-b from-[#222] to-[#111] px-3 py-2 border-b border-[#333] shadow-lg flex justify-between items-center shrink-0 z-20">
          <h2 className="font-display font-bold text-[10px] text-gray-300 tracking-widest uppercase">
            {filterMode === 'all' ? 'Library (Swipe → Fav)' : 'Priority List'}
          </h2>
          <div className="flex gap-1 bg-black/50 p-0.5 rounded-md border border-[#333]">
             <button 
                onClick={() => setFilterMode('all')}
                className={`text-[9px] px-2 py-0.5 rounded transition-all ${filterMode === 'all' ? 'bg-[#3b82f6] text-white shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-gray-500 hover:text-white'}`}
             >ALL</button>
             <button 
                onClick={() => setFilterMode('fav')}
                className={`text-[9px] px-2 py-0.5 rounded transition-all ${filterMode === 'fav' ? 'bg-[#ec4899] text-white shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'text-gray-500 hover:text-white'}`}
             >♥</button>
          </div>
      </div>

      <div className="pb-4 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain touch-pan-y">
        {displayedStations.length === 0 && filterMode === 'fav' && (
           <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
              <span className="text-2xl">♥</span>
              <p className="text-[10px]">Swipe right on a station to add it.</p>
           </div>
        )}

        {displayedStations.map((station, index) => {
          const isActive = currentStation.id === station.id;
          const isFav = favorites.includes(station.id);
          
          return (
            <div 
              key={station.id}
              onClick={() => onSelectStation(station)}
              onTouchStart={(e) => handleTouchStart(e, station.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(station.id)}
              className="relative overflow-hidden border-b border-[#1a1a1a]"
            >
                {/* Swipe Action Background Indicator */}
                <div className="absolute inset-0 bg-pink-900/40 flex items-center justify-start pl-4 transition-opacity duration-300">
                    <span className="text-pink-400 font-bold text-xs tracking-widest">
                        {isFav ? 'REMOVE ♥' : 'ADD ♥'}
                    </span>
                </div>

                {/* Main Content */}
                <div className={`
                    relative z-10 bg-[#050505] flex items-center justify-between px-3 py-2.5 transition-transform duration-200
                    ${isActive ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-l-2 border-l-blue-500' : 'hover:bg-[#111] border-l-2 border-l-transparent'}
                `}>
                  <div className="flex flex-col min-w-0 flex-1 pointer-events-none">
                      <div className="flex items-center gap-3">
                        <div className="w-5 flex justify-center shrink-0">
                          {filterMode === 'fav' ? (
                             <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>{index + 1}.</span>
                          ) : (
                             isFav && <span className="text-[9px] text-pink-500 animate-in zoom-in">♥</span>
                          )}
                        </div>

                        <span className={`text-sm font-medium truncate ${isActive ? 'text-white drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]' : 'text-gray-300'}`}>
                            {station.name}
                        </span>
                      </div>
                      
                      <div className="pl-8 flex items-center gap-2">
                         <span className={`text-[9px] uppercase tracking-wider ${isActive ? 'text-blue-300' : 'text-gray-600'}`}>
                            {station.genre}
                         </span>
                      </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex items-center gap-2 pl-2">
                      {filterMode === 'fav' && (
                        <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                            <button onClick={(e) => handleReorder(e, index, -1)} disabled={index === 0} className="p-1 hover:text-white text-gray-500">▲</button>
                            <button onClick={(e) => handleReorder(e, index, 1)} disabled={index === displayedStations.length - 1} className="p-1 hover:text-white text-gray-500">▼</button>
                        </div>
                      )}

                      {isActive && isPlaying && (
                         <div className="animate-pulse text-[10px]">🔊</div>
                      )}
                  </div>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StationList;
