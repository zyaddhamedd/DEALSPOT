import { defaultProducts as defaultProductSeed, placeholderImageGuide } from "@/lib/data/products";
import { normalizeStringArray, resolveProductImages } from "@/lib/productImages";
import { Product } from "@/lib/types";

type StoredProduct = Partial<Product> & {
  image?: string;
};

const cloneReviews = (product: Product) => [...(product.reviews ?? [])];
const cloneFaq = (product: Product) => [...(product.faq ?? [])];

export const cloneProduct = (product: Product): Product => ({
  ...product,
  featured: product.featured ?? false,
  shortTag: product.shortTag ?? "",
  accent: product.accent ?? "",
  images: [...product.images],
  sizes: [...product.sizes],
  colors: product.colors ? [...product.colors] : [],
  reviews: cloneReviews(product),
  faq: cloneFaq(product),
});

export const cloneProducts = (products: Product[]) => products.map(cloneProduct);

export const defaultProducts = cloneProducts(defaultProductSeed);

export const normalizeProduct = (product: StoredProduct, fallback: Product): Product => ({
  ...cloneProduct(fallback),
  ...product,
  id: typeof product.id === "string" && product.id.trim() ? product.id : fallback.id,
  slug: typeof product.slug === "string" && product.slug.trim() ? product.slug : fallback.slug,
  name: typeof product.name === "string" && product.name.trim() ? product.name : fallback.name,
  price: typeof product.price === "number" ? product.price : fallback.price,
  salePrice: typeof product.salePrice === "number" ? product.salePrice : fallback.salePrice,
  description:
    typeof product.description === "string" && product.description.trim()
      ? product.description
      : fallback.description,
  images: resolveProductImages(product.images ?? product.image, fallback.images),
  sizes: normalizeStringArray(product.sizes).length > 0 ? normalizeStringArray(product.sizes) : [...fallback.sizes],
  colors: Array.isArray(product.colors) ? product.colors : [...(fallback.colors ?? [])],
  active: typeof product.active === "boolean" ? product.active : fallback.active,
  featured: typeof product.featured === "boolean" ? product.featured : fallback.featured ?? false,
  shortTag:
    typeof product.shortTag === "string" && product.shortTag.trim() ? product.shortTag : fallback.shortTag ?? "",
  accent: typeof product.accent === "string" && product.accent.trim() ? product.accent : fallback.accent ?? "",
  reviews: Array.isArray(product.reviews) ? product.reviews : cloneReviews(fallback),
  faq: Array.isArray(product.faq) ? product.faq : cloneFaq(fallback),
});

export const resolveProductFallback = (product: Partial<Product>, index = 0): Product => {
  const found = defaultProducts.find((item) => item.id === product.id || item.slug === product.slug);
  if (found) return found;
  
  const fallbackFromList = defaultProducts[index] ?? defaultProducts[0];
  if (fallbackFromList) return fallbackFromList;

  // Ultimate fallback if defaultProducts is empty
  return {
    id: product.id || "temp-id",
    slug: product.slug || "temp-slug",
    name: product.name || "New Product",
    description: "",
    price: 0,
    salePrice: 0,
    images: [],
    sizes: [],
    active: false,
    featured: false,
    reviews: [],
    faq: []
  };
};

export { placeholderImageGuide };
