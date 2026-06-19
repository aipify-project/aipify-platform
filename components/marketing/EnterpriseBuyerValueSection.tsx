type EnterpriseBuyerValueSectionProps = {
  sectionId: string;
  title: string;
  items: string[];
  muted?: boolean;
};

export default function EnterpriseBuyerValueSection({
  sectionId,
  title,
  items,
  muted = false,
}: EnterpriseBuyerValueSectionProps) {
  return (
    <section aria-labelledby={sectionId} className={muted ? "bg-aipify-surface-muted/60" : "bg-aipify-surface"}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <h2 id={sectionId} className="text-center text-2xl font-bold tracking-tight text-aipify-text sm:text-3xl">
          {title}
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary shadow-sm"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
