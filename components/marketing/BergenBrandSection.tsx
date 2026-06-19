type BergenBrandSectionProps = {
  title: string;
  intro: string;
  valuesTitle: string;
  values: string[];
  closing: string;
};

export default function BergenBrandSection({
  title,
  intro,
  valuesTitle,
  values,
  closing,
}: BergenBrandSectionProps) {
  return (
    <section aria-labelledby="bergen-brand-title" className="border-y border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="bergen-brand-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-aipify-text-secondary">
          {intro}
        </p>
        <p className="mt-8 text-center text-sm font-semibold uppercase tracking-wide text-aipify-text-muted">
          {valuesTitle}
        </p>
        <ul className="mt-4 flex flex-wrap justify-center gap-3">
          {values.map((value) => (
            <li
              key={value}
              className="rounded-full border border-aipify-border bg-aipify-surface-muted px-4 py-2 text-sm font-medium text-aipify-text"
            >
              {value}
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-relaxed text-aipify-text-secondary">
          {closing}
        </p>
      </div>
    </section>
  );
}
