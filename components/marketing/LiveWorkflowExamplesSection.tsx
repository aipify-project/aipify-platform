type WorkflowFlow = { title: string; steps: string[] };

type LiveWorkflowExamplesSectionProps = {
  title: string;
  flows: WorkflowFlow[];
};

export default function LiveWorkflowExamplesSection({ title, flows }: LiveWorkflowExamplesSectionProps) {
  return (
    <section aria-labelledby="live-workflows-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="live-workflows-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {flows.map((flow) => (
            <div key={flow.title} className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6">
              <h3 className="text-center text-sm font-semibold uppercase tracking-wide text-aipify-companion">{flow.title}</h3>
              <ol className="mt-6 space-y-0">
                {flow.steps.map((step, index) => (
                  <li key={step} className="flex flex-col items-center">
                    <div className="w-full rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-center text-sm text-aipify-text-secondary">
                      {step}
                    </div>
                    {index < flow.steps.length - 1 ? (
                      <span className="my-2 text-lg text-aipify-companion" aria-hidden="true">
                        ↓
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
