import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

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
    <section aria-labelledby="partner-success-stories-title" className={PublicMarketingClasses.sectionAlt}>
      <div className={`${PublicMarketingClasses.container} py-16 sm:py-20`}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="partner-success-stories-title" className={PublicMarketingClasses.sectionTitle}>
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{emptyMessage}</p>
          <ul className="mt-8 flex flex-wrap justify-center gap-2">
            {futureTypes.map((type) => (
              <li
                key={type}
                className="rounded-full border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text-secondary"
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
