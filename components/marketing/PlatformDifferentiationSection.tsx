type Question = { question: string; answer: string };

type PlatformDifferentiationSectionProps = {
  title: string;
  items: Question[];
};

export default function PlatformDifferentiationSection({ title, items }: PlatformDifferentiationSectionProps) {
  return (
    <section className="border-t border-aipify-border bg-aipify-surface-muted/40" aria-labelledby="platform-differentiation-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <h2 id="platform-differentiation-title" className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {title}
        </h2>
        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.question} className="rounded-xl border border-aipify-border bg-aipify-surface p-5 shadow-sm">
              <dt className="text-sm font-semibold text-aipify-companion">{item.question}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{item.answer}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
