import { db } from "@/src/db";
import { products, productImages, productVariants } from "@/src/db/schema";
import { eq, sql } from "drizzle-orm";
import { Product, ProductReview, ProductFaq } from "@/lib/types";

export async function getAllAdminProducts() {
  const dbProducts = await db.query.products.findMany({
    with: {
      images: {
        orderBy: (images, { asc }) => [asc(images.order)],
      },
      variants: true,
    },
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return dbProducts.map(mapDbProductToFrontendProduct);
}

export async function createAdminProduct(data: Partial<Product>) {
  if (!data.name || !data.slug) {
    throw new Error("Name and Slug are required");
  }

  return await db.transaction(async (tx) => {
    // 1. Insert product
    const [insertedProduct] = await tx.insert(products).values({
      name: data.name!,
      slug: data.slug!,
      description: data.description || "",
      price: (data.price || 0).toString(),
      salePrice: data.salePrice ? data.salePrice.toString() : null,
      active: data.active ?? true,
      featured: data.featured ?? false,
      shortTag: data.shortTag || null,
      accent: data.accent || null,
      reviews: data.reviews || [],
      faq: data.faq || [],
    }).returning();

    // 2. Insert images
    if (data.images && data.images.length > 0) {
      await tx.insert(productImages).values(
        data.images.map((url, index) => ({
          productId: insertedProduct.id,
          url,
          order: index,
          isHero: index === 0,
        }))
      );
    }

    // 3. Insert variants (based on current sizes/colors model)
    if (data.sizes && data.sizes.length > 0) {
      const variants = [];
      const colors = data.colors && data.colors.length > 0 ? data.colors : [{ name: null, hex: null }];
      
      for (const size of data.sizes) {
        for (const color of colors) {
          variants.push({
            productId: insertedProduct.id,
            size: size,
            colorName: color.name,
            colorHex: color.hex,
            stock: 10, // Default stock
          });
        }
      }
      
      if (variants.length > 0) {
        await tx.insert(productVariants).values(variants);
      }
    }

    return insertedProduct;
  });
}

export async function updateAdminProduct(id: string, data: Partial<Product>) {
  return await db.transaction(async (tx) => {
    // 1. Update product
    await tx.update(products).set({
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price ? data.price.toString() : undefined,
      salePrice: data.salePrice !== undefined ? (data.salePrice ? data.salePrice.toString() : null) : undefined,
      active: data.active,
      featured: data.featured,
      shortTag: data.shortTag,
      accent: data.accent,
      reviews: data.reviews,
      faq: data.faq,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    // 2. Refresh images (delete and re-insert for simplicity in this phase)
    if (data.images !== undefined) {
      await tx.delete(productImages).where(eq(productImages.productId, id));
      if (data.images.length > 0) {
        await tx.insert(productImages).values(
          data.images.map((url, index) => ({
            productId: id,
            url,
            order: index,
            isHero: index === 0,
          }))
        );
      }
    }

    // 3. Refresh variants
    if (data.sizes !== undefined || data.colors !== undefined) {
      // Need current values if one is missing
      const existingProduct = await tx.query.products.findFirst({
        where: eq(products.id, id),
        with: { variants: true }
      });
      
      const sizes = data.sizes || Array.from(new Set(existingProduct?.variants?.map(v => v.size).filter(Boolean))) as string[];
      const colors = data.colors || Array.from(new Map(existingProduct?.variants?.map(v => [v.colorName, v.colorHex])).entries()).map(([name, hex]) => ({ name, hex }));
      
      await tx.delete(productVariants).where(eq(productVariants.productId, id));
      
      const variants = [];
      const colorsToInsert = colors.length > 0 ? colors : [{ name: null, hex: null }];
      
      for (const size of sizes) {
        for (const color of colorsToInsert) {
          variants.push({
            productId: id,
            size: size,
            colorName: color.name,
            colorHex: color.hex,
            stock: 10,
          });
        }
      }
      
      if (variants.length > 0) {
        await tx.insert(productVariants).values(variants);
      }
    }

    return { success: true };
  });
}

export async function deleteAdminProduct(id: string) {
  // Cascading deletes handled by DB foreign keys
  await db.delete(products).where(eq(products.id, id));
  return { success: true };
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
  const colors = Array.from(colorsMap.entries()).map(([name, hex]) => ({ name: name!, hex: hex! }));

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
