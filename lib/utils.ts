export const formatPrice = (price: number) =>
  new Intl.NumberFormat("ar-EG", {
    maximumFractionDigits: 0,
  }).format(price);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("ar-EG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export const isToday = (value: string) => {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FFa-z0-9\s-]/g, "") // Remove weird symbols but keep Arabic, letters, numbers, spaces, hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single one
    .replace(/^-+|-+$/g, ""); // Trim hyphens from ends
