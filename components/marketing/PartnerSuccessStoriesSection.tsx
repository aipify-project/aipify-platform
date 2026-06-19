type PartnerSuccessStoriesSectionProps = {
  title: string;
  emptyMessage: string;
  futureTypes: string[];
};

export default function PartnerSuccessStoriesSection({
  title,
  emptyMessage,
  futureTypes,
}: PartnerSuccessStoriesSectionProps) {
  return (
    <section aria-labelledby="partner-success-stories-title" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 id="partner-success-stories-title" className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-6 text-sm leading-relaxed text-aipify-text-secondary">{emptyMessage}</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {futureTypes.map((type) => (
            <li
              key={type}
              className="rounded-full border border-aipify-border bg-white/5 px-4 py-2 text-xs font-medium text-aipify-text-muted"
            >
              {type}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
