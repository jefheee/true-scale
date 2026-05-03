'use client';

import { useEffect, useRef } from 'react';
import { useCalibrationStore } from '@/store/useCalibrationStore';

interface RulerProps {
  orientation: 'horizontal' | 'vertical';
  size?: number;
}

export function Ruler({ orientation, size = 30 }: RulerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ppi, unit } = useCalibrationStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    
    const updateSize = () => {
      const isHorizontal = orientation === 'horizontal';
      const length = isHorizontal ? window.innerWidth : window.innerHeight;
      
      canvas.width = (isHorizontal ? length : size) * dpr;
      canvas.height = (isHorizontal ? size : length) * dpr;
      
      canvas.style.width = `${isHorizontal ? length : size}px`;
      canvas.style.height = `${isHorizontal ? size : length}px`;
      
      ctx.scale(dpr, dpr);
      
      drawRuler(ctx, length, isHorizontal);
    };

    const drawRuler = (ctx: CanvasRenderingContext2D, length: number, isHorizontal: boolean) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111'; // Dark background
      ctx.fillRect(0, 0, isHorizontal ? length : size, isHorizontal ? size : length);

      ctx.fillStyle = '#a1a1a1';
      ctx.strokeStyle = '#a1a1a1';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = isHorizontal ? 'center' : 'left';
      ctx.textBaseline = isHorizontal ? 'top' : 'middle';

      // Pixels per unit
      let ppu = ppi; // Default inches
      let subunits = 8; // 1/8 inches
      
      if (unit === 'cm') {
        ppu = ppi / 2.54; // Pixels per cm
        subunits = 10; // 1 mm
      }

      ctx.beginPath();
      
      const maxUnits = Math.ceil(length / ppu);
      
      for (let i = 0; i <= maxUnits; i++) {
        const pos = i * ppu;
        
        // Draw main unit line
        if (isHorizontal) {
          ctx.moveTo(pos, size - 15);
          ctx.lineTo(pos, size);
          if (i > 0) ctx.fillText(i.toString(), pos, 2);
        } else {
          ctx.moveTo(size - 15, pos);
          ctx.lineTo(size, pos);
          if (i > 0) ctx.fillText(i.toString(), 2, pos);
        }

        // Draw subunits
        for (let j = 1; j < subunits; j++) {
          const subPos = pos + (j * ppu) / subunits;
          if (subPos > length) break;
          
          const isHalf = j === Math.floor(subunits / 2);
          const tickSize = isHalf ? 10 : 5;
          
          if (isHorizontal) {
            ctx.moveTo(subPos, size - tickSize);
            ctx.lineTo(subPos, size);
          } else {
            ctx.moveTo(size - tickSize, subPos);
            ctx.lineTo(size, subPos);
          }
        }
      }
      
      ctx.stroke();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [ppi, unit, orientation, size]);

  return (
    <div
      className={`fixed top-0 left-0 z-50 ${
        orientation === 'horizontal' ? 'w-full' : 'h-full'
      } bg-[#0a0a0a] border-[#333] ${
        orientation === 'horizontal' ? 'border-b' : 'border-r'
      }`}
      style={{
        [orientation === 'horizontal' ? 'height' : 'width']: `${size}px`,
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
