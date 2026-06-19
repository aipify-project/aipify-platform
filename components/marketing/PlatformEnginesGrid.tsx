type Engine = { name: string; description: string };

type PlatformEnginesGridProps = {
  title: string;
  subtitle: string;
  engines: Engine[];
};

export default function PlatformEnginesGrid({ title, subtitle, engines }: PlatformEnginesGridProps) {
  return (
    <section aria-labelledby="platform-engines-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="platform-engines-title" className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {engines.map((engine) => (
            <li
              key={engine.name}
              className="rounded-xl border border-aipify-border bg-aipify-surface p-4 shadow-sm transition hover:border-aipify-accent-muted"
            >
              <h3 className="text-sm font-semibold text-aipify-text">{engine.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-aipify-text-secondary">{engine.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
