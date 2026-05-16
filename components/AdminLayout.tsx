"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { clearAdminSession } from "@/lib/adminAuth";

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

  const handleLogout = () => {
    clearAdminSession();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="admin-dark min-h-screen bg-[#080808] text-white">
      <div className="container-shell py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[17.5rem_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl lg:sticky lg:top-6 lg:h-fit">
            <div className="border-b border-white/10 pb-5">
              <p className="headline text-2xl text-white">DealSpot</p>
              <h1 className="headline mt-4 text-3xl text-white">Admin</h1>
              <p className="mt-3 text-sm text-white/58">Protected internal dashboard for orders and product control.</p>
            </div>

            <nav className="mt-5 space-y-3">
              {adminLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                      isActive
                        ? "border-accent bg-accent text-white"
                        : "border-white/10 bg-white/5 text-white/68 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <span className="text-xs uppercase tracking-[0.24em]">Open</span>
                  </Link>
                );
              })}
            </nav>

            <button type="button" onClick={handleLogout} className="btn-secondary mt-5 w-full">
              Logout
            </button>
          </aside>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-6">
              <p className="eyebrow">Control Panel</p>
              <h2 className="headline mt-4 text-3xl text-white">DealSpot Admin</h2>
              <p className="mt-3 text-sm text-white/60">
                واجهة إدارة MVP. الحماية الحالية client-side فقط لحد إضافة backend auth حقيقي.
              </p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
