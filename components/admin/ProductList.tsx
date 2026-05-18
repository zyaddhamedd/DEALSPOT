import { ProductMedia } from "@/components/ProductMedia";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

type ProductListProps = {
  products: Product[];
  selectedProductId: string;
  onSelect: (productId: string) => void;
  onDelete: (productId: string) => void;
  onAdd: () => void;
};

export function ProductList({ products, selectedProductId, onSelect, onDelete, onAdd }: ProductListProps) {
  return (
    <section className="panel rounded-[2rem] p-4 sm:p-5">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow">Inventory</p>
          <h2 className="headline mt-4 text-2xl text-white">Products</h2>
          <p className="mt-2 text-sm text-white/58">({products.length}) products in store.</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="btn-primary gap-2 text-xs"
          style={{ padding: "8px 16px" }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product) => {
          const selected = product.id === selectedProductId;
          const heroImage = product.images[0];

          return (
            <div key={product.id} className="group relative">
              <button
                type="button"
                onClick={() => onSelect(product.id)}
                className={`flex w-full items-center gap-3 sm:gap-4 rounded-[1.5rem] border p-3 text-left transition ${
                  selected
                    ? "border-[#e11d2f] bg-[#e11d2f]/10 shadow-[0_0_20px_rgba(225,29,47,0.2)]"
                    : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl sm:rounded-[1.1rem] border border-white/10 bg-black/40">
                  {heroImage ? (
                    <ProductMedia
                      src={heroImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 56px, 64px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] sm:text-[11px] text-white/40">No image</div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <p className="truncate text-sm font-bold text-white sm:text-base">{product.name}</p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider ${
                        product.active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/40"
                      }`}
                    >
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="mt-0.5 sm:mt-1 truncate text-[11px] sm:text-xs text-white/40">{product.slug}</p>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-bold text-white">{formatPrice(product.salePrice)} ج.م</p>
                </div>

                <span className={`hidden sm:inline-block rounded-full border px-3 py-2 text-[11px] font-bold uppercase tracking-tight transition ${
                  selected ? "border-accent bg-accent text-white" : "border-white/10 bg-white/5 text-white/60"
                }`}>
                  {selected ? "Editing" : "Edit"}
                </span>
                
                {/* Mobile selected indicator */}
                <span className={`sm:hidden flex items-center justify-center w-6 h-6 rounded-full border transition ${
                  selected ? "border-accent bg-accent text-white" : "border-white/10 bg-white/5 text-white/60"
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    {selected ? <path d="M20 6L9 17l-5-5"/> : <path d="M9 18l6-6-6-6"/>}
                  </svg>
                </span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="absolute -left-2 -top-2 hidden h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700 hover:scale-110 group-hover:flex"
                title="حذف المنتج"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
