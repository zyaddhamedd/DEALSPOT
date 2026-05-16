import { ProductReview } from "@/lib/types";

type ReviewsProps = {
  reviews: ProductReview[];
};

export function Reviews({ reviews }: ReviewsProps) {
  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="eyebrow !px-3 !py-1 !text-[9px]">Verified Reviews</span>
          <h2 className="headline mt-4 text-3xl text-white lg:text-4xl">آراء العملاء</h2>
        </div>
        <div className="rounded-full border border-white/5 bg-white/[0.03] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
          +120 confirmed orders recently
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <article key={review.id} className="panel !rounded-[2rem] p-6 transition-all hover:border-white/20">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm font-bold tracking-wide text-white">{review.name}</p>
              <div className="flex gap-0.5 text-[10px] text-accent">
                {"★".repeat(review.rating)}
              </div>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
