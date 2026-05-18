export type ProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  variant?: string;
  verified?: boolean;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  salePrice: number;
  description: string;
  images: string[];
  sizes: string[];
  active: boolean;
  featured?: boolean;
  shortTag?: string;
  accent?: string;
  colors?: { name: string; hex: string }[];
  reviews?: ProductReview[];
  faq?: ProductFaq[];
};

export type OrderStatus = "New" | "Confirmed" | "Sent to supplier" | "Cancelled";

export type Order = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  size: string;
  color: string;
  quantity: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
};

export type OrderPayload = {
  fullName: string;
  phone: string;
  governorate: string;
  address: string;
  size: string;
  color: string;
  quantity: number;
  notes?: string;
};
