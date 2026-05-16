"use client";

import { useState } from "react";

type ColorManagerProps = {
  colors: { name: string; hex: string }[];
  onChange: (colors: { name: string; hex: string }[]) => void;
};

const PRESET_COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#E11D2F" },
  { name: "Blue", hex: "#1D4ED8" },
  { name: "Green", hex: "#10B981" },
  { name: "Gray", hex: "#9CA3AF" },
  { name: "Beige", hex: "#F5F5DC" },
];

export function ColorManager({ colors = [], onChange }: ColorManagerProps) {
  const toggleColor = (preset: { name: string; hex: string }) => {
    const exists = colors.some((c) => c.hex === preset.hex);
    if (exists) {
      onChange(colors.filter((c) => c.hex !== preset.hex));
    } else {
      onChange([...colors, preset]);
    }
  };

  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <span className="text-sm font-medium text-white/60">Product Colors</span>
      
      <div className="flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        {PRESET_COLORS.map((preset) => {
          const isActive = colors.some((c) => c.hex === preset.hex);
          return (
            <button
              key={preset.hex}
              type="button"
              onClick={() => toggleColor(preset)}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-2 transition ${
                isActive 
                  ? "border-accent bg-accent/10" 
                  : "border-white/5 bg-white/5 hover:border-white/20"
              }`}
            >
              <div 
                className="h-5 w-5 rounded-full border border-white/10 shadow-sm" 
                style={{ backgroundColor: preset.hex }}
              />
              <span className={`text-sm font-bold ${isActive ? "text-white" : "text-white/40"}`}>
                {preset.name}
              </span>
              {isActive && (
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <p className="text-[10px] text-white/30 px-1">
        Select the colors available for this product. These will appear as premium color swatches on the landing page.
      </p>
    </div>
  );
}
