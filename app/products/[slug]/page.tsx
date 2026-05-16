import { notFound } from "next/navigation";
import { ProductLandingClient } from "@/components/ProductLandingClient";
import { defaultProducts } from "@/lib/products";

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
  
  // Find in default list for initial SEO
  const defaultProduct = defaultProducts.find((item) => item.slug === slug || item.slug === decodedSlug);

  // Return the client component. 
  // It will handle the rest of the hydration from localStorage.
  return <ProductLandingClient product={defaultProduct || {
    id: "loading-" + slug.length,
    slug: decodedSlug,
    name: "...Loading",
    description: "",
    price: 0,
    salePrice: 0,
    images: [],
    sizes: [],
    active: true,
    reviews: [],
    faq: []
  }} />;
}
