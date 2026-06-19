type BusinessPack = { name: string; description: string };

type BusinessPackPreviewSectionProps = {
  title: string;
  subtitle: string;
  packs: BusinessPack[];
};

export default function BusinessPackPreviewSection({ title, subtitle, packs }: BusinessPackPreviewSectionProps) {
  return (
    <section aria-labelledby="business-pack-preview-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="business-pack-preview-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{subtitle}</p>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packs.map((pack) => (
            <li key={pack.name} className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm">
              <h3 className="text-base font-semibold text-aipify-companion">{pack.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{pack.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
