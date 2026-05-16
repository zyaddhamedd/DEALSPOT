import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductGrid } from "@/components/ProductGrid";

const whyItems = [
  {
    title: "تأكيد سريع",
    copy: "بنراجع الطلبات بسرعة ونتواصل معاك لتأكيد المقاس والبيانات بدون تعقيد.",
  },
  {
    title: "دفع عند الاستلام",
    copy: "تقدر تطلب براحتك وتدفع وقت الاستلام بعد ما نتأكد من كل التفاصيل.",
  },
  {
    title: "ستايلات منتقاة",
    copy: "الموديلات قليلة ومختارة بعناية علشان تحس إنك داخل drop حقيقي مش marketplace.",
  },
  {
    title: "مساعدة في المقاسات",
    copy: "لو محتاج ترشيح للمقاس أو تبديل، الفريق بيساعدك قبل وبعد الطلب.",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <section className="section-space overflow-hidden">
          <div className="container-shell">
            <div className="panel relative overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20">
              <div className="absolute inset-0 bg-grain opacity-90" />
              <div className="relative z-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                <div className="fade-up">
                  <span className="eyebrow">DealSpot Sneaker Drop</span>
                  <h1 className="headline mt-6 max-w-4xl text-5xl leading-[0.92] text-white sm:text-6xl lg:text-8xl">
                    Sneakers That Match Every Fit.
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 sm:text-lg">
                    دروب صغير بروح streetwear، موديلات منتقاة، وتفاصيل تخليك تحس إنك واخد drop
                    مميز مش مجرد شراء عادي.
                  </p>
                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <a href="#drop" className="btn-primary">
                      Shop The Drop
                    </a>
                    <a href="#why" className="btn-secondary">
                      ليه DealSpot؟
                    </a>
                  </div>
                </div>

                <div className="grid gap-4 text-sm text-white/78 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Curated</p>
                    <p className="mt-3 text-lg text-white">5 موديلات فقط لسرعة القرار وتجربة أوضح.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Trusted</p>
                    <p className="mt-3 text-lg text-white">تأكيد يدوي، دفع عند الاستلام، ومساعدة مقاس قبل الطلب.</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5 sm:col-span-2">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/45">Premium Feel</p>
                    <p className="mt-3 text-lg text-white">
                      تصميم بصري أنظف، أقوى، وأقرب لفكرة limited sneaker drop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="drop" className="container-shell section-space pt-0">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow">The Drop</span>
              <h2 className="headline mt-4 text-3xl text-white sm:text-4xl">اختار من الدروب الحالي</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-white/62">
              كل موديل معمول ليبقى سهل في اللبس، مناسب للطلعات، والجامعة، واللوك اليومي بشكل أنضف.
            </p>
          </div>
          <ProductGrid />
        </section>

        <section id="why" className="container-shell section-space pt-0">
          <div className="panel p-6 sm:p-8 lg:p-10">
            <div className="mb-8">
              <span className="eyebrow">Why DealSpot</span>
              <h2 className="headline mt-4 text-3xl text-white sm:text-4xl">ليه تشتري من DealSpot؟</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {whyItems.map((item) => (
                <article key={item.title} className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5">
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/68">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container-shell section-space pt-0">
          <div className="panel overflow-hidden p-6 sm:p-8 lg:p-12">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="eyebrow">Final Call</span>
                <h2 className="headline mt-4 text-3xl text-white sm:text-4xl">
                  خليك داخل الدروب قبل ما المقاسات تخلص
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
                  اطلب الموديل اللي مناسبك دلوقتي، وسيب علينا خطوة التأكيد والمتابعة لحد ما الطلب يبقى واضح
                  وسهل.
                </p>
              </div>
              <a href="#drop" className="btn-primary">
                Shop The Drop
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
