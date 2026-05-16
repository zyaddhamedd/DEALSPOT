import { AdminRouteShell } from "@/components/AdminRouteShell";

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminRouteShell>{children}</AdminRouteShell>;
}
