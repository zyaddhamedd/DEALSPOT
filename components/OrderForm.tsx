"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createOrder } from "@/lib/storage";
import { OrderPayload, Product } from "@/lib/types";
import { trackMetaEvent, trackPurchaseEvent } from "@/components/analytics/trackMetaEvent";

type OrderFormProps = {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
  onSuccess?: () => void;
  onColorValidationError?: () => void;
  onSizeValidationError?: () => void;
};

type FormErrors = Partial<Record<keyof OrderPayload, string>>;

const egyptianPhonePattern = /^(?:\+?2)?01[0125][0-9]{8}$/;

const GOVERNORATES = [
  "القاهرة",
  "الجيزة",
  "الإسكندرية",
  "الشرقية",
  "القليوبية",
  "الدقهلية",
  "المنوفية",
  "الغربية",
  "كفر الشيخ",
  "البحيرة",
  "الإسماعيلية",
  "بورسعيد",
  "السويس",
  "دمياط",
  "الفيوم",
  "بني سويف",
  "المنيا",
  "أسيوط",
  "سوهاج",
  "قنا",
  "الأقصر",
  "أسوان",
  "البحر الأحمر",
  "سيناء الشمالية",
  "سيناء الجنوبية",
  "مرسى مطروح",
  "الوادي الجديد",
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        color: "#374151",
        display: "block",
        marginBottom: 6,
      }}
    >
      {children}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      className="animate-fade-up"
      style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 11,
        fontWeight: 700,
        color: "#e11d2f",
        marginTop: 4,
      }}
    >
      {message}
    </p>
  );
}

