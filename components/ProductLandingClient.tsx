"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductNavbar } from "@/components/product/ProductNavbar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfoCard } from "@/components/product/ProductInfoCard";
import { SizeSelector } from "@/components/product/SizeSelector";
import { ColorSelector } from "@/components/product/ColorSelector";
import { BenefitCards } from "@/components/product/BenefitCards";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductFAQ } from "@/components/product/ProductFAQ";
import { StickyOrderCTA } from "@/components/product/StickyOrderCTA";
import { CountdownTimer } from "@/components/product/CountdownTimer";
import { OrderForm } from "@/components/OrderForm";
import { loadProducts } from "@/lib/productStorage";
import { Product } from "@/lib/types";
import { trackMetaEvent } from "@/components/analytics/trackMetaEvent";

type ProductLandingClientProps = {
  product: Product;
};

export function ProductLandingClient({ product }: ProductLandingClientProps) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "");
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);
  const orderRef = useRef<HTMLDivElement | null>(null);
  const sizeRef = useRef<HTMLDivElement | null>(null);
  const colorRef = useRef<HTMLDivElement | null>(null);

  const hasTrackedView = useRef(false);
  const hasTrackedCheckout = useRef(false);

  useEffect(() => {
    if (!hasTrackedView.current) {
      trackMetaEvent("ViewContent", {
        content_name: product.name,
        content_ids: [product.id],
        content_type: "product",
        value: product.salePrice,
        currency: "EGP",
      });
      hasTrackedView.current = true;
    }
  }, [product]);

  // Sync with Database or localStorage product data
  useEffect(() => {
    const syncData = async () => {
      const decodedSlug = decodeURIComponent(product.slug);
      
      try {
        const res = await fetch(`/api/products/${product.slug}`);
        if (res.ok) {
          const dbProduct = await res.json();
          setCurrentProduct(dbProduct);
          if (dbProduct.sizes.length > 0) setSelectedSize(dbProduct.sizes[0]);
          if (dbProduct.colors && dbProduct.colors.length > 0) {
            setSelectedColor(dbProduct.colors[0].name);
          }
          return;
        }
      } catch (err) {
        console.error("Failed to fetch product from DB:", err);
      }

      // Fallback to localStorage if DB fetch fails or product not found
      const storageProducts = loadProducts();
      const storageProduct = storageProducts.find(
        (item) => item.slug === decodedSlug || item.slug === product.slug,
      );
      
      if (storageProduct) {
        setCurrentProduct(storageProduct);
        if (storageProduct.sizes.length > 0) setSelectedSize(storageProduct.sizes[0]);
        if (storageProduct.colors && storageProduct.colors.length > 0) {
          setSelectedColor(storageProduct.colors[0].name);
        }
      }
    };

    void syncData();
  }, [product.slug]);

  const imageGallery = useMemo(() => {
    const currentImages = currentProduct.images.length > 0 ? currentProduct.images : product.images;
    return currentImages.length > 0 ? currentImages : ["/placeholder-product.png"];
  }, [currentProduct.images, product.images]);

  const scrollToOrder = () => {
    if (!hasTrackedCheckout.current) {
      trackMetaEvent("InitiateCheckout", {
        content_name: currentProduct.name,
        content_ids: [currentProduct.id],
        value: currentProduct.salePrice,
        currency: "EGP",
      });
      hasTrackedCheckout.current = true;
    }

    if (currentProduct.colors && currentProduct.colors.length > 0 && !selectedColor) {
      setColorError(true);
      colorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setColorError(false), 2500);
      return;
    }
    if (!selectedSize) {
      // Highlight size section first
      setSizeError(true);
      sizeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => setSizeError(false), 2500);
      return;
    }
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToOrderDirect = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="product-page-wrap">
      {/* Fixed Navbar */}
      <ProductNavbar onOrderClick={scrollToOrder} />

      {/* Urgency bar — under navbar */}
      <div
        className="urgency-bar"
        style={{
          position: "sticky",
          top: 64,
          zIndex: 40,
        }}
      >
        <span>🔥 عرض محدود — الدفع عند الاستلام</span>
        <CountdownTimer productSlug={currentProduct.slug} variant="bar" />
      </div>

      {/* Main content */}
      <main
        style={{
          paddingTop: 0, // urgency bar handles spacing
          paddingBottom: 120, // leave room for sticky CTA on mobile
          maxWidth: "100vw",
          overflowX: "hidden",
        }}
      >
        {/* Product shell — centered, max 480px */}
        <div className="product-shell" style={{ paddingTop: 20 }}>
          {/* 1. Gallery */}
          <section style={{ marginBottom: 20 }}>
            <ProductGallery
              productName={currentProduct.name}
              images={imageGallery}
            />
          </section>

          {/* 2. Info card + countdown + trust chips */}
          <section style={{ marginBottom: 16 }}>
            <ProductInfoCard
              name={currentProduct.name}
              description={currentProduct.description}
              price={currentProduct.price}
              salePrice={currentProduct.salePrice}
              productSlug={currentProduct.slug}
            />
          </section>

          {/* 3. Color selector */}
          <section ref={colorRef} style={{ marginBottom: 16 }}>
            <ColorSelector
              colors={currentProduct.colors || []}
              selectedColor={selectedColor}
              onChange={(color) => {
                setSelectedColor(color);
                setColorError(false);
              }}
            />
          </section>

          {/* 4. Size selector */}
          <section ref={sizeRef} style={{ marginBottom: 16 }}>
            <SizeSelector
              sizes={currentProduct.sizes}
              selectedSize={selectedSize}
              onChange={(size) => {
                setSelectedSize(size);
                setSizeError(false);
              }}
              hasError={sizeError}
            />
          </section>

          {/* 4. Primary CTA — desktop/large visible here */}
          <section style={{ marginBottom: 28 }}>
            <button
              type="button"
              onClick={scrollToOrder}
              className="btn-red"
              style={{ width: "100%", padding: "18px", fontSize: 16 }}
            >
              اطلب دلوقتي — الدفع عند الاستلام 🔥
            </button>
          </section>

          {/* divider */}
          <div className="section-divider" style={{ margin: "8px 0 24px" }} />

          {/* 5. Benefits */}
          <section style={{ marginBottom: 28 }}>
            <BenefitCards />
          </section>

          <div className="section-divider" style={{ margin: "8px 0 24px" }} />

          {/* 6. Reviews */}
          <section style={{ marginBottom: 28 }}>
            <ProductReviews reviews={currentProduct.reviews} />
          </section>

          <div className="section-divider" style={{ margin: "8px 0 24px" }} />

          {/* 7. FAQ */}
          <section style={{ marginBottom: 28 }}>
            <ProductFAQ items={currentProduct.faq} />
          </section>

          <div className="section-divider" style={{ margin: "8px 0 24px" }} />

          {/* 8. Order form */}
          <section ref={orderRef} style={{ marginBottom: 48 }}>
            <OrderForm
              product={currentProduct}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onSuccess={scrollToOrderDirect}
            />
          </section>

          {/* Footer */}
          <footer
            style={{
              textAlign: "center",
              paddingBottom: 32,
            }}
          >
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 20,
                fontWeight: 900,
                color: "#111",
                marginBottom: 8,
              }}
            >
              Deal<span style={{ color: "#e11d2f" }}>Spot</span>
            </p>
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              © 2026 DealSpot — كل الحقوق محفوظة
            </p>
            <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 16 }}>
              {["دفع عند الاستلام", "تواصل سريع", "توصيل لكل المحافظات"].map((item) => (
                <span
                  key={item}
                  style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 11,
                    color: "#9ca3af",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </footer>
        </div>
      </main>

      {/* Sticky bottom CTA — mobile only */}
      <StickyOrderCTA price={currentProduct.salePrice} onClick={scrollToOrder} />
    </div>
  );
}
