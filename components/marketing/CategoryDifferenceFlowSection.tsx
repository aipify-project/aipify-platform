type FlowColumn = {
  label: string;
  steps: string[];
};

type CategoryDifferenceFlowSectionProps = {
  title: string;
  traditional: FlowColumn;
  aipify: FlowColumn;
};

function FlowDiagram({ column }: { column: FlowColumn }) {
  return (
    <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-6 sm:p-8">
      <h3 className="text-center text-lg font-semibold text-aipify-text">{column.label}</h3>
      <ol className="mt-6 space-y-0">
        {column.steps.map((step, index) => (
          <li key={step} className="flex flex-col items-center">
            <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-center text-sm text-aipify-text-secondary">
              {step}
            </div>
            {index < column.steps.length - 1 ? (
              <span className="my-2 text-lg text-aipify-companion" aria-hidden="true">
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function CategoryDifferenceFlowSection({
  title,
  traditional,
  aipify,
}: CategoryDifferenceFlowSectionProps) {
  return (
    <section aria-labelledby="category-difference-flow-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="category-difference-flow-title" className="mx-auto max-w-4xl text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <FlowDiagram column={traditional} />
          <div className="rounded-2xl border border-aipify-accent-muted bg-aipify-accent-soft/40 p-6 sm:p-8">
            <h3 className="text-center text-lg font-semibold text-aipify-companion">{aipify.label}</h3>
            <ol className="mt-6 space-y-0">
              {aipify.steps.map((step, index) => (
                <li key={step} className="flex flex-col items-center">
                  <div className="w-full rounded-xl border border-aipify-accent-muted bg-aipify-surface/90 px-4 py-3 text-center text-sm text-aipify-text">
                    {step}
                  </div>
                  {index < aipify.steps.length - 1 ? (
                    <span className="my-2 text-lg text-aipify-companion" aria-hidden="true">
                      ↓
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
