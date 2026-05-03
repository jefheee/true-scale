'use client';

import { motion } from 'framer-motion';
import { Ruler } from '@/components/Ruler';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Ruler as RulerIcon } from 'lucide-react';

export function RulerView() {
  const { unit, setUnit } = useCalibrationStore();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full"
    >
      <Ruler orientation="horizontal" size={30} />
      <Ruler orientation="vertical" size={30} />

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="pointer-events-auto flex flex-col items-center gap-6 p-8 bg-[#111]/80 backdrop-blur-xl border border-[#333] rounded-3xl shadow-2xl">
          <div className="text-center space-y-2">
            <RulerIcon className="w-10 h-10 text-white mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold text-white">Régua Virtual</h2>
            <p className="text-[#a1a1a1] text-sm max-w-[250px]">
              Utilize a régua no topo e na lateral para medições precisas.
            </p>
          </div>

          <div className="bg-[#0a0a0a] p-1.5 rounded-xl border border-[#222] flex items-center">
            <button
              onClick={() => setUnit('cm')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                unit === 'cm'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Centímetros
            </button>
            <button
              onClick={() => setUnit('in')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                unit === 'in'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#888] hover:text-white'
              }`}
            >
              Polegadas
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