export function OrderForm({
  product,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
  onSuccess,
  onColorValidationError,
  onSizeValidationError,
}: OrderFormProps) {
  const [form, setForm] = useState<OrderPayload>({
    fullName: "",
    phone: "",
    governorate: "",
    address: "",
    size: selectedSize || product.sizes[0] || "",
    color: selectedColor || "",
    quantity: 1,
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Sync selectedSize prop with local form state
  useEffect(() => {
    if (selectedSize) {
      setForm((prev) => ({ ...prev, size: selectedSize }));
    }
  }, [selectedSize]);

  // Sync selectedColor prop with local form state
  useEffect(() => {
    if (selectedColor) {
      setForm((prev) => ({ ...prev, color: selectedColor }));
    }
  }, [selectedColor]);

  const selectedSizeValue = useMemo(
    () => selectedSize || form.size || product.sizes[0] || "",
    [form.size, product.sizes, selectedSize],
  );

  const selectedColorValue = useMemo(
    () => selectedColor || form.color || "",
    [form.color, selectedColor],
  );

  const validate = () => {
    const nextErrors: FormErrors = {};
    if (!form.fullName.trim()) nextErrors.fullName = "الاسم مطلوب";
    if (!egyptianPhonePattern.test(form.phone.trim()))
      nextErrors.phone = "اكتب رقم موبايل مصري صحيح";
    if (!form.governorate.trim()) nextErrors.governorate = "المحافظة مطلوبة";
    if (!form.address.trim()) nextErrors.address = "العنوان مطلوب";
    if (!selectedSizeValue) nextErrors.size = "اختار المقاس";
    if (product.colors && product.colors.length > 0 && !selectedColorValue)
      nextErrors.color = "اختار اللون";
    if (!form.quantity || form.quantity < 1)
      nextErrors.quantity = "الكمية لازم تكون 1 أو أكثر";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Smooth scroll to and shake the ColorSelector if color is missing
    if (product.colors && product.colors.length > 0 && !selectedColorValue) {
      onColorValidationError?.();
      return;
    }

    // Smooth scroll to and shake the SizeSelector if size is missing
    if (!selectedSizeValue) {
      onSizeValidationError?.();
      return;
    }

    if (!validate()) return;
    setIsSubmitting(true);

    const payload = {
      ...form,
      size: selectedSizeValue,
      color: selectedColorValue,
      phone: form.phone.trim(),
      fullName: form.fullName.trim(),
      governorate: form.governorate.trim(),
      address: form.address.trim(),
      notes: form.notes?.trim(),
      productSlug: product.slug, // Added for DB logic
    };

    try {
      // 1. Production DB Submission
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to place order in DB");
      }

      const data = await res.json();
      const orderId = data.orderId;

      // 2. Local Legacy Storage (for current admin view)
      createOrder(product, payload);

      const total = product.salePrice * payload.quantity;

      // Track Lead event after successful order submission
      trackMetaEvent("Lead", {
        content_name: product.name,
        content_ids: [product.id],
        value: total,
        currency: "EGP",
      });

      // Track Purchase event professionally using our reusable helper
      trackPurchaseEvent({
        order: { id: orderId },
        product: { id: product.id, name: product.name },
        quantity: payload.quantity,
        total: total,
      });

      setSuccessMessage("تم تسجيل طلبك بنجاح، هنتواصل معاك لتأكيد الأوردر.");
      setForm({
        fullName: "",
        phone: "",
        governorate: "",
        address: "",
        size: selectedSizeValue,
        color: selectedColorValue,
        quantity: 1,
        notes: "",
      });
      setErrors({});
      onSuccess?.();
    } catch (error) {
      console.error("Order failed:", error);
      setErrors({ fullName: "عذراً، حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div
        className="card animate-fade-up"
        style={{
          padding: "32px 24px",
          textAlign: "center",
          borderColor: "#bbf7d0",
          background: "#f0fdf4",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 18,
            fontWeight: 900,
            color: "#15803d",
            marginBottom: 8,
          }}
        >
          {successMessage}
        </p>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            color: "#16a34a",
          }}
        >
          فريقنا هيتواصل معاك على رقمك قريباً
        </p>
      </div>
    );
  }

  return (
    <div id="order-form">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <span className="section-badge" style={{ marginBottom: 10, display: "inline-flex" }}>
          <span>📦</span> اطلب دلوقتي
        </span>
        <h2
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 20,
            fontWeight: 900,
            color: "#111",
            marginTop: 8,
          }}
        >
          بيانات الشحن
        </h2>
        <p
          style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            color: "#6b7280",
            marginTop: 4,
          }}
        >
          اختار مقاسك وسيب بياناتك، وهنأكد معاك الأوردر
        </p>
      </div>

      <form
        className="card"
        style={{ padding: "24px 20px" }}
        onSubmit={handleSubmit}
        noValidate
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Full Name */}
          <div>
            <FieldLabel>الاسم بالكامل *</FieldLabel>
            <input
              className="field-light"
              placeholder="مثال: أحمد محمد علي"
              value={form.fullName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
            <FieldError message={errors.fullName} />
          </div>

          {/* Phone */}
          <div>
            <FieldLabel>رقم الموبايل *</FieldLabel>
            <input
              className="field-light"
              inputMode="tel"
              placeholder="مثال: 01012345678"
              value={form.phone}
              onChange={(e) => {
                const rawVal = e.target.value;
                const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
                let normalized = rawVal;
                for (let i = 0; i < 10; i++) {
                  normalized = normalized.split(arabicNumbers[i]).join(String(i));
                }
                // Keep only digits and plus sign, removing spaces, dashes, and other characters
                normalized = normalized.replace(/[^\d+]/g, "");
                setForm((prev) => ({ ...prev, phone: normalized }));
              }}
            />
            <FieldError message={errors.phone} />
          </div>

          {/* Governorate */}
          <div>
            <FieldLabel>المحافظة *</FieldLabel>
            <div style={{ position: "relative" }}>
              <select
                className="field-light"
                style={{ appearance: "none", paddingLeft: 36 }}
                value={form.governorate}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, governorate: e.target.value }))
                }
              >
                <option value="">اختار المحافظة</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {gov}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#9ca3af",
                  fontSize: 14,
                }}
              >
                ▾
              </span>
            </div>
            <FieldError message={errors.governorate} />
          </div>

          {/* Address */}
          <div>
            <FieldLabel>العنوان بالتفصيل *</FieldLabel>
            <input
              className="field-light"
              placeholder="الشارع، الحي، أقرب نقطة مميزة"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
            <FieldError message={errors.address} />
          </div>

          {/* Size + Quantity row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <FieldLabel>المقاس *</FieldLabel>
              <div style={{ position: "relative" }}>
                <select
                  className="field-light"
                  style={{ appearance: "none", paddingLeft: 28 }}
                  value={selectedSizeValue}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, size: e.target.value }));
                    onSizeChange(e.target.value);
                  }}
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    pointerEvents: "none",
                    color: "#9ca3af",
                    fontSize: 12,
                  }}
                >
                  ▾
                </span>
              </div>
              <FieldError message={errors.size} />
            </div>

            <div>
              <FieldLabel>الكمية *</FieldLabel>
              <input
                className="field-light"
                type="number"
                min={1}
                max={10}
                placeholder="1"
                value={form.quantity}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    quantity: Number(e.target.value),
                  }))
                }
              />
              <FieldError message={errors.quantity} />
            </div>
          </div>

          {/* Notes */}
          <div>
            <FieldLabel>ملاحظات (اختياري)</FieldLabel>
            <textarea
              className="field-light"
              style={{ minHeight: 80, resize: "none" }}
              placeholder="أي طلبات خاصة أو تفاصيل إضافية..."
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-red"
            style={{ width: "100%", padding: "18px", fontSize: 16, marginTop: 4 }}
          >
            {isSubmitting ? "جاري التأكيد..." : "✅ تأكيد الطلب — الدفع عند الاستلام"}
          </button>

          <p
            style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 11,
              color: "#9ca3af",
              textAlign: "center",
            }}
          >
            🔒 بياناتك آمنة تماماً ومش بتتشارك مع أي حد
          </p>
        </div>
      </form>
    </div>
  );
}
