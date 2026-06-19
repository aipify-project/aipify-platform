type BosArchitectureDiagramSectionProps = {
  topLayerTitle: string;
  topLayerRoles: string[];
  middleLayerTitle: string;
  bottomLayerTitle: string;
  bottomLayerSystems: string[];
};

export default function BosArchitectureDiagramSection({
  topLayerTitle,
  topLayerRoles,
  middleLayerTitle,
  bottomLayerTitle,
  bottomLayerSystems,
}: BosArchitectureDiagramSectionProps) {
  return (
    <section aria-labelledby="bos-diagram-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="bos-diagram-title" className="sr-only">
          {middleLayerTitle}
        </h2>
        <div className="space-y-4">
          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{topLayerTitle}</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-3">
              {topLayerRoles.map((role) => (
                <li
                  key={role}
                  className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text"
                >
                  {role}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center" aria-hidden="true">
            <span className="text-xl text-aipify-companion">↓</span>
          </div>

          <div className="rounded-2xl border-2 border-aipify-companion/30 bg-gradient-to-r from-aipify-accent-soft/80 to-violet-50/80 px-6 py-8 text-center shadow-sm">
            <p className="text-lg font-bold tracking-tight text-aipify-companion sm:text-xl">{middleLayerTitle}</p>
          </div>

          <div className="flex justify-center" aria-hidden="true">
            <span className="text-xl text-aipify-companion">↓</span>
          </div>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6">
            <p className="text-center text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">
              {bottomLayerTitle}
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {bottomLayerSystems.map((system) => (
                <li
                  key={system}
                  className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-center text-sm text-aipify-text-secondary"
                >
                  {system}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
