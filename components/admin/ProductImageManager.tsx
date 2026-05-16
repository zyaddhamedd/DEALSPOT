"use client";

import { ChangeEvent, DragEvent, useMemo, useState } from "react";
import { ProductMedia } from "@/components/ProductMedia";
import { isDataUrl } from "@/lib/productImages";
import { Product } from "@/lib/types";
import { convertImageToWebP, estimateDataUrlBytes, formatFileSize } from "@/src/lib/imageCompression";

type ProductImageManagerProps = {
  product: Product;
  onImagesChange: (images: string[]) => void;
  storageWarning?: string;
};

const LOCAL_STORAGE_WARNING_BYTES = 4.5 * 1024 * 1024;

const getImageLabel = (image: string) => {
  if (isDataUrl(image)) {
    const size = estimateDataUrlBytes(image);
    return size > 0 ? formatFileSize(size) : "Uploaded image";
  }

  return "Public asset";
};

export function ProductImageManager({
  product,
  onImagesChange,
  storageWarning,
}: ProductImageManagerProps) {
  const [notice, setNotice] = useState<{ tone: "error" | "info" | "warning" | "success"; message: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const uploadedBytes = useMemo(
    () =>
      product.images.reduce((total, image) => total + (isDataUrl(image) ? estimateDataUrlBytes(image) : 0), 0),
    [product.images],
  );

  const processFiles = async (files: File[]) => {
    if (files.length === 0) {
      return;
    }

    setIsConverting(true);
    setNotice({
      tone: "info",
      message: `Converting ${files.length} image${files.length > 1 ? "s" : ""}...`,
    });

    try {
      const convertedImages: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error(`${file.name} is not a supported image file.`);
        }

        convertedImages.push(await convertImageToWebP(file, 0.82, 1400));
      }

      const nextImages = [...product.images, ...convertedImages];
      onImagesChange(nextImages);

      const nextBytes = nextImages.reduce(
        (total, image) => total + (isDataUrl(image) ? estimateDataUrlBytes(image) : 0),
        0,
      );

      setNotice({
        tone: nextBytes > LOCAL_STORAGE_WARNING_BYTES ? "warning" : "success",
        message:
          nextBytes > LOCAL_STORAGE_WARNING_BYTES
            ? "Images were added, but localStorage usage is getting large. This MVP may hit browser limits soon."
            : `Added ${convertedImages.length} image${convertedImages.length > 1 ? "s" : ""}.`,
      });
    } catch (error) {
      setNotice({
        tone: "error",
        message: error instanceof Error ? error.message : "Image conversion failed.",
      });
    } finally {
      setIsConverting(false);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    await processFiles(files);
  };

  const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    await processFiles(Array.from(event.dataTransfer.files));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= product.images.length) {
      return;
    }

    const nextImages = [...product.images];
    [nextImages[index], nextImages[nextIndex]] = [nextImages[nextIndex], nextImages[index]];
    onImagesChange(nextImages);
  };

  const removeImage = (index: number) => {
    onImagesChange(product.images.filter((_, imageIndex) => imageIndex !== index));
  };

  return (
    <section className="rounded-[1.8rem] border border-white/10 bg-black/20 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Images</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58">
            ارفع صور من جهازك مباشرة. أول صورة تبقى Hero image وتظهر أولاً في صفحة المنتج.
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/58">
          Uploaded data: {formatFileSize(uploadedBytes)}
        </div>
      </div>

      <label
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => void handleDrop(event)}
        className={`mt-5 flex cursor-pointer flex-col items-center justify-center rounded-[1.7rem] border border-dashed px-5 py-10 text-center transition ${
          isDragging ? "border-accent bg-accent/10" : "border-white/14 bg-white/[0.04]"
        } ${isConverting ? "pointer-events-none opacity-70" : ""}`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(event) => void handleInputChange(event)}
          disabled={isConverting}
        />
        <p className="text-base font-semibold text-white">
          {isConverting ? "Converting..." : "Upload images or drag them here"}
        </p>
        <p className="mt-2 text-sm text-white/55">Automatic WebP conversion, local-only storage, multiple files supported.</p>
      </label>

      {notice ? (
        <div
          className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
            notice.tone === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : notice.tone === "warning"
                ? "border-amber-500/20 bg-amber-500/10 text-amber-200"
                : notice.tone === "error"
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-white/10 bg-white/5 text-white/68"
          }`}
        >
          {notice.message}
        </div>
      ) : null}

      {storageWarning ? (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {storageWarning}
        </div>
      ) : null}

      {product.images.length === 0 ? (
        <div className="mt-5 rounded-[1.6rem] border border-dashed border-white/12 px-4 py-10 text-center text-sm text-white/45">
          No product images yet.
        </div>
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {product.images.map((image, index) => (
            <article
              key={`${image}-${index}`}
              className="overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/[0.04]"
            >
              <div className="relative aspect-[4/4.4] overflow-hidden">
                <ProductMedia
                  src={image}
                  alt={`${product.name} image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 23vw"
                />
                <div className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1 text-xs text-white/78">
                  {index === 0 ? "Hero" : `Image ${index + 1}`}
                </div>
              </div>

              <div className="p-3">
                <div className="mb-3 flex items-center justify-between gap-3 text-xs text-white/48">
                  <span>{getImageLabel(image)}</span>
                  <span>{isDataUrl(image) ? "Uploaded" : "Public path"}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0}
                    className="btn-secondary px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={index === product.images.length - 1}
                    className="btn-secondary px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Right
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
