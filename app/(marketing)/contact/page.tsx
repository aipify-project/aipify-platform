import type { Metadata } from "next";
import Link from "next/link";
import { MarketingCtaBand, MarketingPageHeader, MarketingTrustSignalStrip } from "@/components/marketing";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";
import { getSection, parseCtaBandLabels, parseStringList } from "@/lib/marketing/parse-marketing";

export async function generateMetadata(): Promise<Metadata> {
  const { marketing } = await getMarketingContext();
  const meta = getSection<{ contactTitle?: string; contactDescription?: string }>(marketing, "meta");
  return { title: meta.contactTitle, description: meta.contactDescription };
}

export default async function ContactPage() {
  const { marketing } = await getMarketingContext();
  const contact = getSection<Record<string, string>>(marketing, "contact");
  const primaryCtas = getSection<Record<string, string>>(marketing, "primaryCtas");
  const ctaBand = parseCtaBandLabels(marketing);
  const trustSignals = parseStringList(marketing, "trustSignalStrip", "signals");

  return (
    <>
      <MarketingPageHeader title={contact.title ?? ""} subtitle={contact.subtitle} />
      <MarketingTrustSignalStrip signals={trustSignals} />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-aipify-border bg-aipify-surface p-8 shadow-sm">
          <p className="text-sm font-medium text-aipify-text-secondary">{contact.emailLabel}</p>
          <a
            href={`mailto:${contact.emailValue}`}
            className="mt-2 block text-lg font-semibold text-aipify-companion hover:text-aipify-companion-hover"
          >
            {contact.emailValue}
          </a>
          <p className="mt-6 text-sm text-aipify-text-muted">{contact.note}</p>
          <Link
            href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
            className={`mt-8 inline-flex ${AipifyMarketingClasses.primaryCta} px-6 py-3`}
          >
            {primaryCtas.bookDemo ?? ctaBand.bookDemo}
          </Link>
        </div>
      </div>
      <MarketingCtaBand {...ctaBand} />
    </>
  );
}
