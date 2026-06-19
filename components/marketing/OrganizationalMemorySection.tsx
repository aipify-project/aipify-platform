type OrganizationalMemorySectionProps = {
  title: string;
  problems: string[];
  closing: string;
};

export default function OrganizationalMemorySection({ title, problems, closing }: OrganizationalMemorySectionProps) {
  return (
    <section aria-labelledby="organizational-memory-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="organizational-memory-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-10 space-y-3">
          {problems.map((problem) => (
            <li key={problem} className="text-base text-aipify-text-secondary">
              {problem}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-base leading-relaxed text-aipify-text">{closing}</p>
      </div>
    </section>
  );
}
