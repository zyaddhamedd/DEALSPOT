"use client";

type ColorSelectorProps = {
  colors: { name: string; hex: string }[];
  selectedColor: string;
  onChange: (colorName: string) => void;
};

export function ColorSelector({ colors, selectedColor, onChange }: ColorSelectorProps) {
  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-[#111] uppercase tracking-wider">
          اختار اللون
        </span>
        <span className="text-xs font-bold text-accent bg-accent/5 px-2 py-0.5 rounded-full">
          {selectedColor || "لم يتم الاختيار"}
        </span>
      </div>

      <div className="flex flex-wrap gap-4">
        {colors.map((color) => {
          const isActive = selectedColor === color.name;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => onChange(color.name)}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                  isActive 
                    ? "border-accent scale-110 shadow-lg" 
                    : "border-transparent hover:border-gray-200"
                }`}
              >
                <div
                  className="h-7 w-7 rounded-full border border-gray-100 shadow-inner"
                  style={{ backgroundColor: color.hex }}
                />
                {isActive && (
                  <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white shadow-sm scale-110 animate-in zoom-in duration-300">
                    <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              <span className={`text-[10px] font-bold uppercase transition-colors ${isActive ? "text-accent" : "text-gray-400"}`}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
