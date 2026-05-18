"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { clearAdminSession } from "@/lib/adminAuth";
import { FlyingJet } from "@/components/FlyingJet";

const adminLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
];

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-dark min-h-screen cockpit-bg text-white font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* --- Sci-Fi Interactive Jet --- */}
      <FlyingJet />

      <div className="container-shell py-6 lg:py-8 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <aside className="cockpit-panel lg:sticky lg:top-6 lg:h-fit z-30">
            <div 
              className="p-4 sm:p-6 flex justify-between items-start cursor-pointer lg:cursor-default"
              onClick={() => window.innerWidth < 1024 && setIsMobileNavOpen(!isMobileNavOpen)}
            >
              <div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] cockpit-neon-cyan mb-1 flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isMobileNavOpen ? 'bg-green-400 shadow-[0_0_8px_var(--cockpit-green)] animate-blink' : 'bg-red-500 shadow-[0_0_8px_var(--cockpit-red)]'}`}></span>
                  System Core
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold cockpit-digital-font cockpit-neon-cyan cockpit-text-glow">DEALSPOT<br className="hidden sm:block"/> ADMIN</h1>
                <p className="mt-2 sm:mt-3 text-[10px] sm:text-[11px] font-mono text-white/50 uppercase tracking-wider">Protected internal dashboard.</p>
              </div>
              
              {/* Mobile Toggle Button */}
              <div className="lg:hidden mt-2">
                <button type="button" className={`p-2 border transition-all duration-300 ${isMobileNavOpen ? 'border-cyan-400 bg-cyan-900/40 text-cyan-400 shadow-[0_0_10px_var(--cockpit-cyan)]' : 'border-white/20 bg-white/5 text-white/50'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                    {isMobileNavOpen ? <path d="M18 15l-6-6-6 6"/> : <path d="M6 9l6 6 6-6"/>}
                  </svg>
                </button>
              </div>
            </div>

            <div className={`grid transition-all duration-500 ease-in-out lg:grid-rows-[1fr] lg:opacity-100 ${isMobileNavOpen ? 'grid-rows-[1fr] opacity-100 border-t border-cyan-500/20' : 'grid-rows-[0fr] opacity-0 lg:border-t lg:border-cyan-500/20'}`}>
              <div className="overflow-hidden">
                <div className="p-4 sm:p-6 pt-2 lg:pt-6">
                  <nav className="flex flex-col gap-2">
                    {adminLinks.map((link) => {
                      const isActive = pathname === link.href;

                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileNavOpen(false)}
                          className={`flex items-center justify-between px-4 py-3 text-xs sm:text-sm font-mono tracking-widest uppercase transition-all duration-300 border-l-2 ${
                            isActive
                              ? "border-cyan-400 bg-cyan-950/40 text-cyan-400 shadow-[inset_4px_0_10px_rgba(0,243,255,0.1)] cockpit-text-glow"
                              : "border-transparent text-white/40 hover:text-cyan-200 hover:bg-white/5 hover:border-cyan-400/30"
                          }`}
                        >
                          <span>{link.label}</span>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-[10px] opacity-70">[{isActive ? "ON" : "OFF"}]</span>
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-blink shadow-[0_0_8px_var(--cockpit-cyan)]"></div>}
                          </div>
                        </Link>
                      );
                    })}
                  </nav>

                  <button type="button" onClick={handleLogout} className="mt-8 w-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs uppercase tracking-[0.2em] py-3 transition-colors flex items-center justify-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 group-hover:shadow-[0_0_8px_var(--cockpit-red)]"></div>
                    System Disconnect
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="cockpit-panel p-4 sm:p-6">
              <div className="radar-scan hidden md:block opacity-[0.15]"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-400 animate-blink shadow-[0_0_10px_var(--cockpit-amber)]"></div>
                    <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Control Panel / Main</p>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white cockpit-digital-font tracking-wide">COMMAND CENTER</h2>
                  <p className="mt-1 sm:mt-2 text-[10px] sm:text-[11px] font-mono text-white/50 max-w-xl leading-relaxed uppercase">
                    System active. Secure client-side protection enabled. Waiting for backend auth uplink.
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-end border-l border-white/10 pl-6">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 font-mono">Uplink Status</span>
                  <span className="text-green-400 font-mono text-sm shadow-[0_0_10px_rgba(0,255,100,0.3)] bg-green-400/10 px-3 py-1 border border-green-400/20 rounded-sm">SECURE</span>
                </div>
              </div>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
