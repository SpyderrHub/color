
"use client";

import React, { useState } from 'react';
import { GradientPreview } from './gradient-preview';
import { ColorStopItem } from './color-stop-item';
import { ColorStop, generateRandomColor, downloadGradientAsPNG } from '@/lib/gradient-utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Plus, RotateCcw, Download, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export function GradientEditor() {
  const [stops, setStops] = useState<ColorStop[]>([
    { id: '1', color: '#9F26E5', position: 0 },
    { id: '2', color: '#4D4DE6', position: 100 },
  ]);
  const [angle, setAngle] = useState(135);

  const addStop = () => {
    if (stops.length >= 6) return;
    const newStop: ColorStop = {
      id: Math.random().toString(36).substr(2, 9),
      color: generateRandomColor(),
      position: Math.min(100, stops[stops.length - 1].position + 10),
    };
    setStops([...stops, newStop]);
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const updateStop = (id: string, updates: Partial<ColorStop>) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const randomize = () => {
    setAngle(Math.floor(Math.random() * 360));
    setStops(stops.map(s => ({ ...s, color: generateRandomColor() })));
  };

  const reset = () => {
    setAngle(135);
    setStops([
      { id: '1', color: '#9F26E5', position: 0 },
      { id: '2', color: '#4D4DE6', position: 100 },
    ]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-start">
      {/* Left Column: Preview */}
      <div className="lg:col-span-7 space-y-6">
        <GradientPreview stops={stops} angle={angle} />
        
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white/40 p-4 rounded-2xl border border-white/60 shadow-sm">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <span className="text-sm font-bold text-muted-foreground flex items-center gap-2">
              <RotateCcw className="h-4 w-4" /> Angle
            </span>
            <Slider
              value={[angle]}
              onValueChange={([val]) => setAngle(val)}
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="font-mono text-sm bg-white/80 px-2 py-1 rounded border border-white/60 min-w-[50px] text-center">
              {angle}°
            </span>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={randomize} className="gap-2 rounded-full border-primary/20 hover:bg-primary/10">
              <Sparkles className="h-4 w-4 text-primary" />
              Randomize
            </Button>
            <Button variant="outline" size="sm" onClick={reset} className="gap-2 rounded-full border-muted-foreground/20">
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="lg:col-span-5 space-y-6 bg-white/30 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-headline font-bold text-foreground">Color Stops</h2>
          <Button 
            onClick={addStop} 
            disabled={stops.length >= 6}
            size="sm" 
            className="gap-2 rounded-full bg-accent hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" /> Add Stop
          </Button>
        </div>

        <ScrollArea className="h-[450px] pr-4 -mr-4">
          <div className="space-y-4">
            {stops.map((stop) => (
              <ColorStopItem
                key={stop.id}
                stop={stop}
                onUpdate={updateStop}
                onRemove={removeStop}
                canRemove={stops.length > 2}
              />
            ))}
          </div>
        </ScrollArea>

        <div className="pt-4 border-t border-white/60">
          <Button 
            className="w-full gap-2 rounded-2xl h-12 text-lg font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => downloadGradientAsPNG(stops, angle)}
          >
            <Download className="h-5 w-5" />
            Download PNG
          </Button>
          <p className="text-center text-[10px] text-muted-foreground mt-3 uppercase tracking-widest font-bold">
            High Quality 2000x2000 Export
          </p>
        </div>
      </div>
    </div>
  );
}
