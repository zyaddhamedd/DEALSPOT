export const isDataUrl = (value: string) => value.startsWith("data:image/");

export const normalizeStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
};

export const resolveProductImages = (value: unknown, fallback: string[] = []) => {
  const images = normalizeStringArray(value);
  return images.length > 0 ? images : [...fallback];
};
