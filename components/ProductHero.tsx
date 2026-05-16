"use client";

import { ProductMedia } from "@/components/ProductMedia";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductHeroProps = {
  product: Product;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  onOrderClick: () => void;
};

export function ProductHero({
  product,
  selectedSize,
  setSelectedSize,
  onOrderClick,
}: ProductHeroProps) {
  return (
    <section className="section-space pt-10 sm:pt-14">
      <div className="container-shell">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent shadow-glow">
            <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/72">
              Limited Drop
            </div>
            <div className="relative aspect-[4/4.2]">
              <ProductMedia
                src={product.images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 56vw"
              />
            </div>
          </div>

          <div className="space-y-6">
            <span className="eyebrow">DealSpot Exclusive</span>
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-white/55">{product.shortTag}</p>
              <h1 className="headline mt-3 text-4xl leading-none text-white sm:text-5xl lg:text-6xl">
                {product.name}
              </h1>
            </div>

            <p className="max-w-xl text-base leading-8 text-white/72 sm:text-lg">{product.description}</p>

            <div className="flex items-end gap-4">
              <div>
                <p className="text-sm text-white/40 line-through">{formatPrice(product.price)} ج.م</p>
                <p className="text-3xl font-semibold text-white">{formatPrice(product.salePrice)} ج.م</p>
              </div>
              <p className="max-w-xs text-sm leading-6 text-white/62">{product.accent}</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold text-white">اختار المقاس</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;

                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-14 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                        active
                          ? "border-accent bg-accent text-white"
                          : "border-white/12 bg-white/5 text-white/72 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={onOrderClick} className="btn-primary">
                اطلب دلوقتي
              </button>
              <div className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white/72">
                تأكيد سريع + دفع عند الاستلام
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
