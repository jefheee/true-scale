'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { ScanEye, X, Info } from 'lucide-react';

export function FovAlignerView() {
  const { ppi } = useCalibrationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(false);

  const [distanceCm, setDistanceCm] = useState<string>('60');
  
  const [widthCm, setWidthCm] = useState(0);
  const [fovDegrees, setFovDegrees] = useState(0);

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

  useEffect(() => {
    if (isFullscreen) {
      const dist = parseFloat(distanceCm) || 60;
      // ppi is pixels per inch. cm = pixels / (ppi / 2.54)
      const wCm = window.innerWidth / (ppi / 2.54);
      setWidthCm(wCm);
      
      const fovRad = 2 * Math.atan((wCm / 2) / dist);
      setFovDegrees(fovRad * (180 / Math.PI));
    }
  }, [distanceCm, isFullscreen, ppi]);

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0a0a0a]"
      ref={containerRef}
    >
      {!isFullscreen ? (
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl p-8 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl z-10 pointer-events-auto">
          <ScanEye className="w-12 h-12 text-white opacity-80" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">FOV Aligner</h3>
            <p className="text-[#a1a1a1] text-sm mb-4">
              Calcule matematicamente a tangência e o Campo de Visão para setups Multi-Monitor (Sim Racing/Flight Sim).
            </p>
            <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl flex items-start gap-3 text-left">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-200 leading-relaxed">
                Para setups multi-monitor, utilize Nvidia Surround ou AMD Eyefinity para garantir o preenchimento correto de toda a largura visual.
              </p>
            </div>
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

          {/* SVG Projection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="glowLine" x1="50%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="glowLineRight" x1="50%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>

            {/* Center Axis */}
            <line x1="50%" y1="100%" x2="50%" y2="0%" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="10 10" />

            {/* Cone Lines */}
            <line x1="50%" y1="100%" x2="0%" y2="0%" stroke="url(#glowLine)" strokeWidth="3" />
            <line x1="50%" y1="100%" x2="100%" y2="0%" stroke="url(#glowLineRight)" strokeWidth="3" />

            {/* Arc representing the angle at bottom center */}
            <path d="M calc(50% - 100px) 100% A 100 100 0 0 1 calc(50% + 100px) 100%" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="5 5" />
          </svg>

          {/* Sci-Fi HUD */}
          <div className={`absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-8 bg-[#050505]/90 backdrop-blur-xl border border-[#333] p-8 rounded-3xl transition-opacity duration-300 shadow-[0_0_50px_rgba(0,0,0,0.8)] ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            
            <div className="flex flex-col gap-2 border-b border-[#222] pb-6">
              <label className="text-xs text-[#666] font-mono uppercase tracking-widest">Distância Olho-Tela (cm)</label>
              <input 
                type="number" 
                value={distanceCm} 
                onChange={(e) => setDistanceCm(e.target.value)} 
                className="w-32 bg-transparent border-none text-4xl text-white font-mono focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#666] font-mono uppercase tracking-widest">FOV Horizontal Estimado</span>
                <span className="text-3xl font-bold text-white tracking-tight">{fovDegrees.toFixed(1)}°</span>
              </div>
              
              <div className="flex flex-col gap-1">
                <span className="text-xs text-[#666] font-mono uppercase tracking-widest">Largura Física da Tela</span>
                <span className="text-xl font-medium text-[#ccc] font-mono">{widthCm.toFixed(1)} cm</span>
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-[#222]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-[#666] font-mono uppercase tracking-wider">Telemetria Ativa</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
}
