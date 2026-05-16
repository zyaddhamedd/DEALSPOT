/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { isDataUrl } from "@/lib/productImages";

type ProductMediaProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function ProductMedia({
  src,
  alt,
  className,
  fill = false,
  priority = false,
  sizes,
}: ProductMediaProps) {
  if (!src) {
    return (
      <div
        aria-label={alt}
        className={fill ? `absolute inset-0 h-full w-full bg-white/5 ${className ?? ""}` : className}
      />
    );
  }

  if (isDataUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={fill ? `absolute inset-0 h-full w-full ${className ?? ""}` : className}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      priority={priority}
      className={className}
      sizes={sizes}
    />
  );
}
