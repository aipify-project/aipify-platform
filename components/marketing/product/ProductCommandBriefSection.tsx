import CommandBriefMockup from "@/components/marketing/homepage/CommandBriefMockup";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductCommandBriefSectionProps = {
  section: ProductPageContent["commandBriefSection"];
};

export default function ProductCommandBriefSection({ section }: ProductCommandBriefSectionProps) {
  return (
    <section id="command-brief" className={`scroll-mt-20 ${AipifyMarketingClasses.sectionAlt}`} aria-labelledby="product-command-brief-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-start lg:gap-14">
          <div className="max-w-xl">
            <h2 id="product-command-brief-title" className={PublicMarketingClasses.sectionHeading}>
              {section.title}
            </h2>
            {section.subtitle ? (
              <p className={PublicMarketingClasses.sectionSubtitle}>{section.subtitle}</p>
            ) : null}

            <ul className="mt-8 space-y-5">
              {section.points.map((point) => (
                <li key={point.title} className={PublicMarketingClasses.card}>
                  <h3 className={PublicMarketingClasses.cardTitle}>{point.title}</h3>
                  <p className={PublicMarketingClasses.cardBody}>{point.body}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <CommandBriefMockup labels={section.demo} />
          </div>
        </div>
      </div>
    </section>
  );
}
