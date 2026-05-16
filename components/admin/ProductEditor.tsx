"use client";

import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { SizeManager } from "@/components/admin/SizeManager";
import { ColorManager } from "@/components/admin/ColorManager";
import { Product } from "@/lib/types";

type ProductEditorProps = {
  product: Product | undefined;
  hasUnsavedChanges: boolean;
  storageWarning?: string;
  onChange: <Key extends keyof Product>(key: Key, value: Product[Key]) => void;
  onImagesChange: (images: string[]) => void;
  onSave: () => void;
  onResetCurrent: () => void;
  onResetAll: () => void;
};

export function ProductEditor({
  product,
  hasUnsavedChanges,
  storageWarning,
  onChange,
  onImagesChange,
  onSave,
  onResetCurrent,
  onResetAll,
}: ProductEditorProps) {
  if (!product) {
    return (
      <section className="panel flex min-h-[28rem] items-center justify-center rounded-[2rem] p-6 text-center text-white/55">
        Select a product to start editing.
      </section>
    );
  }

  return (
    <section className="panel rounded-[2rem] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="eyebrow">Editor</p>
          <h2 className="headline mt-4 text-3xl text-white">{product.name}</h2>
          <p className="mt-2 text-sm text-white/58">{product.slug}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={onResetCurrent} className="btn-secondary">
            Reset Current Product
          </button>
          <button type="button" onClick={onSave} className="btn-primary">
            Save Changes
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-2 text-xs font-medium ${
            hasUnsavedChanges ? "bg-amber-500/15 text-amber-200" : "bg-emerald-500/15 text-emerald-300"
          }`}
        >
          {hasUnsavedChanges ? "Unsaved changes" : "Saved state"}
        </span>
        <button type="button" onClick={onResetAll} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/62 transition hover:bg-white/10">
          Reset All Products To Default
        </button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Basic Info */}
        <div className="space-y-6 md:col-span-2">
          <h3 className="eyebrow border-b border-white/5 pb-2">Basic Information</h3>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/60">Product Name</span>
          <input
            className="field"
            value={product.name}
            onChange={(event) => onChange("name", event.target.value)}
            placeholder="e.g. WEAIR-2 Black Full"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/60">Slug (URL)</span>
          <input
            className="field"
            value={product.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            placeholder="e.g. weair-2-black-full"
          />
        </label>

        {/* Pricing */}
        <div className="mt-4 space-y-6 md:col-span-2">
          <h3 className="eyebrow border-b border-white/5 pb-2">Pricing</h3>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/60">Original Price (ج.م)</span>
          <input
            className="field"
            type="number"
            value={product.price}
            onChange={(event) => onChange("price", Number(event.target.value))}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/60">Sale Price (ج.م)</span>
          <input
            className="field"
            type="number"
            value={product.salePrice}
            onChange={(event) => onChange("salePrice", Number(event.target.value))}
          />
        </label>

        {/* Description */}
        <div className="mt-4 space-y-6 md:col-span-2">
          <h3 className="eyebrow border-b border-white/5 pb-2">Details</h3>
        </div>

        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-medium text-white/60">Description</span>
          <textarea
            className="field min-h-[160px] resize-y"
            value={product.description}
            onChange={(event) => onChange("description", event.target.value)}
            placeholder="Enter product description..."
          />
        </label>

        <SizeManager
          sizes={product.sizes}
          onChange={(newSizes) => onChange("sizes", newSizes)}
        />

        <ColorManager
          colors={product.colors || []}
          onChange={(newColors) => onChange("colors", newColors)}
        />

        <div className="flex items-center gap-6 pt-4 md:col-span-2">
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
              checked={product.active}
              onChange={(event) => onChange("active", event.target.checked)}
            />
            <span className="text-sm font-semibold">Active for Sale</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:bg-white/10">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-white/20 bg-white/5 text-accent focus:ring-accent"
              checked={product.featured ?? false}
              onChange={(event) => onChange("featured", event.target.checked)}
            />
            <span className="text-sm font-semibold">Feature on Home</span>
          </label>
        </div>
      </div>

      <div className="mt-6">
        <ProductImageManager
          product={product}
          onImagesChange={onImagesChange}
          storageWarning={storageWarning}
        />
      </div>
    </section>
  );
}
