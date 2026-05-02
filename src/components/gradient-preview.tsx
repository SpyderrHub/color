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
    <div className="relative w-full aspect-square md:aspect-video rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white animate-fade-in group bg-muted/20">
      {/* The Base Gradient */}
      <div
        className="absolute inset-0 transition-all duration-500 ease-in-out"
        style={{ background: gradientCSS }}
      />
      
      {/* CSS Snippet Bar */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-5 py-3 rounded-2xl text-white text-[10px] md:text-xs font-mono shadow-2xl transition-all flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="flex-1 truncate">
            <span className="opacity-50 mr-2">background:</span>
            {gradientCSS};
          </div>
        </div>
      </div>
    </div>
  );
}
