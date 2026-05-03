'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Ruler } from '@/components/Ruler';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { Ruler as RulerIcon, ArrowUpFromLine, ArrowDownFromLine, ArrowLeftFromLine, ArrowRightFromLine } from 'lucide-react';

export function RulerView() {
  const { unit, setUnit } = useCalibrationStore();
  const [edges, setEdges] = useState({
    top: true,
    bottom: false,
    left: true,
    right: false,
  });

  const toggleEdge = (edge: keyof typeof edges) => {
    setEdges(prev => ({ ...prev, [edge]: !prev[edge] }));
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

          <div className="w-full h-px bg-[#222]" />

          <div className="flex gap-2">
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
