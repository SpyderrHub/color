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
      
      {/* Grain Texture Overlay for a high-end feel */}
      <div className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Decorative Wavy Graphics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Organic Wave 1 - Static */}
        <svg 
          className="absolute -top-20 -left-20 w-[140%] h-[140%] opacity-20 blur-2xl" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <path 
            fill="white" 
            d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" 
          />
        </svg>

        {/* Organic Wave 2 - Static */}
        <svg 
          className="absolute -bottom-40 -right-40 w-[150%] h-[150%] opacity-10 blur-3xl" 
          viewBox="0 0 100 100" 
          preserveAspectRatio="none"
        >
          <path 
            fill="black" 
            d="M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z" 
          />
        </svg>

        {/* Floating Geometric Orbs - Static */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 shadow-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10" />
        
        {/* Subtle Grid Lines Overlay */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} 
        />

        {/* Framing Accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-white/30" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-white/30" />
        
        {/* Preview Typography */}
        <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-white/10 font-black text-8xl md:text-[12rem] tracking-tighter uppercase select-none pointer-events-none italic">
             FLOW
           </span>
        </div>
      </div>

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
