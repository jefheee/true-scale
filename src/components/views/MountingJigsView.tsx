'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Cpu, X } from 'lucide-react';

const PRESETS = [
  { id: 'benq-halo', name: 'BenQ ScreenBar Halo', width: 40, height: 15 },
  { id: 'tobii-5', name: 'Tobii Eye Tracker 5', width: 15, height: 10 },
  { id: 'custom', name: 'Customizado (Manual)', width: 50, height: 20 },
];

export function MountingJigsView() {
  const { ppi } = useCalibrationStore();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(false);

  const [presetId, setPresetId] = useState(PRESETS[2].id); // custom
  const [widthMm, setWidthMm] = useState<string>(PRESETS[2].width.toString());
  const [heightMm, setHeightMm] = useState<string>(PRESETS[2].height.toString());

  useEffect(() => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset && preset.id !== 'custom') {
      setWidthMm(preset.width.toString());
      setHeightMm(preset.height.toString());
    }
  }, [presetId]);

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
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0a0a0a]"
      ref={containerRef}
    >
      {!isFullscreen ? (
        <div className="bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl p-8 flex flex-col items-center gap-6 max-w-sm text-center shadow-2xl z-10 pointer-events-auto">
          <Cpu className="w-12 h-12 text-white opacity-80" />
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Mounting Jigs</h3>
            <p className="text-[#a1a1a1] text-sm">
              Use esta tela para colar ímãs de hardwares exatamente no topo central do monitor. Requer tela cheia para precisão milimétrica.
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

          {/* Blueprint Grid Background */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridPattern)" />
          </svg>

          {/* The Gabarito Rectangle */}
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 bg-white/10 border-2 border-white flex items-center justify-center backdrop-blur-sm shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            style={{ width: `${wPx}px`, height: `${hPx}px` }}
          >
            <span className="text-white/80 font-mono text-xs whitespace-nowrap px-2 select-none">
              {widthMm}x{heightMm} mm
            </span>
          </div>

          {/* Controls to adjust size */}
          <div className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 bg-[#111]/80 backdrop-blur-xl border border-[#333] p-6 rounded-3xl transition-opacity duration-300 shadow-2xl ${isIdle ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="w-full">
              <label className="text-xs text-[#888] font-semibold uppercase tracking-wider mb-2 block">Preset de Hardware</label>
              <select
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#666] appearance-none"
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Largura (mm)</label>
                <input 
                  type="number" 
                  value={widthMm} 
                  onChange={(e) => {
                    setPresetId('custom');
                    setWidthMm(e.target.value);
                  }} 
                  className="w-28 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#666]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-[#888] font-semibold uppercase tracking-wider">Altura (mm)</label>
                <input 
                  type="number" 
                  value={heightMm} 
                  onChange={(e) => {
                    setPresetId('custom');
                    setHeightMm(e.target.value);
                  }} 
                  className="w-28 bg-[#0a0a0a] border border-[#333] rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#666]"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
