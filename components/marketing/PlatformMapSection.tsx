type MapNode = { name: string; description: string };

type PlatformMapSectionProps = {
  title: string;
  subtitle: string;
  centerLabel: string;
  nodes: MapNode[];
};

export default function PlatformMapSection({ title, subtitle, centerLabel, nodes }: PlatformMapSectionProps) {
  return (
    <section aria-labelledby="platform-map-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="platform-map-title" className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <div className="relative mx-auto mt-10 max-w-4xl">
          <div className="flex justify-center">
            <div className="rounded-2xl border-2 border-aipify-companion/30 bg-aipify-accent-soft px-8 py-5 text-center shadow-md">
              <p className="text-lg font-bold text-aipify-companion">{centerLabel}</p>
            </div>
          </div>

          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nodes.map((node) => (
              <li
                key={node.name}
                className="relative rounded-xl border border-aipify-border bg-aipify-surface p-4 shadow-sm before:absolute before:-top-3 before:left-1/2 before:h-3 before:w-px before:-translate-x-1/2 before:bg-aipify-border"
              >
                <h3 className="text-sm font-semibold text-aipify-text">{node.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-aipify-text-secondary">{node.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
