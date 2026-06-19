type WhatIsBosSectionProps = {
  title: string;
  paragraphs: string[];
};

export default function WhatIsBosSection({ title, paragraphs }: WhatIsBosSectionProps) {
  return (
    <section id="what-is-bos" aria-labelledby="what-is-bos-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="what-is-bos-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <div className="mt-8 space-y-4 text-center text-base leading-relaxed text-aipify-text-secondary">
          {paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
