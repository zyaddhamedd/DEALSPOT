import React from "react";

type AdminStatCardProps = {
  label: string;
  value: string;
  helper: string;
  glowColor?: "cyan" | "amber" | "green" | "red" | "purple";
  pulse?: boolean;
};

export function AdminStatCard({ label, value, helper, glowColor = "cyan", pulse = false }: AdminStatCardProps) {
  const colorClass = `cockpit-neon-${glowColor}`;

  return (
    <div className="cockpit-panel p-5 sm:p-6 group">
      <div className="radar-scan hidden group-hover:block opacity-50"></div>
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-white/50">{label}</p>
          <div className={`w-2 h-2 rounded-full bg-current ${colorClass} ${pulse ? "animate-blink" : ""} cockpit-text-glow shadow-[0_0_8px_currentColor]`}></div>
        </div>
        <div>
          <p className={`text-3xl sm:text-4xl font-bold cockpit-digital-font cockpit-text-glow ${colorClass}`}>
            {value}
          </p>
          <div className="cockpit-divider"></div>
          <p className="text-[10px] sm:text-xs text-white/40 font-mono tracking-widest leading-relaxed">{helper}</p>
        </div>
      </div>
    </div>
  );
}
