'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { CreditCard, Monitor, Plus, Minus, RotateCcw } from 'lucide-react';

export function CalibrationView() {
  const { ppi, calibrateByCreditCard, calibrateByDiagonal, resetCalibration } = useCalibrationStore();
  const [method, setMethod] = useState<'card' | 'diagonal'>('card');
  const [diagonal, setDiagonal] = useState<string>('24');
  
  // Card state (scale factor)
  const [cardScale, setCardScale] = useState(ppi / 254); // ppi / (25.4 * 10) to map standard sizes

  // Calculate ppi based on scale. If base width is 856px representing 85.6mm (10px = 1mm at scale 1).
  // At scale 1, width on screen is 856px. Physical is 85.6mm.
  // PPI = pixels / inches = (856 * scale) / (85.6 / 25.4) = 254 * scale.

  const handleCardResize = (deltaScale: number) => {
    const newScale = Math.max(0.2, Math.min(3.0, cardScale + deltaScale));
    setCardScale(newScale);
    calibrateByCreditCard(856 * newScale);
  };

  const handleDiagonalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const diag = parseFloat(diagonal);
    if (!isNaN(diag) && diag > 0) {
      calibrateByDiagonal(window.innerWidth, window.innerHeight, diag);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-10"
    >
      <div className="bg-[#111]/80 backdrop-blur-2xl border border-[#333] rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4 relative pointer-events-auto">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#555] to-transparent" />
        
        <div className="flex gap-2 mb-8 bg-[#0a0a0a] p-1.5 rounded-xl border border-[#222]">
          <button
            onClick={() => setMethod('card')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              method === 'card' 
                ? 'bg-[#222] text-white shadow-sm' 
                : 'text-[#888] hover:text-[#bbb]'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cartão Físico
          </button>
          <button
            onClick={() => setMethod('diagonal')}
            className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              method === 'diagonal' 
                ? 'bg-[#222] text-white shadow-sm' 
                : 'text-[#888] hover:text-[#bbb]'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Diagonal
          </button>
        </div>

        <div className="min-h-[350px] relative">
          <AnimatePresence mode="wait">
            {method === 'card' ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-8 w-full"
              >
                <div className="text-center space-y-2">
                  <p className="text-[#a1a1a1] text-sm">
                    Ajuste a escala até que o retângulo tenha o exato tamanho de um cartão de crédito padrão (85.6mm x 53.98mm).
                  </p>
                </div>

                {/* Virtual Card Wrapper - container with fixed height */}
                <div className="relative w-full h-64 overflow-hidden flex items-center justify-center pointer-events-none bg-[#0a0a0a] rounded-xl border border-[#222]">
                  {/* Actual Card scaled via transform */}
                  <div 
                    className="absolute bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl border border-[#444] shadow-[0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center"
                    style={{ 
                      width: '856px', 
                      height: '539.8px',
                      transform: `scale(${cardScale})`,
                      transformOrigin: 'center center',
                    }}
                  >
                    <CreditCard className="w-32 h-32 text-[#555] opacity-20 absolute" />
                    <div className="absolute bottom-16 left-16 w-[15%] h-[15%] bg-[#333] rounded-xl opacity-50" />
                    <div className="absolute top-1/2 right-16 w-[15%] h-[5%] bg-[#333] rounded-md opacity-50 -translate-y-1/2" />
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full space-y-5 relative z-20 mt-4">
                  <input 
                    type="range" 
                    min="0.2" 
                    max="1.5" 
                    step="0.001"
                    value={cardScale}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCardScale(val);
                      calibrateByCreditCard(856 * val);
                    }}
                    className="w-full accent-white h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handleCardResize(-0.01)}
                      className="p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-white transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <span className="text-white font-mono text-lg font-medium block">
                        {(856 * cardScale).toFixed(1)}px
                      </span>
                      <span className="text-[#666] text-xs">Largura em pixels</span>
                    </div>
                    <button 
                      onClick={() => handleCardResize(0.01)}
                      className="p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="diagonal"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="text-center space-y-2">
                  <p className="text-[#a1a1a1] text-sm">
                    A precisão matemática perfeita: insira a diagonal exata do seu monitor (ex: 23.8, 27).
                  </p>
                </div>

                <form onSubmit={handleDiagonalSubmit} className="w-full space-y-6">
                  <div className="space-y-2">
                    <label className="text-[#a1a1a1] text-xs uppercase tracking-widest font-semibold ml-1">
                      Diagonal em Polegadas
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={diagonal}
                        onChange={(e) => setDiagonal(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-4 text-white font-mono text-xl focus:outline-none focus:border-[#666] transition-colors"
                        placeholder="24.0"
                        required
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] font-mono text-xl">
                        "
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-[#e0e0e0] transition-colors active:scale-[0.98]"
                  >
                    Aplicar Calibração
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-[#222] flex justify-between items-center">
          <div className="text-sm text-[#666] font-mono flex items-center gap-3">
            <span>PPI Atual:</span>
            <span className="text-white bg-[#222] px-3 py-1.5 rounded-md font-semibold">
              {ppi.toFixed(2)}
            </span>
          </div>
          <button
            onClick={resetCalibration}
            className="text-[#666] hover:text-white transition-colors flex items-center gap-1.5 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>
    </motion.div>
  );
}
