const benefits = [
  {
    icon: "🔥",
    title: "يليق على أي outfit",
    copy: "تصميم street-ready يرفع اللبس من غير ما يبقى صعب في التنسيق.",
  },
  {
    icon: "🎓",
    title: "مناسب للجامعة والخروج",
    copy: "خفيف ومريح للمشاوير الطويلة والأماكن العلنية.",
  },
  {
    icon: "☁️",
    title: "مريح للمشي اليومي",
    copy: "نعل ناعم وخامة هواء تفرق مع طول اليوم.",
  },
  {
    icon: "✨",
    title: "تصميم تريندي وسهل",
    copy: "تصميم واضح يتمشى مع أي كوتشي أو لبس ترفيهي.",
  },
];

export function BenefitCards() {
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
        ليه تختار المنتج ده؟
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        {benefits.map((b) => (
          <div
            key={b.title}
            className="card"
            style={{ padding: "16px 14px" }}
          >
            <span style={{ fontSize: 24 }}>{b.icon}</span>
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 13,
                fontWeight: 800,
                color: "#111",
                margin: "8px 0 4px",
              }}
            >
              {b.title}
            </p>
            <p
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 11,
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              {b.copy}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
