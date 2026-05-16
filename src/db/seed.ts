import { db } from "./index";
import { products, categories, productImages, productVariants } from "./schema";
import * as dotenv from "dotenv";

dotenv.config();

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Create a category
  const [sneakersCategory] = await db.insert(categories).values({
    name: "Sneakers",
    slug: "sneakers",
    active: true,
  }).onConflictDoNothing().returning();

  const categoryId = sneakersCategory?.id;

  // 2. Create sample products
  const sampleProducts = [
    {
      name: "WEAIR-2 Black Full Sneaker",
      slug: "weair-2-black-full",
      description: "سنيكرز عصري باللون الأسود الكامل، مريح جداً للمشي اليومي ومناسب لجميع الملابس.",
      price: "1200.00",
      salePrice: "850.00",
      active: true,
      featured: true,
      shortTag: "Best Seller",
      accent: "#111111",
      images: ["/products/AIRFORCE DARB 01.webp"],
      sizes: ["41", "42", "43", "44", "45"],
      colors: [{ name: "Black", hex: "#000000" }],
    },
    {
      name: "LOOR-9 Black/Red Sneaker",
      slug: "loor-9-black-red",
      description: "تصميم جريء يجمع بين الأسود والأحمر، مثالي للطلعات الكاجوال.",
      price: "1100.00",
      salePrice: "790.00",
      active: true,
      featured: true,
      shortTag: "New Drop",
      accent: "#e11d2f",
      images: ["/products/AIRFORCE02.webp"],
      sizes: ["40", "41", "42", "43"],
      colors: [{ name: "Black/Red", hex: "#000000" }],
    },
  ];

  for (const p of sampleProducts) {
    const [insertedProduct] = await db.insert(products).values({
      categoryId,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      salePrice: p.salePrice,
      active: p.active,
      featured: p.featured,
      shortTag: p.shortTag,
      accent: p.accent,
      reviews: [],
      faq: [
        { question: "هل الخامة جيدة؟", answer: "نعم، نستخدم أفضل الخامات لضمان الراحة والمتانة." },
        { question: "كم يستغرق التوصيل؟", answer: "من 2 لـ 5 أيام عمل بحد أقصى." }
      ],
    }).onConflictDoUpdate({
      target: products.slug,
      set: {
        name: p.name,
        price: p.price,
        salePrice: p.salePrice,
      }
    }).returning();

    // Insert images
    await db.insert(productImages).values(
      p.images.map((url, index) => ({
        productId: insertedProduct.id,
        url,
        order: index,
        isHero: index === 0,
      }))
    ).onConflictDoNothing();

    // Insert variants
    const variants = [];
    for (const size of p.sizes) {
      for (const color of p.colors) {
        variants.push({
          productId: insertedProduct.id,
          size,
          colorName: color.name,
          colorHex: color.hex,
          stock: 10,
        });
      }
    }
    await db.insert(productVariants).values(variants).onConflictDoNothing();
  }

  console.log("✅ Seeding completed!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed!");
  console.error(err);
  process.exit(1);
});
