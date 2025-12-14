
import React, { useEffect, useRef } from 'react';
import { AudioVisualizerProps } from '../types';

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isPlaying, color, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Helper to resize canvas
    const handleResize = () => {
        if (!canvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        
        // Only update if size actually changed to avoid flicker
        if(canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
        }
    };

    // Initial size
    handleResize();

    // Listen for resize
    window.addEventListener('resize', handleResize);

    // Phase trackers for waves
    let phase = 0;

    const render = () => {
      // Dimensions might change on mobile due to address bar, etc. 
      // We rely on resize event mostly, but using getBoundingClientRect in render loop is expensive.
      // Use logic vars
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      
      ctx.clearRect(0, 0, width, height);

      let averageVolume = 0;

      // DATA ACQUISITION
      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        // Calculate Average Volume (Bass focus)
        let sum = 0;
        const limit = Math.floor(bufferLength * 0.3); 
        for (let i = 0; i < limit; i++) {
            sum += dataArray[i];
        }
        averageVolume = sum / (limit || 1);
      } else if (!isPlaying) {
          // Idle movement
          averageVolume = 10 + Math.sin(Date.now() / 1000) * 5; 
      }

      // Normalizing volume
      const volNorm = Math.min(averageVolume / 255, 1);
      
      if (mode === 'wave') {
          // LIQUID GLASS EFFECT
          // Increase speed with volume
          phase += 0.05 + (volNorm * 0.1);

          const layers = [
              { amp: 20, speed: 1.0, opacity: 0.3, offset: 0 }, // Background
              { amp: 35, speed: 0.6, opacity: 0.5, offset: Math.PI }, // Middle
              { amp: 50, speed: 0.8, opacity: 0.8, offset: Math.PI / 2 } // Front (Glass)
          ];

          layers.forEach((layer, index) => {
              ctx.beginPath();
              
              const currentPhase = phase * layer.speed + layer.offset;
              const baseHeight = height * 0.8; // Water level
              
              // Dynamic amplitude based on volume
              const amplitude = layer.amp + (volNorm * height * 0.3);

              ctx.moveTo(0, height);

              for (let x = 0; x <= width; x += 5) {
                  const y = baseHeight + Math.sin((x / width) * Math.PI * 4 + currentPhase) * -amplitude;
                  ctx.lineTo(x, y);
              }

              ctx.lineTo(width, height);
              ctx.lineTo(0, height);
              ctx.closePath();

              // Gradient
              const gradient = ctx.createLinearGradient(0, baseHeight - amplitude, 0, height);
              gradient.addColorStop(0, hexToRgba(color, layer.opacity));
              gradient.addColorStop(1, hexToRgba(color, 0.1));
              
              ctx.fillStyle = gradient;
              ctx.fill();

              // GLASS HIGHLIGHT (Only on top layer or strongly visible ones)
              if (index === layers.length - 1) {
                  ctx.lineWidth = 3;
                  ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + volNorm * 0.6})`; // Shiny white edge
                  ctx.shadowColor = color;
                  ctx.shadowBlur = 15; // Glow
                  ctx.stroke();
                  ctx.shadowBlur = 0; // Reset
              }
          });

      } else {
        // --- BARS MODE FALLBACK ---
        const bars = 40;
        const gap = 4;
        const barWidth = (width - ((bars - 1) * gap)) / bars;

        for (let i = 0; i < bars; i++) {
            // Simulated or Real data would go here
            const val = isPlaying ? (Math.random() * averageVolume * 1.5) : 10;
            const barHeight = Math.min(height, (val / 255) * height);
            const x = i * (barWidth + gap);
            const y = height - barHeight;

            ctx.fillStyle = color;
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
            ctx.fillRect(x, y, barWidth, barHeight);
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, color, mode, analyser]);

  // Helper
  const hexToRgba = (hex: string, alpha: number) => {
    if (!hex) return `rgba(255,255,255,${alpha})`;
    if (hex.startsWith('rgb')) return hex;
    
    let c = hex.substring(1).split('');
    if (c.length === 3) c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    
    if (c.length !== 6) return `rgba(0, 255, 255, ${alpha})`;
    
    const num = parseInt(c.join(''), 16);
    return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`;
  };

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full"
    />
  );
};

export default AudioVisualizer;
