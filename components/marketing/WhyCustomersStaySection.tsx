type WhyCustomersStaySectionProps = {
  title: string;
  items: string[];
};

export default function WhyCustomersStaySection({ title, items }: WhyCustomersStaySectionProps) {
  return (
    <section aria-labelledby="why-customers-stay-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="why-customers-stay-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-aipify-border bg-aipify-surface-muted/60 px-4 py-3 text-sm text-aipify-text-secondary"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
