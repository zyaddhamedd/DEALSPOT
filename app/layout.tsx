import type { Metadata } from "next";
import "./globals.css";
import FacebookPixel from "@/components/analytics/FacebookPixel";
import VisitorTracker from "@/components/analytics/VisitorTracker";

export const metadata: Metadata = {
  title: "DealSpot — اطلب دلوقتي والدفع عند الاستلام",
  description:
    "اطلب منتجاتك بأفضل الأسعار والدفع عند الاستلام. شحن سريع لجميع محافظات مصر.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <FacebookPixel />
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
