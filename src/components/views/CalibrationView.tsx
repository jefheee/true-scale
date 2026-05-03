'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { CreditCard, Monitor, Plus, Minus, RotateCcw } from 'lucide-react';

export function CalibrationView() {
  const { ppi, calibrateByCreditCard, calibrateByDiagonal, resetCalibration } = useCalibrationStore();
  const [method, setMethod] = useState<'card' | 'diagonal'>('card');
  
  // Card state (only width matters now)
  const [cardWidthPixels, setCardWidthPixels] = useState(ppi * (85.6 / 25.4)); 

  // Diagonal state
  const [diagonal, setDiagonal] = useState<string>('24');

  const handleCardResize = (delta: number) => {
    const newWidth = Math.max(100, Math.min(1000, cardWidthPixels + delta));
    setCardWidthPixels(newWidth);
    calibrateByCreditCard(newWidth);
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
      className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
    >
      <div className="bg-[#111]/80 backdrop-blur-2xl border border-[#333] rounded-3xl p-8 shadow-2xl w-full max-w-md mx-4 relative overflow-hidden pointer-events-auto">
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

        <div className="min-h-[320px]">
          <AnimatePresence mode="wait">
            {method === 'card' ? (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-8"
              >
                <div className="text-center space-y-2">
                  <p className="text-[#a1a1a1] text-sm">
                    Ajuste a largura até que o retângulo tenha o exato tamanho de um cartão de crédito padrão.
                  </p>
                </div>

                {/* Virtual Card with strict aspect ratio */}
                <div 
                  className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl border border-[#444] flex items-center justify-center shadow-lg relative aspect-[85.6/53.98]"
                  style={{ 
                    width: `${cardWidthPixels}px`, 
                    transition: 'width 0.1s ease-out'
                  }}
                >
                  <CreditCard className="w-8 h-8 text-[#555] opacity-50 absolute" />
                  <div className="absolute bottom-4 left-4 w-[15%] h-[15%] bg-[#333] rounded-sm opacity-50" />
                  <div className="absolute top-1/2 right-4 w-[15%] h-[5%] bg-[#333] rounded-sm opacity-50" />
                </div>

                {/* Controls */}
                <div className="w-full space-y-5">
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="0.1"
                    value={cardWidthPixels}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCardWidthPixels(val);
                      calibrateByCreditCard(val);
                    }}
                    className="w-full accent-white h-1.5 bg-[#333] rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between items-center">
                    <button 
                      onClick={() => handleCardResize(-5)}
                      className="p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-white transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="text-center">
                      <span className="text-white font-mono text-lg font-medium block">
                        {cardWidthPixels.toFixed(1)}px
                      </span>
                      <span className="text-[#666] text-xs">Largura em pixels</span>
                    </div>
                    <button 
                      onClick={() => handleCardResize(5)}
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
