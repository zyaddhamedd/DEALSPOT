"use client";

import { usePathname } from "next/navigation";
import { AdminGuard } from "@/components/AdminGuard";
import { AdminLayout } from "@/components/AdminLayout";

type AdminRouteShellProps = {
  children: React.ReactNode;
};

export function AdminRouteShell({ children }: AdminRouteShellProps) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/admin/login";

  if (isLoginRoute) {
    return <AdminGuard mode="guest-only">{children}</AdminGuard>;
  }

  return (
    <AdminGuard mode="protected">
      <AdminLayout>{children}</AdminLayout>
    </AdminGuard>
  );
}
