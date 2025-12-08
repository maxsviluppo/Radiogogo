import React from 'react';
import { RadioStation } from '../types';

interface StationListProps {
  stations: RadioStation[];
  currentStation: RadioStation;
  onSelectStation: (station: RadioStation) => void;
  onAddStation: (name: string, url: string) => void;
  onDeleteStation: (id: string) => void;
  isPlaying: boolean;
  isCompact?: boolean;
}

const StationList: React.FC<StationListProps> = ({ 
  stations, 
  currentStation, 
  onSelectStation,
  isPlaying,
  isCompact
}) => {
  
  return (
    <div className="w-full min-h-full bg-white text-black font-sans">
      {/* Header stile iPod */}
      <div className="bg-gradient-to-b from-[#eee] to-[#ccc] px-2 py-1 border-b border-[#999] shadow-sm sticky top-0 z-10">
          <h2 className="text-center font-bold text-xs text-black drop-shadow-sm tracking-wide">Music > Stations</h2>
      </div>

      <div className="pb-4">
        {stations.map((station, index) => {
          const isActive = currentStation.id === station.id;
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
              <div className="flex flex-col min-w-0">
                  <span className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-black'}`}>
                      {station.name}
                  </span>
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
                  <span className="text-gray-300 text-xs font-bold">></span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StationList;