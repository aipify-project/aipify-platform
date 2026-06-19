type HumanApprovalModelSectionProps = {
  title: string;
  statements: string[];
};

export default function HumanApprovalModelSection({ title, statements }: HumanApprovalModelSectionProps) {
  return (
    <section aria-labelledby="human-approval-model-title" className="border-y border-aipify-companion/20 bg-aipify-accent-soft/40">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="human-approval-model-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 space-y-3">
          {statements.map((statement) => (
            <li
              key={statement}
              className="rounded-2xl border border-aipify-border bg-aipify-surface px-6 py-4 text-base font-medium text-aipify-text"
            >
              {statement}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
