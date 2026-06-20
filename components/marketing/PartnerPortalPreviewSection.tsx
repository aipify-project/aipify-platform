import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";

type PartnerPortalPreviewSectionProps = {
  title: string;
  items: string[];
};

export default function PartnerPortalPreviewSection({ title, items }: PartnerPortalPreviewSectionProps) {
  return (
    <section aria-labelledby="partner-portal-preview-title" className={`${PublicMarketingClasses.sectionAlt} py-16 sm:py-20`}>
      <div className={PublicMarketingClasses.containerWide}>
        <h2 id="partner-portal-preview-title" className={`text-center ${PublicMarketingClasses.sectionHeading}`}>
          {title}
        </h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <li
              key={item}
              className={`flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-aipify-border bg-aipify-surface p-4 text-center text-sm font-medium text-aipify-text-secondary shadow-sm`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
