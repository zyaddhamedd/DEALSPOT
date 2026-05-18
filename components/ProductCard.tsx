import Link from "next/link";
import { ProductMedia } from "@/components/ProductMedia";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group panel overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-white/20">
      <div className="relative aspect-[4/4.4] overflow-hidden bg-gradient-to-br from-white/10 to-white/0">
        <ProductMedia
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/35 to-transparent p-5">
          <p className="text-xs uppercase tracking-[0.32em] text-white/65">{product.shortTag}</p>
          <h3 className="mt-2 headline text-2xl text-white">{product.name}</h3>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-7 text-white/72">{product.description}</p>

        <div className="flex items-end justify-between gap-4">
          <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
            <p className="text-xs text-white/45 line-through">
              {formatPrice(product.price)}
              <span style={{ fontFamily: "'Cairo', sans-serif", marginRight: 4 }}> ج.م</span>
            </p>
            <p className="text-xl font-semibold text-white">
              {formatPrice(product.salePrice)}
              <span style={{ fontFamily: "'Cairo', sans-serif", marginRight: 4 }}> ج.م</span>
            </p>
          </div>

          <Link href={`/products/${product.slug}`} className="btn-secondary">
            اطلب الآن
          </Link>
        </div>
      </div>
    </article>
  );
}
