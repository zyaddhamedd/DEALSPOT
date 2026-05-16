"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductMedia } from "@/components/ProductMedia";

type ProductGalleryProps = {
  productName: string;
  images: string[];
};

export function ProductGallery({ productName, images }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  const galleryImages = useMemo(() => (images.length > 0 ? images : [""]), [images]);

  useEffect(() => {
    setActiveIndex(0);
  }, [galleryImages]);

  useEffect(() => {
    const container = containerRef.current;
    const items = itemRefs.current.filter((item): item is HTMLElement => Boolean(item));
    if (!container || items.length === 0) return;

    const updateActiveIndex = () => {
      const containerLeft = container.getBoundingClientRect().left;
      const containerWidth = container.offsetWidth;
      const center = containerLeft + containerWidth / 2;

      const nextIndex = items.reduce((closestIndex, item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.left + itemRect.width / 2;
        const distance = Math.abs(itemCenter - center);
        const currentRect = items[closestIndex].getBoundingClientRect();
        const currentCenter = currentRect.left + currentRect.width / 2;
        const currentDistance = Math.abs(currentCenter - center);
        return distance < currentDistance ? index : closestIndex;
      }, 0);

      setActiveIndex(nextIndex);
    };

    updateActiveIndex();
    container.addEventListener("scroll", updateActiveIndex, { passive: true });
    window.addEventListener("resize", updateActiveIndex);
    return () => {
      container.removeEventListener("scroll", updateActiveIndex);
      window.removeEventListener("resize", updateActiveIndex);
    };
  }, [galleryImages]);

  const scrollToIndex = (index: number) => {
    itemRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Main carousel */}
      <div
        style={{
          position: "relative",
          width: "100%",
          background: "white",
          borderRadius: 28,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
          border: "1px solid #e5e7eb",
        }}
      >
        <div
          ref={containerRef}
          className="scrollbar-hide"
          style={{
            display: "flex",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
          }}
        >
          {galleryImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              ref={(node) => { itemRefs.current[index] = node; }}
              style={{
                minWidth: "100%",
                scrollSnapAlign: "center",
                aspectRatio: "1/1",
                position: "relative",
                background: "#faf7f2",
                flexShrink: 0,
              }}
            >
              <ProductMedia
                src={image}
                alt={`${productName} ${index + 1}`}
                fill
                priority={index === 0}
                className="object-contain"
                sizes="(max-width: 640px) 100vw, 480px"
              />
            </div>
          ))}
        </div>

        {/* Slide counter top-left */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(0,0,0,0.40)",
            backdropFilter: "blur(8px)",
            borderRadius: 100,
            padding: "4px 12px",
            fontFamily: "'Cairo', sans-serif",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
          }}
        >
          {activeIndex + 1} / {galleryImages.length}
        </div>
      </div>

      {/* Dots */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "4px 0",
        }}
      >
        {galleryImages.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToIndex(index)}
            aria-label={`الصورة ${index + 1}`}
            style={{
              height: 6,
              width: index === activeIndex ? 28 : 6,
              borderRadius: 100,
              background: index === activeIndex ? "#e11d2f" : "#d1d5db",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.35s ease",
            }}
          />
        ))}
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {galleryImages.length > 1 && (
        <div
          className="scrollbar-hide"
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          {galleryImages.map((image, index) => (
            <button
              key={`thumb-${index}`}
              type="button"
              onClick={() => scrollToIndex(index)}
              aria-label={`عرض الصورة ${index + 1}`}
              style={{
                minWidth: 64,
                width: 64,
                height: 64,
                borderRadius: 12,
                overflow: "hidden",
                position: "relative",
                background: "#faf7f2",
                border: index === activeIndex ? "2.5px solid #e11d2f" : "2px solid #e5e7eb",
                cursor: "pointer",
                transition: "all 0.25s ease",
                flexShrink: 0,
                opacity: index === activeIndex ? 1 : 0.55,
                boxShadow: index === activeIndex ? "0 2px 8px rgba(225,29,47,0.25)" : "none",
              }}
            >
              <ProductMedia
                src={image}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-contain"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
