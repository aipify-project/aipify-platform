type ProductDepthSectionProps = {
  title: string;
  capabilities: string[];
};

export default function ProductDepthSection({ title, capabilities }: ProductDepthSectionProps) {
  return (
    <section aria-labelledby="product-depth-title" className="border-y border-aipify-border bg-aipify-surface-muted/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="product-depth-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>
        <ul className="mt-12 flex flex-wrap justify-center gap-3">
          {capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
            >
              {capability}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
