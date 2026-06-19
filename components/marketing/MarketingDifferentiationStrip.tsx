type MarketingDifferentiationStripProps = {
  themes: string[];
};

/** Phase 393 — compact reinforcement of category differentiation on secondary marketing pages. */
export default function MarketingDifferentiationStrip({ themes }: MarketingDifferentiationStripProps) {
  if (themes.length === 0) return null;

  return (
    <section aria-label="Aipify differentiation" className="border-y border-aipify-border bg-aipify-accent-soft/25">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {themes.map((theme) => (
            <li
              key={theme}
              className="rounded-full border border-aipify-companion/20 bg-aipify-surface px-3 py-1.5 text-xs font-medium text-aipify-companion sm:text-sm"
            >
              {theme}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
