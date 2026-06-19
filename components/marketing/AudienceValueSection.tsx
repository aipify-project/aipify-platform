type AudienceValueSectionProps = {
  id: string;
  title: string;
  paragraphs: string[];
  benefitsTitle?: string;
  benefits: string[];
  muted?: boolean;
};

export default function AudienceValueSection({
  id,
  title,
  paragraphs,
  benefitsTitle,
  benefits,
  muted = false,
}: AudienceValueSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={muted ? "border-y border-aipify-border bg-aipify-surface-muted/60" : "bg-aipify-surface"}
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id={`${id}-title`} className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
          <div className="mt-5 space-y-3 text-base leading-relaxed text-aipify-text-secondary">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        {benefits.length > 0 ? (
          <div className="mx-auto mt-10 max-w-4xl">
            {benefitsTitle ? (
              <p className="text-center text-sm font-semibold text-aipify-text">{benefitsTitle}</p>
            ) : null}
            <ul className={`grid gap-3 sm:grid-cols-2 ${benefitsTitle ? "mt-4" : ""}`}>
              {benefits.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
