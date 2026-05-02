
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
        className="absolute inset-0 transition-all duration-700 ease-in-out"
        style={{ background: gradientCSS }}
      />
      
      {/* Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Central Liquid Sphere Effect - Inspired by the provided warped circular graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
          {/* SVG Filter for static warping/liquification effect */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="liquid-warp">
                <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="5" result="noise" />
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="40" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
          </svg>

          {/* The Sphere Layers */}
          <div className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.2)]" 
               style={{ filter: 'url(#liquid-warp)' }}>
            
            {/* Base Swirl */}
            <div 
              className="absolute inset-0 scale-125"
              style={{ 
                background: `conic-gradient(from ${angle}deg, ${stops.map(s => s.color).join(', ')})`,
                filter: 'blur(10px) saturate(1.5) contrast(1.1)'
              }}
            />
            
            {/* Dynamic Color Highlights based on stops */}
            <div 
              className="absolute inset-0 opacity-60 mix-blend-screen"
              style={{ 
                background: `radial-gradient(circle at 30% 30%, ${stops[0].color}, transparent 60%),
                             radial-gradient(circle at 70% 70%, ${stops[stops.length-1].color}, transparent 60%)`,
                filter: 'blur(20px)'
              }}
            />

            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20" />
          </div>

          {/* Glass Inner Reflection */}
          <div className="absolute inset-[10%] rounded-full border-t border-white/30 backdrop-blur-[2px] opacity-40" />
          <div className="absolute top-[15%] left-[20%] w-[20%] h-[20%] bg-white/40 rounded-full blur-xl" />
        </div>
      </div>

      {/* Subtle Grid Lines Overlay */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
      />

      {/* Framing Accents */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/30" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/30" />

      {/* CSS Snippet Bar */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 px-5 py-3 rounded-2xl text-white text-[10px] md:text-xs font-mono shadow-2xl group-hover:bg-black/60 transition-all flex items-center gap-3">
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
