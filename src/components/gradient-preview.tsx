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
    <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white animate-fade-in group bg-background/50">
      {/* Background Soft Glow */}
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out opacity-20 blur-[100px]"
        style={{ background: gradientCSS }}
      />
      
      {/* Subtle Grid Background for technical feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />

      {/* Central Liquid Sphere */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[75%] h-[75%]">
          {/* Sphere Shadow/Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-3xl opacity-30"
            style={{ background: gradientCSS }}
          />
          
          {/* The Warped Orb */}
          <div 
            className="absolute inset-0 rounded-full overflow-hidden border border-white/30 shadow-[inset_0_0_80px_rgba(255,255,255,0.2)]"
            style={{ 
              background: gradientCSS,
              filter: 'url(#liquid-warpage) brightness(1.05) contrast(1.1)',
              transform: 'rotate(-15deg)'
            }}
          >
            {/* Internal Glass Highlights */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-white/40 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-[5%] right-[5%] w-[40%] h-[40%] bg-gradient-to-tl from-black/10 to-transparent rounded-full blur-xl" />
            
            {/* Subtle Inner Mesh */}
            <div className="absolute inset-0 opacity-20 mix-blend-overlay"
              style={{ backgroundImage: 'linear-gradient(45deg, white 1px, transparent 1px), linear-gradient(-45deg, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
          </div>
        </div>
      </div>

      {/* SVG Filter Definition (Static Displacement) */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-warpage">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed="12" />
            <feDisplacementMap in="SourceGraphic" scale="100" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
      </svg>
      
      {/* UI Elements / Snippet Bar */}
      <div className="absolute bottom-8 left-8 right-8">
        <div className="bg-black/70 backdrop-blur-3xl border border-white/15 px-6 py-4 rounded-2xl text-white text-[10px] md:text-xs font-mono shadow-2xl transition-all flex items-center gap-4 group-hover:border-primary/50">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex-1 truncate opacity-90">
            <span className="text-primary font-bold mr-2">CSS</span>
            <span className="opacity-50">background:</span>
            {gradientCSS};
          </div>
        </div>
      </div>
    </div>
  );
}
