import HomepageSectionShell from "./HomepageSectionShell";

type ProblemOutcomeSectionProps = {
  title: string;
  problemLabel: string;
  problem: string;
  outcomeLabel: string;
  outcome: string;
};

export default function ProblemOutcomeSection({
  title,
  problemLabel,
  problem,
  outcomeLabel,
  outcome,
}: ProblemOutcomeSectionProps) {
  return (
    <HomepageSectionShell ariaLabelledBy="problem-outcome-title">
      <h2 id="problem-outcome-title" className="max-w-2xl text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
        {title}
      </h2>

      <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-aipify-text-muted">{problemLabel}</p>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{problem}</p>
        </div>
        <div className="rounded-2xl border border-aipify-companion/20 bg-aipify-accent-soft/30 p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-aipify-companion">{outcomeLabel}</p>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text">{outcome}</p>
        </div>
      </div>
    </HomepageSectionShell>
  );
}
