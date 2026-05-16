import { notFound } from "next/navigation";
import { ProductLandingClient } from "@/components/ProductLandingClient";
import { getProductBySlug } from "@/src/lib/server/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    // fallback to original slug
  }
  
  // 1. Try to fetch from DB for Server Side Rendering (SSR)
  const product = await getProductBySlug(decodedSlug);

  if (!product) {
    return notFound();
  }

  // Return the client component with fresh DB data
  return <ProductLandingClient product={product} />;
}
