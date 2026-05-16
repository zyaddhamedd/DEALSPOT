"use client";

import { useState, KeyboardEvent } from "react";

type SizeManagerProps = {
  sizes: string[];
  onChange: (sizes: string[]) => void;
};

export function SizeManager({ sizes, onChange }: SizeManagerProps) {
  const [inputValue, setInputValue] = useState("");

  const addSize = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !sizes.includes(trimmed)) {
      onChange([...sizes, trimmed]);
      setInputValue("");
    }
  };

  const removeSize = (sizeToRemove: string) => {
    onChange(sizes.filter((s) => s !== sizeToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSize();
    }
  };

  return (
    <div className="flex flex-col gap-2 md:col-span-2">
      <span className="text-sm font-medium text-white/60">Product Sizes</span>
      
      <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
        {sizes.map((size) => (
          <div
            key={size}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 transition hover:border-[#e11d2f]/50 hover:bg-[#e11d2f]/5"
          >
            <span className="text-sm font-bold text-white">{size}</span>
            <button
              type="button"
              onClick={() => removeSize(size)}
              className="flex h-5 w-5 items-center justify-center rounded-lg text-white/40 transition hover:bg-[#e11d2f] hover:text-white"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        <div className="flex flex-1 min-w-[120px] items-center gap-2 px-1">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={sizes.length === 0 ? "Add size (e.g. 41)..." : "Add..."}
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
          />
          {inputValue && (
            <button
              type="button"
              onClick={addSize}
              className="rounded-lg bg-[#e11d2f] px-3 py-1 text-[10px] font-bold text-white uppercase"
            >
              Add
            </button>
          )}
        </div>
      </div>
      
      <p className="text-[10px] text-white/30 px-1">
        Press Enter or click Add to save a size. Each size appears as a selectable pill on the product page.
      </p>
    </div>
  );
}
