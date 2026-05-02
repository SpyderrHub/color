
"use client";

import React from 'react';
import { generateGradientCSS, ColorStop } from '@/lib/gradient-utils';

interface GradientPreviewProps {
  stops: ColorStop[];
  angle: number;
}

export function GradientPreview({ stops, angle }: GradientPreviewProps) {
  const gradientCSS = generateGradientCSS(stops, angle);

  return (
    <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white animate-fade-in bg-white/50 backdrop-blur-sm">
      <div
        className="absolute inset-0 transition-all duration-500 ease-in-out"
        style={{ background: gradientCSS }}
      />
      <div className="absolute bottom-4 left-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
        {gradientCSS}
      </div>
    </div>
  );
}
