"use client";

import { useState } from "react";
import { ProductFaq } from "@/lib/types";

const defaultFaqs: ProductFaq[] = [
  {
    question: "هل الدفع عند الاستلام؟",
    answer: "أيوه بالظبط، بتدفع لما البضاعة توصلك على طول، مفيش دفع مقدم خالص.",
  },
  {
    question: "هل أقدر أغير المقاس؟",
    answer: "طبعاً، لو المقاس مش مظبط بنستبدله بسهولة. بس لازم يكون في حالة كويسة.",
  },
  {
    question: "مدة التوصيل قد إيه؟",
    answer: "التوصيل بيتم في خلال 2 إلى 4 أيام عمل حسب محافظتك.",
  },
  {
    question: "إيه جودة الخامات؟",
    answer: "بنستخدم خامات ممتازة درجة أولى، بتضمنلك أعلى راحة وأطول عمر للمنتج مع الاستخدام.",
  },
  {
    question: "هل المنتج زي الصور؟",
    answer: "الصور حقيقية 100%، وليك الحق تعاين وتتأكد من كل حاجة بنفسك قبل ما تدفع مليم.",
  },
  {
    question: "إزاي بتأكدوا الأوردر؟",
    answer: "بعد ما بتسجل الأوردر، بنتواصل معاك على موبايلك لتأكيد البيانات قبل الشحن.",
  },
];

type ProductFAQProps = {
  items?: ProductFaq[];
};

export function ProductFAQ({ items }: ProductFAQProps) {
  const faqs = items && items.length > 0 ? items : defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p
        style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 16,
          fontWeight: 800,
          color: "#111",
          marginBottom: 4,
        }}
      >
        أسئلة شائعة
      </p>

      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div
            key={index}
            className="card"
            style={{
              overflow: "hidden",
              transition: "all 0.2s ease",
              border: isOpen ? "1.5px solid #fecaca" : undefined,
            }}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 20px",
                background: "none",
                border: "none",
                cursor: "pointer",
                textAlign: "right",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#111",
                  flex: 1,
                  textAlign: "right",
                }}
              >
                {faq.question}
              </span>
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isOpen ? "#e11d2f" : "#f3f4f6",
                  color: isOpen ? "white" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                  transform: isOpen ? "rotate(45deg)" : "none",
                }}
              >
                +
              </span>
            </button>

            {isOpen && (
              <div
                className="animate-fade-up"
                style={{
                  padding: "0 20px 16px",
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 13,
                  color: "#374151",
                  lineHeight: 1.7,
                }}
              >
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
