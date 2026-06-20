import Link from "next/link";
import { MarketingCtaBand, MarketingDifferentiationStrip, MarketingPageHeader, MarketingTrustSignalStrip } from "@/components/marketing";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

type ContactPath = {
  id: string;
  title: string;
  description: string;
  href: string;
  email?: string;
};

type ContactExperiencePageContentProps = {
  title: string;
  subtitle: string;
  continueLabel: string;
  paths: ContactPath[];
  ctaBand: { title: string; subtitle: string; bookDemo: string; earlyAccess: string; growthPartners: string };
  trustSignals: string[];
  differentiationThemes: string[];
  breadcrumbs?: Parameters<typeof MarketingPageHeader>[0]["breadcrumbs"];
};

export default function ContactExperiencePageContent({
  title,
  subtitle,
  continueLabel,
  paths,
  ctaBand,
  trustSignals,
  differentiationThemes,
  breadcrumbs,
}: ContactExperiencePageContentProps) {
  return (
    <>
      <MarketingPageHeader title={title} subtitle={subtitle} breadcrumbs={breadcrumbs} />
      <MarketingTrustSignalStrip signals={trustSignals} />
      <MarketingDifferentiationStrip themes={differentiationThemes} />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <article key={path.id} className={AipifyMarketingClasses.card}>
              <h2 className="font-semibold text-aipify-text">{path.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{path.description}</p>
              {path.email ? (
                <a href={`mailto:${path.email}`} className="mt-4 block text-sm font-medium text-aipify-companion hover:underline">
                  {path.email}
                </a>
              ) : null}
              <Link href={path.href} className="mt-4 inline-flex text-sm font-semibold text-aipify-companion hover:underline">
                {path.href.startsWith("mailto:") ? path.title : `${continueLabel} →`}
              </Link>
            </article>
          ))}
        </div>
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
