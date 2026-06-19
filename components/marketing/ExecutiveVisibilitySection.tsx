type ExecutiveVisibilitySectionProps = {
  title: string;
  paragraphs: string[];
  highlightsTitle?: string;
  highlights: string[];
};

export default function ExecutiveVisibilitySection({
  title,
  paragraphs,
  highlightsTitle,
  highlights,
}: ExecutiveVisibilitySectionProps) {
  return (
    <section aria-labelledby="executive-visibility-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="executive-visibility-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <div className="mt-5 space-y-3 text-base leading-relaxed text-aipify-text-secondary">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        {highlights.length > 0 ? (
          <div className="mx-auto mt-10 max-w-4xl">
            {highlightsTitle ? (
              <p className="text-center text-sm font-semibold text-aipify-text">{highlightsTitle}</p>
            ) : null}
            <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${highlightsTitle ? "mt-4" : ""}`}>
              {highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-sm text-aipify-text-secondary"
                >
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
