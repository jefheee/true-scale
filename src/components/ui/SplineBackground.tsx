'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline/next'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-[-1] bg-[#0a0a0a] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#333] border-t-[#888] rounded-full animate-spin" />
    </div>
  ),
});

export function SplineBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-auto bg-[#0a0a0a]">
      <Spline scene="https://prod.spline.design/Qt5XshrfpGruIuS1/scene.splinecode" />
    </div>
  );
}
