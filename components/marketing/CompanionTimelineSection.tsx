type TimelineMilestone = {
  period: string;
  description: string;
};

type CompanionTimelineSectionProps = {
  title: string;
  milestones: TimelineMilestone[];
};

export default function CompanionTimelineSection({ title, milestones }: CompanionTimelineSectionProps) {
  return (
    <section aria-labelledby="companion-timeline-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="companion-timeline-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {milestones.map((milestone) => (
            <li key={milestone.period} className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-companion">{milestone.period}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{milestone.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
