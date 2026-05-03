'use client';

import { motion } from 'framer-motion';
import { Ruler, CreditCard, Crosshair, MonitorUp } from 'lucide-react';

export type ViewState = 'ruler' | 'calibration' | 'center-mark' | 'top-notch';

interface NavigationDockProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

const navItems = [
  { id: 'ruler', icon: Ruler, label: 'Régua', tooltip: 'Régua Virtual de Precisão' },
  { id: 'calibration', icon: CreditCard, label: 'Calibrar', tooltip: 'Ajuste o PPI para medidas reais' },
  { id: 'center-mark', icon: Crosshair, label: 'Center', tooltip: 'Alinhamento físico com grid milimétrico' },
  { id: 'top-notch', icon: MonitorUp, label: 'Lightbar', tooltip: 'Gabarito para montagem de lightbar/webcam' },
] as const;

export function NavigationDock({ currentView, onChangeView }: NavigationDockProps) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200]">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl"
      >
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className="relative group p-3 rounded-xl hover:bg-white/10 transition-colors"
              title={item.tooltip}
            >
              {isActive && (
                <motion.div
                  layoutId="active-indicator"
                  className="absolute inset-0 bg-white/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                strokeWidth={isActive ? 2.5 : 2} 
                className={`w-6 h-6 relative z-10 transition-colors ${
                  isActive ? 'text-white' : 'text-[#888] group-hover:text-white'
                }`} 
              />

              {/* Luminous Dot */}
              {isActive && (
                <motion.div
                  layoutId="active-dot"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"
                />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1.5 bg-[#111] border border-[#333] text-white text-xs whitespace-nowrap rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.tooltip}
              </div>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
