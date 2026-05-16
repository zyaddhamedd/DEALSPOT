import { Product } from "@/lib/types";

const createReviews = (productName: string) => [
  {
    id: `${productName}-1`,
    name: "كريم - الجيزة",
    rating: 5,
    comment: "الخامة ممتازة والشكل على الرجل شيك جدا. التأكيد كان سريع.",
  },
  {
    id: `${productName}-2`,
    name: "يوسف - الإسكندرية",
    rating: 5,
    comment: "المقاس مظبوط ومريح طول اليوم. مناسب للخروج والجامعة فعلا.",
  },
  {
    id: `${productName}-3`,
    name: "مروان - القاهرة",
    rating: 4,
    comment: "وصلني تأكيد بسرعة والتبديل كان واضح لو احتجت مقاس تاني.",
  },
];

const createFaq = () => [
  {
    question: "هل الدفع أونلاين؟",
    answer: "لا، الدفع عند الاستلام بعد ما نأكد معاك الأوردر بالتليفون.",
  },
  {
    question: "لو المقاس مش مناسب؟",
    answer: "فيه مساعدة مقاسات قبل الطلب، وكمان بنوضح لك خطوات التبديل بسهولة.",
  },
  {
    question: "إمتى بيتم التأكيد؟",
    answer: "بنراجع الطلب بسرعة ونتواصل معاك لتأكيد البيانات قبل الإرسال.",
  },
];

export const placeholderImageGuide = [
  { product: "WEAIR-2 black full sneaker", file: "AIRFORCE DARB 01.webp" },
  { product: "LOOR-9 black/red sneaker", file: "AIRFORCE02.webp" },
  { product: "LOOR-3 white/black sneaker", file: "airforce03.webp" },
  { product: "LOOR-5 white/gum sneaker", file: "airforce04.webp" },
  { product: "WEAIR-1 full white sneaker", file: "airforce05.webp" },
];

export const defaultProducts: Product[] = [];
