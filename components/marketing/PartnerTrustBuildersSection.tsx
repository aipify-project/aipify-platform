type PartnerTrustBuildersSectionProps = {
  title?: string;
  items: string[];
  compact?: boolean;
};

export default function PartnerTrustBuildersSection({
  title,
  items,
  compact = false,
}: PartnerTrustBuildersSectionProps) {
  return (
    <section aria-labelledby={title ? "partner-trust-builders-title" : undefined}>
      {title ? (
        <h3 id="partner-trust-builders-title" className="text-sm font-semibold uppercase tracking-wide text-violet-200/90">
          {title}
        </h3>
      ) : null}
      <ul className={`grid gap-2 ${title ? "mt-4" : ""} ${compact ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
        {items.map((item) => (
          <li
            key={item}
            className="rounded-xl border border-violet-500/20 bg-white/[0.03] px-3 py-2.5 text-center text-xs font-medium text-aipify-text-secondary sm:text-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
