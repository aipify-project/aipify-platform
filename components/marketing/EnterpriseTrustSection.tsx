type TrustPoint = { title: string; description: string };

type EnterpriseTrustSectionProps = {
  title: string;
  subtitle: string;
  points: TrustPoint[];
};

const ICONS = [
  "M12 21a9 9 0 100-18 9 9 0 000 18z",
  "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
  "M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z",
];

export default function EnterpriseTrustSection({
  title,
  subtitle,
  points,
}: EnterpriseTrustSectionProps) {
  return (
    <section className="border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="enterprise-trust-title">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="enterprise-trust-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point, i) => (
            <li
              key={point.title}
              className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm transition hover:border-aipify-companion/30"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-aipify-accent-soft">
                <svg className="h-5 w-5 text-aipify-companion" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d={ICONS[i % ICONS.length]} />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-aipify-text">{point.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{point.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
