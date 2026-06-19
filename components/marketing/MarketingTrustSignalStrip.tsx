type MarketingTrustSignalStripProps = {
  signals: string[];
};

export default function MarketingTrustSignalStrip({ signals }: MarketingTrustSignalStripProps) {
  if (signals.length === 0) return null;

  return (
    <section aria-label="Trust signals" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {signals.map((signal) => (
            <li
              key={signal}
              className="rounded-full border border-aipify-border bg-aipify-surface px-3 py-1.5 text-xs font-medium text-aipify-text-secondary"
            >
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
