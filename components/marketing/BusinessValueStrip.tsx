type ValueCard = { title: string; description: string };

type BusinessValueStripProps = {
  title: string;
  cards: ValueCard[];
};

export default function BusinessValueStrip({ title, cards }: BusinessValueStripProps) {
  return (
    <section aria-labelledby="value-strip-title" className="border-b border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <h2 id="value-strip-title" className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <li
              key={card.title}
              className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 text-center shadow-sm"
            >
              <h3 className="text-lg font-semibold text-aipify-text">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-aipify-text-secondary">{card.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
