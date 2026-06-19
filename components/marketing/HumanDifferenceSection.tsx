type HumanDifferenceSectionProps = {
  title: string;
  paragraphs: string[];
  compact?: boolean;
};

export default function HumanDifferenceSection({ title, paragraphs, compact = false }: HumanDifferenceSectionProps) {
  return (
    <section aria-labelledby="human-difference-title" className="border-y border-aipify-border bg-aipify-accent-soft/30">
      <div className={`mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8 ${compact ? "py-12 lg:py-14" : "py-16 lg:py-20"}`}>
        <h2 id="human-difference-title" className="text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {title}
        </h2>
        <div className="mt-5 space-y-3 text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
