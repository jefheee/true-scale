'use client';

import { useEffect, useRef } from 'react';
import { useCalibrationStore } from '@/store/useCalibrationStore';

interface RulerProps {
  position: 'top' | 'bottom' | 'left' | 'right';
  size?: number;
}

export function Ruler({ position, size = 30 }: RulerProps) {
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
      const isHorizontal = position === 'top' || position === 'bottom';
      const length = isHorizontal ? window.innerWidth : window.innerHeight;
      
      canvas.width = (isHorizontal ? length : size) * dpr;
      canvas.height = (isHorizontal ? size : length) * dpr;
      
      canvas.style.width = `${isHorizontal ? length : size}px`;
      canvas.style.height = `${isHorizontal ? size : length}px`;
      
      ctx.scale(dpr, dpr);
      
      drawRuler(ctx, length, isHorizontal, position);
    };

    const drawRuler = (ctx: CanvasRenderingContext2D, length: number, isHorizontal: boolean, pos: string) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#111'; // Dark background
      ctx.fillRect(0, 0, isHorizontal ? length : size, isHorizontal ? size : length);

      ctx.fillStyle = '#a1a1a1';
      ctx.strokeStyle = '#a1a1a1';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = isHorizontal ? 'center' : 'left';
      ctx.textBaseline = isHorizontal ? 'top' : 'middle';

      if (pos === 'bottom') ctx.textBaseline = 'bottom';
      if (pos === 'right') ctx.textAlign = 'right';

      let ppu = ppi; 
      let subunits = 8; 
      
      if (unit === 'cm') {
        ppu = ppi / 2.54; 
        subunits = 10; 
      }

      ctx.beginPath();
      const maxUnits = Math.ceil(length / ppu);
      
      for (let i = 0; i <= maxUnits; i++) {
        const p = i * ppu;
        
        if (isHorizontal) {
          const yStart = pos === 'top' ? size - 15 : 0;
          const yEnd = pos === 'top' ? size : 15;
          const textY = pos === 'top' ? 2 : size - 2;

          ctx.moveTo(p, yStart);
          ctx.lineTo(p, yEnd);
          if (i > 0) ctx.fillText(i.toString(), p, textY);
        } else {
          const xStart = pos === 'left' ? size - 15 : 0;
          const xEnd = pos === 'left' ? size : 15;
          const textX = pos === 'left' ? 2 : size - 2;

          ctx.moveTo(xStart, p);
          ctx.lineTo(xEnd, p);
          if (i > 0) ctx.fillText(i.toString(), textX, p);
        }

        // Draw subunits
        for (let j = 1; j < subunits; j++) {
          const subP = p + (j * ppu) / subunits;
          if (subP > length) break;
          
          const isHalf = j === Math.floor(subunits / 2);
          const tickSize = isHalf ? 10 : 5;
          
          if (isHorizontal) {
            const yStart = pos === 'top' ? size - tickSize : 0;
            const yEnd = pos === 'top' ? size : tickSize;
            ctx.moveTo(subP, yStart);
            ctx.lineTo(subP, yEnd);
          } else {
            const xStart = pos === 'left' ? size - tickSize : 0;
            const xEnd = pos === 'left' ? size : tickSize;
            ctx.moveTo(xStart, subP);
            ctx.lineTo(xEnd, subP);
          }
        }
      }
      
      ctx.stroke();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [ppi, unit, position, size]);

  const positionClasses = {
    top: 'top-0 left-0 w-full border-b',
    bottom: 'bottom-0 left-0 w-full border-t',
    left: 'top-0 left-0 h-full border-r',
    right: 'top-0 right-0 h-full border-l',
  };

  return (
    <div
      className={`fixed z-50 bg-[#0a0a0a] border-[#333] ${positionClasses[position]}`}
      style={{
        [position === 'top' || position === 'bottom' ? 'height' : 'width']: `${size}px`,
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
