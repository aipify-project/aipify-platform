type CompetitivePositioningSectionProps = {
  title: string;
  paragraphs: string[];
};

export default function CompetitivePositioningSection({ title, paragraphs }: CompetitivePositioningSectionProps) {
  return (
    <section aria-labelledby="competitive-positioning-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h2
          id="competitive-positioning-title"
          className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl"
        >
          {title}
        </h2>
        <div className="mt-6 space-y-4 text-center text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
