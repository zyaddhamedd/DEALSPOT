"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAdminAuthenticated, sanitizeAdminNextPath } from "@/lib/adminAuth";

type AdminGuardProps = {
  children: React.ReactNode;
  mode: "protected" | "guest-only";
};

function GuardLoader() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-shell flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center shadow-glow backdrop-blur-xl">
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full border border-accent/40 bg-accent/15" />
          <p className="headline mt-6 text-2xl text-white">DealSpot</p>
          <p className="mt-3 text-sm text-white/60">Checking secure admin session...</p>
        </div>
      </div>
    </div>
  );
}

export function AdminGuard({ children, mode }: AdminGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const syncAccess = () => {
      const loggedIn = isAdminAuthenticated();

      if (mode === "protected") {
        if (!loggedIn) {
          const next = sanitizeAdminNextPath(pathname);
          router.replace(`/admin/login?next=${encodeURIComponent(next)}`);
          return;
        }

        setIsAllowed(true);
        return;
      }

      if (loggedIn) {
        router.replace("/admin");
        return;
      }

      setIsAllowed(true);
    };

    syncAccess();
    window.addEventListener("storage", syncAccess);

    return () => {
      window.removeEventListener("storage", syncAccess);
    };
  }, [mode, pathname, router]);

  if (!isAllowed) {
    return <GuardLoader />;
  }

  return <>{children}</>;
}
