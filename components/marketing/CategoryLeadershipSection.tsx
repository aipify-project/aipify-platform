type CategoryLeadershipSectionProps = {
  title: string;
  paragraphs: string[];
};

export default function CategoryLeadershipSection({ title, paragraphs }: CategoryLeadershipSectionProps) {
  return (
    <section aria-labelledby="category-leadership-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
        <h2 id="category-leadership-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
