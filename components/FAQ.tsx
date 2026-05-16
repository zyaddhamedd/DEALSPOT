import { ProductFaq } from "@/lib/types";

type FAQProps = {
  items: ProductFaq[];
};

export function FAQ({ items }: FAQProps) {
  return (
    <section className="space-y-10">
      <div>
        <span className="eyebrow !px-3 !py-1 !text-[9px]">Common Questions</span>
        <h2 className="headline mt-4 text-3xl text-white lg:text-4xl">أسئلة متكررة</h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <details key={item.question} className="panel group !rounded-[1.75rem] overflow-hidden transition-all duration-300" open={false}>
            <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-sm font-bold tracking-wide text-white transition-colors hover:bg-white/[0.02]">
              {item.question}
              <span className="text-xl font-light text-white/20 transition-transform duration-300 group-open:rotate-45">+</span>
            </summary>
            <div className="px-6 pb-6 pt-0">
              <p className="text-sm leading-relaxed text-white/50">{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
