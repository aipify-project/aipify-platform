type Badge = { label: string; description: string };
type Stat = { value: string; label: string };

type PartnerAuthoritySectionProps = {
  title: string;
  subtitle: string;
  badges: Badge[];
  stats: Stat[];
  ecosystemNote: string;
};

export default function PartnerAuthoritySection({ title, subtitle, badges, stats, ecosystemNote }: PartnerAuthoritySectionProps) {
  return (
    <section className="border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="partner-authority-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="partner-authority-title" className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((badge) => (
            <li key={badge.label} className="rounded-xl border border-aipify-border bg-aipify-surface p-4 text-center shadow-sm">
              <span className="inline-flex rounded-full border border-aipify-accent-muted bg-aipify-accent-soft px-3 py-1 text-xs font-semibold text-aipify-companion">
                {badge.label}
              </span>
              <p className="mt-3 text-xs leading-relaxed text-aipify-text-secondary">{badge.description}</p>
            </li>
          ))}
        </ul>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-aipify-border bg-aipify-surface px-4 py-3 text-center">
              <dt className="text-xl font-bold text-aipify-text">{stat.value}</dt>
              <dd className="mt-1 text-xs text-aipify-text-muted">{stat.label}</dd>
            </div>
          ))}
        </dl>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-aipify-text-secondary">{ecosystemNote}</p>
      </div>
    </section>
  );
}
