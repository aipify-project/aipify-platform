type First30DaysMilestone = { day: string; label: string };

type First30DaysSectionProps = {
  title: string;
  milestones: First30DaysMilestone[];
};

export default function First30DaysSection({ title, milestones }: First30DaysSectionProps) {
  return (
    <section aria-labelledby="first-30-days-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="first-30-days-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ol className="mt-12 space-y-4">
          {milestones.map((milestone) => (
            <li
              key={milestone.label}
              className="flex flex-col gap-2 rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <span className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">{milestone.day}</span>
              <span className="text-base font-medium text-aipify-text">{milestone.label}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
