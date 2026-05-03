'use client';

import { useState } from 'react';
import { useCalibrationStore } from '@/store/useCalibrationStore';
import { CreditCard, Monitor, Plus, Minus, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function CalibrationPanel() {
  const { ppi, calibrateByCreditCard, calibrateByDiagonal, resetCalibration } = useCalibrationStore();
  const [method, setMethod] = useState<'card' | 'diagonal'>('card');
  
  // Card state
  const [cardWidthPixels, setCardWidthPixels] = useState(ppi * (85.6 / 25.4)); // Initial guess based on current PPI

  // Diagonal state
  const [diagonal, setDiagonal] = useState<string>('24');

  const handleCardResize = (delta: number) => {
    const newWidth = Math.max(100, Math.min(800, cardWidthPixels + delta));
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
    <div className="bg-[#111] border border-[#333] rounded-2xl p-6 shadow-2xl backdrop-blur-xl w-full max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#444] to-transparent" />
      
      <div className="flex gap-2 mb-8 bg-[#0a0a0a] p-1 rounded-lg border border-[#222]">
        <button
          onClick={() => setMethod('card')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            method === 'card' 
              ? 'bg-[#222] text-white shadow-sm' 
              : 'text-[#888] hover:text-[#bbb]'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Cartão
        </button>
        <button
          onClick={() => setMethod('diagonal')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
            method === 'diagonal' 
              ? 'bg-[#222] text-white shadow-sm' 
              : 'text-[#888] hover:text-[#bbb]'
          }`}
        >
          <Monitor className="w-4 h-4" />
          Monitor
        </button>
      </div>

      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          {method === 'card' ? (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-white font-medium text-lg">Calibração Física</h3>
                <p className="text-[#a1a1a1] text-sm">
                  Pegue um cartão de crédito e ajuste o retângulo abaixo para o mesmo tamanho real.
                </p>
              </div>

              {/* Virtual Card */}
              <div 
                className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-xl border border-[#444] flex items-center justify-center shadow-lg relative"
                style={{ 
                  width: `${cardWidthPixels}px`, 
                  height: `${cardWidthPixels * (53.98 / 85.6)}px`,
                  transition: 'width 0.1s ease-out, height 0.1s ease-out'
                }}
              >
                <CreditCard className="w-8 h-8 text-[#555] opacity-50" />
                <div className="absolute bottom-4 left-4 w-12 h-8 bg-[#333] rounded-md opacity-50" />
                <div className="absolute top-1/2 right-4 w-12 h-2 bg-[#333] rounded-sm opacity-50" />
              </div>

              {/* Controls */}
              <div className="w-full space-y-4">
                <input 
                  type="range" 
                  min="100" 
                  max="800" 
                  value={cardWidthPixels}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setCardWidthPixels(val);
                    calibrateByCreditCard(val);
                  }}
                  className="w-full accent-white"
                />
                <div className="flex justify-between items-center">
                  <button 
                    onClick={() => handleCardResize(-10)}
                    className="p-3 bg-[#1a1a1a] hover:bg-[#222] border border-[#333] rounded-lg text-white transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-white font-mono text-sm bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333]">
                    {Math.round(cardWidthPixels)}px
                  </span>
                  <button 
                    onClick={() => handleCardResize(10)}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-white font-medium text-lg">Calibração por Diagonal</h3>
                <p className="text-[#a1a1a1] text-sm">
                  Insira o tamanho exato da diagonal do seu monitor em polegadas.
                </p>
              </div>

              <form onSubmit={handleDiagonalSubmit} className="w-full space-y-6">
                <div className="space-y-2">
                  <label className="text-[#a1a1a1] text-xs uppercase tracking-wider font-semibold ml-1">
                    Polegadas (ex: 24, 27)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={diagonal}
                      onChange={(e) => setDiagonal(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-[#333] rounded-xl px-4 py-4 text-white font-mono text-lg focus:outline-none focus:border-[#666] transition-colors"
                      placeholder="24"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#666] font-mono">
                      "
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black font-semibold py-4 rounded-xl hover:bg-[#e0e0e0] transition-colors active:scale-[0.98]"
                >
                  Calibrar
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 pt-6 border-t border-[#222] flex justify-between items-center">
        <div className="text-xs text-[#666] font-mono flex items-center gap-2">
          <span>PPI Atual:</span>
          <span className="text-white bg-[#222] px-2 py-1 rounded">
            {ppi.toFixed(1)}
          </span>
        </div>
        <button
          onClick={resetCalibration}
          className="text-[#666] hover:text-white transition-colors flex items-center gap-1 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          Resetar
        </button>
      </div>
    </div>
  );
}
