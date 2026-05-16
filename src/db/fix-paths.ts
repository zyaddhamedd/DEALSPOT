import { db } from "./index";
import { productImages } from "./schema";
import { notLike } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config();

async function fixPaths() {
  console.log("🛠️ Fixing local image paths...");

  const images = await db.select().from(productImages);
  
  for (const img of images) {
    if (!img.url.startsWith("http") && !img.url.startsWith("/")) {
      const newUrl = `/products/${img.url}`;
      console.log(`Updating ${img.url} -> ${newUrl}`);
      await db.update(productImages)
        .set({ url: newUrl })
        .where(eq(productImages.id, img.id));
    }
  }

  console.log("✅ Paths fixed!");
}

import { eq } from "drizzle-orm";

fixPaths().catch(console.error);
