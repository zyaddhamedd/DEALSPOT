import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="container-shell flex flex-col gap-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="headline text-base text-white">DealSpot</p>
          <p>Curated streetwear-inspired sneaker drops.</p>
        </div>

        <div className="flex items-center gap-5">
          <Link href="/" className="hover:text-white">
            الرئيسية
          </Link>
          <Link href="/#drop" className="hover:text-white">
            المنتجات
          </Link>
        </div>
      </div>
    </footer>
  );
}
