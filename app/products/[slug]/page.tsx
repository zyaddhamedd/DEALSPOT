import { notFound } from "next/navigation";
import { ProductLandingClient } from "@/components/ProductLandingClient";
import { defaultProducts } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return defaultProducts.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  let decodedSlug = slug;
  try {
    decodedSlug = decodeURIComponent(slug);
  } catch (e) {
    console.error("Failed to decode slug:", slug);
  }
  
  // Find in default list for initial SSR/SEO
  const defaultProduct = defaultProducts.find((item) => item.slug === slug || item.slug === decodedSlug);

  // If not in default list, we still render the client component.
  // The client component will look in localStorage using the slug.
  const product = defaultProduct || {
    id: "custom-" + decodedSlug,
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
  };

  return <ProductLandingClient product={product} />;
}
