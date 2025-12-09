
import React, { useState } from 'react';
import { RadioStation } from '../types';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation;
  favorites: string[];
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string) => void;
  onDeleteStation: (id: string) => void;
  isPlaying: boolean;
  isCompact?: boolean;
}

const StationList: React.FC<StationListProps> = ({ 
  stations, 
  currentStation,
  favorites,
  onSelectStation,
  isPlaying,
  isCompact
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'fav'>('all');

  const displayedStations = filterMode === 'fav' 
    ? stations.filter(s => favorites.includes(s.id))
    : stations;

  return (
    <div className="w-full min-h-full bg-white text-black font-sans flex flex-col">
      {/* Header stile iPod */}
      <div className="bg-gradient-to-b from-[#eee] to-[#ccc] px-2 py-1 border-b border-[#999] shadow-sm sticky top-0 z-10 flex justify-between items-center">
          <h2 className="font-bold text-xs text-black drop-shadow-sm tracking-wide">Music &gt; Stations</h2>
          <div className="flex gap-1">
             <button 
                onClick={() => setFilterMode('all')}
                className={`text-[9px] px-1.5 rounded ${filterMode === 'all' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
             >ALL</button>
             <button 
                onClick={() => setFilterMode('fav')}
                className={`text-[9px] px-1.5 rounded ${filterMode === 'fav' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
             >♥</button>
          </div>
      </div>

      <div className="pb-4 flex-1">
        {displayedStations.length === 0 && filterMode === 'fav' && (
           <div className="p-4 text-center text-xs text-gray-400">No favorites yet.</div>
        )}

        {displayedStations.map((station, index) => {
          const isActive = currentStation.id === station.id;
          const isFav = favorites.includes(station.id);
          return (
            <div 
              key={station.id}
              onClick={() => onSelectStation(station)}
              className={`
                flex items-center justify-between px-3 py-2 border-b border-gray-200 cursor-pointer
                ${isActive 
                  ? 'bg-gradient-to-b from-[#3b82f6] to-[#2563eb] text-white' 
                  : 'bg-white text-black hover:bg-gray-100'
                }
              `}
            >
              <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {isFav && <span className={`text-[10px] ${isActive ? 'text-white' : 'text-red-500'}`}>♥</span>}
                    <span className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-black'}`}>
                        {station.name}
                    </span>
                  </div>
                  <span className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {station.genre}
                  </span>
              </div>

              {isActive && isPlaying && (
                 <div className="ml-2">
                     <span className="text-[10px]">🔊</span>
                 </div>
              )}
              
              {!isActive && (
                  <span className="text-gray-300 text-xs font-bold">&gt;</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StationList;
