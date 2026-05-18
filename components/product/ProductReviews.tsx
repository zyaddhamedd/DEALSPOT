import { ProductReview } from "@/lib/types";

const defaultReviews: ProductReview[] = [
  {
    id: "r1",
    name: "أحمد المحلاوي",
    rating: 5,
    comment: "بصراحة الكوتشي وهمي! النعل طري جداً ومريح في المشي الطويل والجامعة ومبيفركش مع الحركة. الخامة نضيفة والتقفيل عالي أوي بجد يستاهل كل جنيه. الشحن جالي في يومين بس لحد طنطا.",
    date: "منذ يومين",
    variant: "اللون: BLACK | المقاس: 43",
    verified: true,
  },
  {
    id: "r2",
    name: "سارة عبد الرحمن",
    rating: 5,
    comment: "الشكل تحفة ونفس الصورة بالظبط بالملي! كنت خايفة المقاس يطلع ضيق بس كلمتهم واتساب وساعدوني أختار مقاسي وجالي مظبوط جداً. التوصيل سريع والمعاينة قبل الدفع دي ميزة ممتازة تضمن حقي.",
    date: "منذ 4 أيام",
    variant: "اللون: WHITE | المقاس: 38",
    verified: true,
  },
  {
    id: "r3",
    name: "مينا يوسف",
    rating: 5,
    comment: "تقفيل محترم جداً ونعل خفيف بيمتص الصدمات، بقالي أسبوع بلبسه يومياً في الجري والشغل ومريح جداً ومش بيكتم الرجل. تعامل المندوب كان راقي وسريع. هطلب واحد تاني لأخويا أكيد.",
    date: "منذ أسبوع",
    variant: "اللون: BLACK | المقاس: 44",
    verified: true,
  },
  {
    id: "r4",
    name: "مصطفى خالد",
    rating: 5,
    comment: "الكوتشي ممتاز وخامته ممتازة بجد، النعل مريح جداً. الشحن أخر يوم زيادة عشان ضغط الأوردرات بس لما وصل عاينته وطلع ممتاز ويستاهل الانتظار. شكراً ليكم ولأمانتكم.",
    date: "منذ 9 أيام",
    variant: "اللون: BLACK | المقاس: 42",
    verified: true,
  },
];

const avatarColors = [
  { bg: "#fee2e2", text: "#ef4444" }, // Red
  { bg: "#fef3c7", text: "#d97706" }, // Amber
  { bg: "#d1fae5", text: "#059669" }, // Emerald
  { bg: "#e0f2fe", text: "#0284c7" }, // Sky
  { bg: "#f3e8ff", text: "#7c3aed" }, // Purple
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "star-filled" : "star-empty"}
          style={{ fontSize: 13 }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

type ProductReviewsProps = {
  reviews?: ProductReview[];
};

export function ProductReviews({ reviews }: ProductReviewsProps) {
  const displayReviews = (reviews && reviews.length > 0 ? reviews : defaultReviews).slice(0, 4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 16,
            fontWeight: 800,
            color: "#111",
          }}
        >
          آراء العملاء
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#fef9c3",
            borderRadius: 100,
            padding: "4px 12px",
            border: "1px solid #fde68a",
          }}
        >
          <span style={{ fontSize: 14 }}>★</span>
          <span
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 13,
              fontWeight: 800,
              color: "#92400e",
            }}
          >
            4.9
          </span>
        </div>
      </div>

      {/* Review cards */}
      {displayReviews.map((review, index) => {
        const avatarColor = avatarColors[index % avatarColors.length];
        const initial = review.name ? review.name.trim().charAt(0) : "ع";
        
        return (
          <div
            key={review.id}
            className="card"
            style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 10 }}
          >
            {/* Top row: User Info, Stars & Date */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Custom Avatar Circle */}
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    backgroundColor: avatarColor.bg,
                    color: avatarColor.text,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 15,
                    fontWeight: 800,
                  }}
                >
                  {initial}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p
                      style={{
                        fontFamily: "'Cairo', sans-serif",
                        fontSize: 14,
                        fontWeight: 800,
                        color: "#111",
                        margin: 0,
                      }}
                    >
                      {review.name}
                    </p>
                    {/* Verified Badge */}
                    {(review.verified !== false) && (
                      <span
                        style={{
                          fontFamily: "'Cairo', sans-serif",
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#16a34a",
                          backgroundColor: "#f0fdf4",
                          padding: "1px 6px",
                          borderRadius: 100,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        مشتري موثق ✓
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                </div>
              </div>

              {/* Date */}
              <span
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                {review.date || "منذ أيام"}
              </span>
            </div>

            {/* Variant details (e.g. Size & Color purchased) */}
            {review.variant && (
              <div
                style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 11,
                  color: "#6b7280",
                  backgroundColor: "#f9fafb",
                  padding: "4px 10px",
                  borderRadius: 6,
                  display: "inline-flex",
                  alignSelf: "flex-start",
                }}
              >
                {review.variant}
              </div>
            )}

            {/* Review Comment */}
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 13,
                color: "#374151",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {review.comment}
            </p>
          </div>
        );
      })}
    </div>
  );
}
