
"use client";

import React from 'react';
import { ColorStop } from '@/lib/gradient-utils';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface ColorStopItemProps {
  stop: ColorStop;
  onUpdate: (id: string, updates: Partial<ColorStop>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

export function ColorStopItem({ stop, onUpdate, onRemove, canRemove }: ColorStopItemProps) {
  return (
    <div className="bg-white/40 p-3 rounded-xl border border-white/60 space-y-3 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div 
          className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-inner flex-shrink-0"
          style={{ backgroundColor: stop.color }}
        >
          <input
            type="color"
            value={stop.color}
            onChange={(e) => onUpdate(stop.id, { color: e.target.value })}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
        </div>
        <Input
          value={stop.color}
          onChange={(e) => onUpdate(stop.id, { color: e.target.value })}
          className="font-mono text-xs uppercase h-8"
        />
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(stop.id)}
            className="text-muted-foreground hover:text-destructive h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-bold text-muted-foreground w-6">Pos</span>
        <Slider
          value={[stop.position]}
          onValueChange={([val]) => onUpdate(stop.id, { position: val })}
          max={100}
          step={1}
          className="flex-1"
        />
        <span className="text-[10px] font-mono text-muted-foreground w-8 text-right">
          {Math.round(stop.position)}%
        </span>
      </div>
    </div>
  );
}
