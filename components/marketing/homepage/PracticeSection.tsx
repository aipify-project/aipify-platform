import type { HomepagePracticeExample } from "@/lib/marketing/parse-homepage";
import HomepageSectionShell from "./HomepageSectionShell";

type PracticeSectionProps = {
  title: string;
  subtitle: string;
  illustrativeLabel: string;
  exampleLabel: string;
  examples: HomepagePracticeExample[];
};

export default function PracticeSection({
  title,
  subtitle,
  illustrativeLabel,
  exampleLabel,
  examples,
}: PracticeSectionProps) {
  return (
    <HomepageSectionShell ariaLabelledBy="practice-title">
      <div className="max-w-2xl">
        <h2 id="practice-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{subtitle}</p> : null}
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{illustrativeLabel}</p>
      </div>

      <ol className="mt-10 grid gap-5 lg:grid-cols-3">
        {examples.map((example, index) => (
          <li key={example.title} className="flex flex-col rounded-2xl border border-aipify-border bg-aipify-surface p-6 shadow-sm">
            <span className="text-xs font-semibold text-aipify-text-muted">
              {exampleLabel} {index + 1}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-aipify-text">{example.title}</h3>
            <dl className="mt-4 flex flex-1 flex-col gap-4 text-sm">
              <div>
                <dt className="font-semibold text-aipify-text">Challenge</dt>
                <dd className="mt-1 leading-relaxed text-aipify-text-secondary">{example.challenge}</dd>
              </div>
              <div>
                <dt className="font-semibold text-aipify-text">How Aipify coordinates</dt>
                <dd className="mt-1 leading-relaxed text-aipify-text-secondary">{example.coordination}</dd>
              </div>
              <div>
                <dt className="font-semibold text-aipify-text">Outcome</dt>
                <dd className="mt-1 leading-relaxed text-aipify-text">{example.outcome}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ol>
    </HomepageSectionShell>
  );
}
