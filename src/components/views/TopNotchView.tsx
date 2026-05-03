'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { MonitorUp, X } from 'lucide-react';

export function TopNotchView() {
  const { ppi } = useCalibrationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(false);

  // Inputs in mm
  const [widthMm, setWidthMm] = useState<string>('50');
  const [heightMm, setHeightMm] = useState<string>('20');

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isFullscreen) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), 2000);
    };

    timeoutId = setTimeout(() => setIsIdle(true), 2000);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFullscreen]);

  const requestFullscreen = async () => {
    if (containerRef.current && !document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
      } catch (err) {
        console.error("Erro ao tentar modo tela cheia:", err);
      }
    }
  };

  const exitFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  };

  // Convert mm to pixels
  const wPx = ppi * (parseFloat(widthMm) || 0) / 25.4;
  const hPx = ppi * (parseFloat(heightMm) || 0) / 25.4;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
      ref={containerRef}
    >
      {!isFullscreen ? (
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl p-8 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl">
          <MonitorUp className="w-12 h-12 text-white opacity-80" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Instalação de Hardware</h3>
            <p className="text-[#a1a1a1] text-sm">
              Use esta tela para colar ímãs de lightbars ou webcams exatamente no topo central do monitor. Requer tela cheia.
            </p>
          </div>
          <button
            onClick={requestFullscreen}
            className="bg-white text-black font-semibold py-3 px-8 rounded-xl hover:bg-[#e0e0e0] transition-colors w-full"
          >
            Launch Fullscreen
          </button>
        </div>
      ) : (
        <div className={`relative w-full h-full overflow-hidden transition-cursor duration-300 ${isIdle ? 'cursor-none' : 'cursor-default'}`}>
          
          <button
            onClick={exitFullscreen}
            className={`absolute top-6 right-6 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all z-50 ${isIdle ? 'opacity-0' : 'opacity-100'}`}
          >
            <X className="w-8 h-8" />
          </button>

          {/* The Gabarito Rectangle */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-white"
            style={{ width: `${wPx}px`, height: `${hPx}px` }}
          />

          {/* Controls to adjust size */}
          <div className={`absolute bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#111]/80 backdrop-blur-xl border border-[#333] p-4 rounded-2xl transition-opacity duration-300 ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Largura (mm)</label>
              <input 
                type="number" 
                value={widthMm} 
                onChange={(e) => setWidthMm(e.target.value)} 
                className="w-24 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#666]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Altura (mm)</label>
              <input 
                type="number" 
                value={heightMm} 
                onChange={(e) => setHeightMm(e.target.value)} 
                className="w-24 bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-[#666]"
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
