
export type VisualizerMode = 'bars' | 'wave' | 'orb' | 'particles';
export type TextureMode = 'iPod' | 'Cyberpunk' | 'Retro';

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  genre: string;
  color: string;
  country: string;
  logo: string;
  isFavorite?: boolean; // New optional property
}

export interface AudioVisualizerProps {
  analyser: AnalyserNode | null; 
  isPlaying: boolean;
  color: string;
  mode: VisualizerMode;
}

export interface PlayerState {
  isPlaying: boolean;
  volume: number; // 0.0 to 1.0
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface EqualizerBand {
  frequency: number;
  label: string;
  value: number; // gain in dB (-12 to 12)
  type: BiquadFilterType;
}
