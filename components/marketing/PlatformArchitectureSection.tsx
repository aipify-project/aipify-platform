type Layer = { label: string; description: string };

type PlatformArchitectureSectionProps = {
  title: string;
  subtitle: string;
  layers: Layer[];
};

export default function PlatformArchitectureSection({ title, subtitle, layers }: PlatformArchitectureSectionProps) {
  return (
    <section id="platform-architecture" className="scroll-mt-20 border-y border-aipify-border bg-aipify-surface-muted/60" aria-labelledby="platform-architecture-title">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="platform-architecture-title" className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
            {title}
          </h2>
          <p className="mt-3 text-aipify-text-secondary">{subtitle}</p>
        </div>

        <div className="mx-auto mt-10 max-w-lg">
          <ol className="relative space-y-0">
            {layers.map((layer, i) => (
              <li key={layer.label} className="relative flex flex-col items-center">
                <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-5 py-4 text-center shadow-sm">
                  <p className="text-sm font-semibold text-aipify-text">{layer.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-aipify-text-secondary">{layer.description}</p>
                </div>
                {i < layers.length - 1 ? (
                  <div className="flex flex-col items-center py-2" aria-hidden="true">
                    <span className="h-4 w-px bg-aipify-border" />
                    <span className="text-aipify-text-muted">↓</span>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
