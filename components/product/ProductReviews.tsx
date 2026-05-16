import { ProductReview } from "@/lib/types";

const defaultReviews: ProductReview[] = [
  {
    id: "r1",
    name: "محمد أشرف",
    rating: 5,
    comment: "الكوتشي وصل بسرعة وخامته ممتازة جداً، المقاس ظبط زي ما قلتلهم وهيبقى أكيد مش آخر أوردر.",
  },
  {
    id: "r2",
    name: "نورهان كمال",
    rating: 5,
    comment: "طلبتيه وجاء في يومين! الشكل أجمل من الصور والمقاس ظبط تماماً. شكراً DealSpot 🔥",
  },
  {
    id: "r3",
    name: "كريم يوسف",
    rating: 4,
    comment: "منتج ممتاز وسعر معقول جداً للجودة دي. التواصل كان سريع والشحن كان في الموعد.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= rating ? "star-filled" : "star-empty"}
          style={{ fontSize: 14 }}
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
  const displayReviews = (reviews && reviews.length > 0 ? reviews : defaultReviews).slice(0, 3);

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
      {displayReviews.map((review) => (
        <div
          key={review.id}
          className="card"
          style={{ padding: "16px" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#111",
              }}
            >
              {review.name}
            </p>
            <StarRating rating={review.rating} />
          </div>
          <p
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 13,
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
