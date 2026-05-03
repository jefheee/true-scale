'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavigationDock, ViewState } from '@/components/NavigationDock';
import { RulerView } from '@/components/views/RulerView';
import { CalibrationView } from '@/components/views/CalibrationView';
import { CenterMarkView } from '@/components/views/CenterMarkView';
import { TopNotchView } from '@/components/views/TopNotchView';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('ruler');

  return (
    <main className="h-screen w-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-white/20 overflow-hidden relative">
      <AnimatePresence mode="wait">
        {currentView === 'ruler' && <RulerView key="ruler" />}
        {currentView === 'calibration' && <CalibrationView key="calibration" />}
        {currentView === 'center-mark' && <CenterMarkView key="center-mark" />}
        {currentView === 'top-notch' && <TopNotchView key="top-notch" />}
      </AnimatePresence>

      <NavigationDock 
        currentView={currentView} 
        onChangeView={setCurrentView} 
      />
    </main>
  );
}
