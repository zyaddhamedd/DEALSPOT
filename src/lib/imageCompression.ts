const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read converted image data."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });

const loadImage = (file: File) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Failed to read image file."));
    reader.onload = () => {
      const image = new window.Image();

      image.onerror = () => reject(new Error("Failed to load image for conversion."));
      image.onload = () => resolve(image);
      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });

export const isSupportedImageFile = (file: File) => file.type.startsWith("image/");

export const convertImageToWebP = async (
  file: File,
  quality = 0.82,
  maxWidth = 1400,
): Promise<string> => {
  if (!isSupportedImageFile(file)) {
    throw new Error("Unsupported image format. Please upload an image file.");
  }

  const image = await loadImage(file);
  const scale = image.naturalWidth > maxWidth ? maxWidth / image.naturalWidth : 1;
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas is not available in this browser.");
  }

  context.drawImage(image, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (nextBlob) => {
        if (!nextBlob) {
          reject(new Error("Failed to convert image to WebP."));
          return;
        }

        resolve(nextBlob);
      },
      "image/webp",
      quality,
    );
  });

  return blobToDataUrl(blob);
};

export const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

export const estimateDataUrlBytes = (value: string) => {
  if (!value.startsWith("data:")) {
    return 0;
  }

  const [, base64 = ""] = value.split(",", 2);
  const padding = (base64.match(/=+$/u)?.[0].length ?? 0);
  return Math.max(0, Math.floor((base64.length * 3) / 4) - padding);
};
