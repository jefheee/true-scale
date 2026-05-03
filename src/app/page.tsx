'use client';

import { useState } from 'react';
import { Ruler } from '@/components/Ruler';
import { CalibrationPanel } from '@/components/CalibrationPanel';
import { CenterMarkMode } from '@/components/CenterMarkMode';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Crosshair, Ruler as RulerIcon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [centerModeOpen, setCenterModeOpen] = useState(false);
  const { unit, setUnit } = useCalibrationStore();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-white/20">
      {/* Rulers */}
      <Ruler orientation="horizontal" size={30} />
      <Ruler orientation="vertical" size={30} />

      {/* Main Content Area */}
      <div className="pt-20 pl-20 pr-8 pb-12 flex flex-col items-center justify-center min-h-screen relative z-10">
        
        {/* Header / Brand */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <RulerIcon className="w-8 h-8 text-white" />
            <h1 className="text-4xl font-bold tracking-tight text-white">TrueScale</h1>
          </div>
          <p className="text-[#a1a1a1] text-sm max-w-md mx-auto">
            Régua virtual de precisão e ferramentas de alinhamento físico.
            Calibre seu monitor para obter medidas exatas.
          </p>
        </motion.div>

        {/* Global Controls */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
        >
          <div className="bg-[#111] p-1 rounded-xl border border-[#333] flex items-center backdrop-blur-md">
            <button
              onClick={() => setUnit('cm')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                unit === 'cm'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Centímetros (cm)
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                unit === 'in'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Polegadas (in)
            </button>
          </div>

          <button
            onClick={() => setCenterModeOpen(true)}
            className="group bg-[#111] hover:bg-[#1a1a1a] border border-[#333] hover:border-[#555] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Crosshair className="w-4 h-4 text-[#888] group-hover:text-white transition-colors" />
            Find Center
          </button>
        </motion.div>

        {/* Calibration Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <CalibrationPanel />
        </motion.div>

      </div>

      {/* Center Mark Overlay */}
      <CenterMarkMode 
        isOpen={centerModeOpen} 
        onClose={() => setCenterModeOpen(false)} 
      />
    </main>
  );
}
