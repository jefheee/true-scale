'use client';

import Spline from '@splinetool/react-spline';

export function SplineBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-auto bg-[#0a0a0a]">
      <Spline scene="https://prod.spline.design/Qt5XshrfpGruIuS1/scene.splinecode" />
    </div>
  );
}
