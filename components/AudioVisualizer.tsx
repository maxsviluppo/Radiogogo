import React, { useEffect, useRef } from 'react';
import { AudioVisualizerProps } from '../types';

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ analyser, isPlaying, color, mode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = Date.now() / 1000;

      ctx.clearRect(0, 0, width, height);

      let dataArray: Uint8Array | null = null;
      
      // Ottieni dati reali se l'analizzatore è fornito
      if (analyser && isPlaying) {
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        if (mode === 'wave') {
          // Cast a 'any' per risolvere il conflitto di tipi tra Uint8Array<ArrayBufferLike> e Uint8Array<ArrayBuffer>
          analyser.getByteTimeDomainData(dataArray as any);
        } else {
          analyser.getByteFrequencyData(dataArray as any);
        }
      }

      // Funzione helper per ottenere valore (reale o simulato)
      const getValue = (i: number, total: number) => {
        if (dataArray && dataArray.length > 0) {
           const spectrumUsage = 0.7; 
           const index = Math.floor((i / total) * (dataArray.length * spectrumUsage));
           const val = dataArray[index];
           if (val > 0) return val;
        }
        
        // Fallback simulato
        if (!analyser || (dataArray && dataArray[0] === 0 && dataArray[10] === 0)) {
           const noise = Math.sin(i * 0.5 + time * 3) * 30;
           const beat = Math.pow(Math.sin(time * 2 + (i % 2)), 8) * 80; 
           const flow = Math.sin(i * 0.1 - time * 2) * 40;
           return Math.max(0, 40 + noise + flow + (i < total / 3 ? beat : 0));
        }
        return 0;
      };

      ctx.lineCap = 'round';
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      if (!isPlaying) {
        // FLATLINE
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (mode === 'bars') {
        // CLASSIC NEON BARS
        const bars = 64;
        const barWidth = (width / bars) * 0.6;
        const gap = (width / bars) * 0.4;

        for (let i = 0; i < bars; i++) {
          const val = getValue(i, bars);
          const barHeight = (val / 255) * height;
          const x = i * (barWidth + gap) + gap / 2;
          const y = height - barHeight;

          const gradient = ctx.createLinearGradient(x, height, x, y);
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, '#ffffff');

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, barWidth, barHeight);
          
          // Reflection
          ctx.globalAlpha = 0.2;
          ctx.fillRect(x, height, barWidth, barHeight * 0.3);
          ctx.globalAlpha = 1.0;
        }

      } else if (mode === 'wave') {
        // NEON WAVE
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        const points = width / 2;
        
        for (let i = 0; i < points; i++) {
          const val = getValue(i, points);
          let y;
          if (analyser && dataArray && dataArray.length > 0) {
             const v = val / 128.0;
             y = v * height / 2;
          } else {
             y = (height / 2) + Math.sin(i * 0.1 + time * 10) * (val * 0.5);
          }

          const x = (i / points) * width;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

      } else if (mode === 'orb') {
        // PULSING ORB
        const cx = width / 2;
        const cy = height / 2;
        const radius = 60;
        const points = 50;
        
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = color;
        
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;
          const val = getValue(i % points, points);
          const r = radius + (val / 255) * 50;
          const x = cx + Math.cos(angle + time) * r;
          const y = cy + Math.sin(angle + time) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Center Glow
        const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius * 1.5);
        g.addColorStop(0, color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.globalAlpha = 0.4;
        ctx.fill();
        ctx.globalAlpha = 1.0;

      } else if (mode === 'particles') {
        // FLOATING PARTICLES
        const particles = 50;
        ctx.fillStyle = color;
        for (let i = 0; i < particles; i++) {
          const val = getValue(i, particles);
          const x = ((i * 30 + time * 10) % width);
          const y = height - ((time * 50 + i * 20) % height);
          const size = (val / 255) * 6;
          
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, color, mode, analyser]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={200} 
      className="w-full h-full rounded-lg"
    />
  );
};

export default AudioVisualizer;