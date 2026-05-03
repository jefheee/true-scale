'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { NavigationDock, ViewState } from '@/components/NavigationDock';
import { RulerView } from '@/components/views/RulerView';
import { CalibrationView } from '@/components/views/CalibrationView';
import { CenterMarkView } from '@/components/views/CenterMarkView';
import { MountingJigsView } from '@/components/views/MountingJigsView';
import { FovAlignerView } from '@/components/views/FovAlignerView';
import { SplineBackground } from '@/components/ui/SplineBackground';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('ruler');

  return (
    <main className="h-screen w-screen text-[#ededed] font-sans selection:bg-white/20 overflow-hidden relative isolate">
      <SplineBackground />
      
      <AnimatePresence mode="wait">
        {currentView === 'ruler' && <RulerView key="ruler" />}
        {currentView === 'calibration' && <CalibrationView key="calibration" />}
        {currentView === 'center-mark' && <CenterMarkView key="center-mark" />}
        {currentView === 'mounting-jigs' && <MountingJigsView key="mounting-jigs" />}
        {currentView === 'fov-aligner' && <FovAlignerView key="fov-aligner" />}
      </AnimatePresence>

      <NavigationDock 
        currentView={currentView} 
        onChangeView={setCurrentView} 
      />
    </main>
  );
}
