type CompanionPhilosophySectionProps = {
  title: string;
  paragraphs: string[];
  principles: string[];
};

export default function CompanionPhilosophySection({
  title,
  paragraphs,
  principles,
}: CompanionPhilosophySectionProps) {
  return (
    <section aria-labelledby="companion-philosophy-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="companion-philosophy-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-6 space-y-4 text-center text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <ul className="mx-auto mt-8 max-w-md space-y-3">
          {principles.map((principle) => (
            <li key={principle} className="flex gap-3 text-sm text-aipify-text-secondary">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
              {principle}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
