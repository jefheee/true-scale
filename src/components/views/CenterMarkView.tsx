'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Maximize, X } from 'lucide-react';

export function CenterMarkView() {
  const { ppi } = useCalibrationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(false);

  // Handle Fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Handle Idle state for cursor hiding
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

  // Math for the SVG Grid
  // 1 inch = 25.4 mm.
  const mmInPixels = ppi / 25.4;
  const cmInPixels = mmInPixels * 10;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#050505]"
      ref={containerRef}
    >
      {!isFullscreen ? (
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl p-8 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl">
          <Maximize className="w-12 h-12 text-white opacity-80" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Modo Tela Cheia Necessário</h3>
            <p className="text-[#a1a1a1] text-sm">
              Para garantir que as medidas físicas do grid e do centro estejam 100% corretas, a interface precisa preencher toda a tela.
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

          {/* SVG Millimeter Grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            {/* The SVG centers its pattern based on the center of the screen */}
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="millimeterGrid" width={cmInPixels} height={cmInPixels} patternUnits="userSpaceOnUse" x="50%" y="50%">
                  {/* 1mm lines */}
                  <path d={`M ${cmInPixels} 0 L 0 0 0 ${cmInPixels}`} fill="none" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.3" />
                  
                  {/* Generate 10 mm lines inside the cm box */}
                  {Array.from({ length: 10 }).map((_, i) => {
                    if (i === 0) return null;
                    const pos = i * mmInPixels;
                    // Make the 5mm line slightly thicker
                    const isHalf = i === 5;
                    return (
                      <g key={i}>
                        <line x1={pos} y1="0" x2={pos} y2={cmInPixels} stroke="#ffffff" strokeWidth={isHalf ? "0.8" : "0.3"} strokeOpacity={isHalf ? "0.5" : "0.2"} />
                        <line x1="0" y1={pos} x2={cmInPixels} y2={pos} stroke="#ffffff" strokeWidth={isHalf ? "0.8" : "0.3"} strokeOpacity={isHalf ? "0.5" : "0.2"} />
                      </g>
                    );
                  })}
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#millimeterGrid)" />
              {/* Highlight main axis */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.8" />
            </svg>
          </div>

          {/* Concentric Crosshairs */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="absolute w-64 h-64 border border-white/20 rounded-full" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="absolute w-32 h-32 border border-white/40 rounded-full" />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="absolute w-12 h-12 border border-white/60 rounded-full" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_3px_rgba(255,255,255,1)]" />

            {/* Corner Markers */}
            <div className="absolute w-40 h-40">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/50" />
            </div>
          </div>

        </div>
      )}
    </motion.div>
  );
}
