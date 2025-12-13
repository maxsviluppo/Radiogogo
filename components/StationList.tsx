
import React, { useState, useMemo } from 'react';
import { RadioStation } from '../types';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation;
  favorites: string[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string) => void;
  onDeleteStation: (id: string) => void;
  onReorderFavorites: (newOrder: string[]) => void;
  isPlaying: boolean;
  isCompact?: boolean;
}

const StationList: React.FC<StationListProps> = ({ 
  stations, 
  currentStation,
  favorites,
  onSelectStation,
  onReorderFavorites,
  isPlaying,
  isCompact
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'fav'>('all');

  // Logic: In 'all' mode, show original list. In 'fav' mode, show ordered by favorites array.
  const displayedStations = useMemo(() => {
    if (filterMode === 'fav') {
      // Map favorites IDs to station objects to preserve order (priority)
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
       // Swap
       [newFavs[index], newFavs[targetIndex]] = [newFavs[targetIndex], newFavs[index]];
       onReorderFavorites(newFavs);
    }
  };

  return (
    <div className="w-full min-h-full bg-[#050505] text-gray-200 font-sans flex flex-col">
      {/* Header Dark Mode */}
      <div className="bg-gradient-to-b from-[#222] to-[#111] px-3 py-2 border-b border-[#333] shadow-lg sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-display font-bold text-[10px] text-gray-300 tracking-widest uppercase">
            {filterMode === 'all' ? 'Station Library' : 'Priority List'}
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

      <div className="pb-4 flex-1">
        {displayedStations.length === 0 && filterMode === 'fav' && (
           <div className="flex flex-col items-center justify-center h-40 text-gray-600 gap-2">
              <span className="text-2xl">♥</span>
              <p className="text-[10px]">Add stations to create your priority list.</p>
           </div>
        )}

        {displayedStations.map((station, index) => {
          const isActive = currentStation.id === station.id;
          const isFav = favorites.includes(station.id);
          
          return (
            <div 
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`
                group flex items-center justify-between px-3 py-2.5 border-b border-[#1a1a1a] cursor-pointer transition-colors
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/20 border-l-2 border-l-blue-500' 
                  : 'hover:bg-[#111] border-l-2 border-l-transparent'
                }
              `}
            >
              <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    {/* Priority Number (Only in Fav Mode) or Heart */}
                    <div className="w-5 flex justify-center shrink-0">
                      {filterMode === 'fav' ? (
                         <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                           {index + 1}.
                         </span>
                      ) : (
                         isFav && <span className="text-[9px] text-pink-500">♥</span>
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
                  {/* Reorder Buttons (Only Fav Mode) */}
                  {filterMode === 'fav' && (
                    <div className="flex flex-col gap-0.5 opacity-40 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleReorder(e, index, -1)}
                          disabled={index === 0}
                          className="p-1 hover:text-white text-gray-500 disabled:opacity-20 hover:bg-white/10 rounded"
                        >
                           <svg width="8" height="4" viewBox="0 0 10 6" fill="currentColor"><path d="M5 0L10 6H0L5 0Z"/></svg>
                        </button>
                        <button 
                          onClick={(e) => handleReorder(e, index, 1)}
                          disabled={index === displayedStations.length - 1}
                          className="p-1 hover:text-white text-gray-500 disabled:opacity-20 hover:bg-white/10 rounded"
                        >
                           <svg width="8" height="4" viewBox="0 0 10 6" fill="currentColor"><path d="M5 6L0 0H10L5 6Z"/></svg>
                        </button>
                    </div>
                  )}

                  {isActive && isPlaying && (
                     <div className="animate-pulse">
                         <span className="text-[10px]">🔊</span>
                     </div>
                  )}
                  
                  {!isActive && filterMode !== 'fav' && (
                      <span className="text-gray-700 text-[10px]">›</span>
                  )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StationList;
