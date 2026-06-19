type EnterpriseBuyerFitSectionProps = {
  title?: string;
  audiences: string[];
};

export default function EnterpriseBuyerFitSection({ title, audiences }: EnterpriseBuyerFitSectionProps) {
  return (
    <section aria-labelledby="enterprise-buyer-fit-title" className="border-y border-aipify-border bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {title ? (
          <h2 id="enterprise-buyer-fit-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
        ) : null}
        <ul className={`mx-auto grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3 ${title ? "mt-10" : ""}`}>
          {audiences.map((audience) => (
            <li
              key={audience}
              className="rounded-xl border border-aipify-border bg-aipify-surface-muted/50 px-4 py-3 text-center text-sm font-medium text-aipify-text-secondary"
            >
              {audience}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
