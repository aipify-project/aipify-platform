type MarketingNarrativeSectionProps = {
  id?: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  bulletsTitle?: string;
  muted?: boolean;
};

export default function MarketingNarrativeSection({
  id,
  title,
  paragraphs,
  bullets,
  bulletsTitle,
  muted = false,
}: MarketingNarrativeSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={muted ? "border-y border-aipify-border bg-aipify-surface-muted/60" : "bg-aipify-surface"}
    >
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2
          id={id ? `${id}-title` : undefined}
          className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl"
        >
          {title}
        </h2>
        <div className="mt-8 space-y-4 text-center text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {bullets && bullets.length > 0 ? (
          <div className="mt-10">
            {bulletsTitle ? (
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-aipify-text-muted">
                {bulletsTitle}
              </p>
            ) : null}
            <ul className={`mt-4 grid gap-3 sm:grid-cols-2 ${bulletsTitle ? "" : ""}`}>
              {bullets.map((item) => (
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
