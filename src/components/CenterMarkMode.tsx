'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface CenterMarkModeProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CenterMarkMode({ isOpen, onClose }: CenterMarkModeProps) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsIdle(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsIdle(true), 2000);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Initialize timeout
    timeoutId = setTimeout(() => setIsIdle(true), 2000);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center transition-cursor duration-300 ${
            isIdle ? 'cursor-none' : 'cursor-default'
          }`}
        >
          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isIdle ? 0 : 1 }}
            className="absolute top-8 right-8 text-white/50 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={onClose}
          >
            <X className="w-8 h-8" />
          </motion.button>

          {/* Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/20 -translate-x-1/2 overflow-hidden">
            <motion.div
              animate={{
                y: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="w-full h-[30%] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
            />
          </div>

          {/* Horizontal Line */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/20 -translate-y-1/2 overflow-hidden">
            <motion.div
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="h-full w-[30%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
            />
          </div>

          {/* Concentric Crosshairs */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute w-64 h-64 border border-white/10 rounded-full"
            />
            {/* Middle Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute w-32 h-32 border border-white/20 rounded-full"
            />
            {/* Inner Ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute w-12 h-12 border border-white/40 rounded-full"
            />
            {/* Center Dot */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
            />

            {/* Corner Markers (Reticle style) */}
            <div className="absolute w-40 h-40">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/30" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/30" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/30" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/30" />
            </div>
          </div>

          {/* Instruction Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isIdle ? 0 : 1, y: 0 }}
            className="absolute bottom-12 text-center"
          >
            <p className="text-white/50 text-sm font-mono tracking-widest uppercase">
              Alinhe seu hardware com o centro
            </p>
            <p className="text-white/30 text-xs mt-2">
              Pressione ESC para sair
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
