import Link from "next/link";

const navItems = [
  { href: "/", label: "الرئيسية" },
  { href: "/#drop", label: "المنتجات" },
];

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
        {/* Left: Action */}
        <Link 
          href="/#drop" 
          className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-white/10"
        >
          <span className="relative z-10">Shop Drop</span>
          <div className="h-1 w-1 rounded-full bg-accent group-hover:animate-ping" />
        </Link>

        {/* Center: Nav */}
        <nav className="hidden items-center gap-10 text-[11px] font-black uppercase tracking-[0.25em] text-white/30 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition-all hover:text-accent hover:tracking-[0.35em]">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: Brand */}
        <Link href="/" className="headline text-2xl tracking-[0.15em] hover:text-accent transition-colors">
          DealSpot
        </Link>
      </div>
    </header>
  );
}
