import { db } from "@/src/db";
import { products, productImages, productVariants, categories } from "@/src/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { Product, ProductReview, ProductFaq } from "@/lib/types";

export async function getActiveProducts(): Promise<Product[]> {
  const dbProducts = await db.query.products.findMany({
    where: eq(products.active, true),
    with: {
      images: {
        orderBy: [asc(productImages.order)],
      },
      variants: true,
    },
  });

  return dbProducts.map(mapDbProductToFrontendProduct);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const dbProducts = await db.query.products.findMany({
    where: and(eq(products.active, true), eq(products.featured, true)),
    with: {
      images: {
        orderBy: [asc(productImages.order)],
      },
      variants: true,
    },
  });

  return dbProducts.map(mapDbProductToFrontendProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const dbProduct = await db.query.products.findFirst({
    where: eq(products.slug, slug),
    with: {
      images: {
        orderBy: [asc(productImages.order)],
      },
      variants: true,
    },
  });

  if (!dbProduct) return null;

  return mapDbProductToFrontendProduct(dbProduct);
}

function mapDbProductToFrontendProduct(dbProduct: any): Product {
  const images = dbProduct.images?.map((img: any) => img.url) || [];
  
  // Extract unique sizes and colors from variants
  const sizes = Array.from(new Set(dbProduct.variants?.map((v: any) => v.size).filter(Boolean))) as string[];
  
  const colorsMap = new Map<string, string>();
  dbProduct.variants?.forEach((v: any) => {
    if (v.colorName && v.colorHex) {
      colorsMap.set(v.colorName, v.colorHex);
    }
  });
  const colors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));

  return {
    id: dbProduct.id,
    slug: dbProduct.slug,
    name: dbProduct.name,
    description: dbProduct.description || "",
    price: Number(dbProduct.price),
    salePrice: dbProduct.salePrice ? Number(dbProduct.salePrice) : 0,
    images,
    sizes,
    colors,
    active: dbProduct.active,
    featured: dbProduct.featured,
    shortTag: dbProduct.shortTag || undefined,
    accent: dbProduct.accent || undefined,
    reviews: (dbProduct.reviews as ProductReview[]) || [],
    faq: (dbProduct.faq as ProductFaq[]) || [],
  };
}
