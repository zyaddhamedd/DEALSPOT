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

export const defaultProducts: Product[] = [
  {
    id: "prod-weair-2",
    slug: "weair-2-black-full",
    name: "WEAIR-2 Black Full",
    price: 1850,
    salePrice: 1590,
    description:
      "سنيكر أسود بالكامل بطابع نظيف وجريء. تصميم مناسب لكل يوم، ويكمل أي لوك ستريت وير بسهولة.",
    shortTag: "Drop 01 / Full Black",
    active: true,
    featured: true,
    images: [
      "/products/AIRFORCE DARB 01.webp",
      "/products/AIRFORCE DARB 01.webp",
      "/products/AIRFORCE DARB 01.webp",
    ],
    sizes: ["41", "42", "43", "44", "45"],
    accent: "من أكثر الموديلات اللي تمشي مع الجينز، الكارجو، واللوك اليومي.",
    reviews: createReviews("WEAIR-2"),
    faq: createFaq(),
  },
  {
    id: "prod-loor-9",
    slug: "loor-9-black-red",
    name: "LOOR-9 Black / Red",
    price: 1990,
    salePrice: 1690,
    description:
      "مزيج أسود وأحمر بخطوط واضحة وإحساس درامي. معمول للناس اللي تحب الحضور الواضح بدون مبالغة.",
    shortTag: "Drop 02 / Black Red",
    active: true,
    featured: true,
    images: ["/products/AIRFORCE02.webp", "/products/AIRFORCE02.webp", "/products/AIRFORCE02.webp"],
    sizes: ["40", "41", "42", "43", "44"],
    accent: "ستايل شبابي يلفت النظر مع لمسة رياضية نظيفة.",
    reviews: createReviews("LOOR-9"),
    faq: createFaq(),
  },
  {
    id: "prod-loor-3",
    slug: "loor-3-white-black",
    name: "LOOR-3 White / Black",
    price: 1890,
    salePrice: 1620,
    description:
      "توازن واضح بين الأبيض والأسود لناس تحب الكلاسيك الحديث. اختيار سهل للبس اليومي مع شكل مميز.",
    shortTag: "Drop 03 / Contrast White",
    active: true,
    featured: true,
    images: ["/products/airforce03.webp", "/products/airforce03.webp", "/products/airforce03.webp"],
    sizes: ["41", "42", "43", "44", "45"],
    accent: "بيعلي أي outfit من غير ما يبقى صعب في التنسيق.",
    reviews: createReviews("LOOR-3"),
    faq: createFaq(),
  },
  {
    id: "prod-loor-5",
    slug: "loor-5-white-gum",
    name: "LOOR-5 White / Gum",
    price: 1940,
    salePrice: 1660,
    description:
      "قاعدة gum مع جسم أبيض تمنح الموديل طابع streetwear هادي لكنه premium في نفس الوقت.",
    shortTag: "Drop 04 / White Gum",
    active: true,
    featured: false,
    images: ["/products/airforce04.webp", "/products/airforce04.webp", "/products/airforce04.webp"],
    sizes: ["40", "41", "42", "43", "44"],
    accent: "موديل مريح بصريًا وسهل تلبسه على مدار اليوم.",
    reviews: createReviews("LOOR-5"),
    faq: createFaq(),
  },
  {
    id: "prod-weair-1",
    slug: "weair-1-full-white",
    name: "WEAIR-1 Full White",
    price: 1790,
    salePrice: 1540,
    description:
      "أبيض كامل بمظهر clean ومينيمال. خيار مناسب لو عايز سنيكر يشتغل مع أغلب اللبس بسهولة.",
    shortTag: "Drop 05 / Full White",
    active: true,
    featured: false,
    images: ["/products/airforce05.webp", "/products/airforce05.webp", "/products/airforce05.webp"],
    sizes: ["41", "42", "43", "44"],
    accent: "شكل نضيف وخفيف على الرجل، مناسب للطلعات والجامعة.",
    reviews: createReviews("WEAIR-1"),
    faq: createFaq(),
  },
];
