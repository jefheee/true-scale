'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler } from '@/components/Ruler';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Ruler as RulerIcon, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine, Crosshair, AlertTriangle } from 'lucide-react';

export function RulerView() {
  const { unit, setUnit, ppi, calibrateByDiagonal } = useCalibrationStore();
  const [edges, setEdges] = useState({
    top: true,
    bottom: false,
    left: true,
    right: false,
  });
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [presetDiagonal, setPresetDiagonal] = useState('custom');

  const isCalibrated = ppi !== 96;

  const toggleEdge = (edge: keyof typeof edges) => {
    setEdges(prev => ({ ...prev, [edge]: !prev[edge] }));
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setPresetDiagonal(val);
    if (val !== 'custom') {
      const diag = parseFloat(val);
      calibrateByDiagonal(window.innerWidth, window.innerHeight, diag);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full z-10"
    >
      {edges.top && <Ruler position="top" size={30} />}
      {edges.bottom && <Ruler position="bottom" size={30} />}
      {edges.left && <Ruler position="left" size={30} />}
      {edges.right && <Ruler position="right" size={30} />}

      {showCrosshair && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/30" />
          <div className="absolute left-1/2 top-0 h-full w-[1px] bg-white/30" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-white/50 rounded-full" />
        </div>
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-6 p-8 bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl shadow-2xl max-w-sm w-full">
          <div className="text-center space-y-2">
            <RulerIcon className="w-10 h-10 text-white mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold text-white">Régua Virtual</h2>
          </div>

          {!isCalibrated && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex items-center gap-3 text-left w-full">
              <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
              <p className="text-xs text-yellow-200">
                Calibre sua tela para precisão real.
              </p>
            </div>
          )}

          {/* Fast Calibration HUD */}
          <div className="w-full space-y-2 bg-[#0a0a0a] p-4 rounded-2xl border border-[#222]">
            <label className="text-xs text-[#888] font-semibold uppercase tracking-wider block">Calibração Rápida (Diagonal)</label>
            <select
              value={presetDiagonal}
              onChange={handlePresetChange}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#666] appearance-none"
            >
              <option value="custom">Custom (Vá para Calibrar)</option>
              <option value="15.6">15.6" (Laptop)</option>
              <option value="23.8">23.8" (Monitor)</option>
              <option value="24">24.0" (Monitor)</option>
              <option value="27">27.0" (Monitor)</option>
              <option value="32">32.0" (Monitor)</option>
            </select>
          </div>

          <div className="bg-[#0a0a0a] p-1.5 rounded-xl border border-[#222] flex items-center w-full">
            <button
              onClick={() => setUnit('cm')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                unit === 'cm'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              cm
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                unit === 'in'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              inch
            </button>
          </div>

          <div className="w-full h-px bg-[#222]" />

          <div className="flex gap-2 w-full justify-center">
            <button
              onClick={() => toggleEdge('top')}
              className={`p-3 rounded-xl border transition-all ${edges.top ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white hover:border-[#555]'}`}
            >
              <ArrowUpFromLine className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleEdge('bottom')}
              className={`p-3 rounded-xl border transition-all ${edges.bottom ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white hover:border-[#555]'}`}
            >
              <ArrowDownFromLine className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleEdge('left')}
              className={`p-3 rounded-xl border transition-all ${edges.left ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white hover:border-[#555]'}`}
            >
              <ArrowLeftFromLine className="w-5 h-5" />
            </button>
            <button
              onClick={() => toggleEdge('right')}
              className={`p-3 rounded-xl border transition-all ${edges.right ? 'bg-white text-black border-white' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white hover:border-[#555]'}`}
            >
              <ArrowRightFromLine className="w-5 h-5" />
            </button>
            
            <div className="w-px h-10 bg-[#333] mx-1 self-center" />
            
            <button
              onClick={() => setShowCrosshair(!showCrosshair)}
              className={`p-3 rounded-xl border transition-all ${showCrosshair ? 'bg-blue-500/20 text-blue-400 border-blue-500/50' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white hover:border-[#555]'}`}
              title="Régua Central"
            >
              <Crosshair className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
