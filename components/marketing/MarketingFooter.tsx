import Link from "next/link";
import { Suspense } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import GlobalFooterLanguageSelector from "@/components/marketing/GlobalFooterLanguageSelector";
import { resolvePublicFooterLocale } from "@/lib/i18n/public-locales";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { parseFooterGovernanceLabels } from "@/lib/marketing/governance/labels";
import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";

type MarketingFooterProps = {
  appName: string;
  marketing: MarketingDictionary;
  locale: string;
};

export default function MarketingFooter({ appName, marketing, locale }: MarketingFooterProps) {
  const labels = parseFooterGovernanceLabels(marketing);
  const currentLocale = resolvePublicFooterLocale(locale);

  const productLinks = [
    { label: labels.product ?? labels.products ?? "Product", href: "/product" },
    { label: labels.businessPacks, href: "/pricing#business-packs" },
    { label: labels.enterprise, href: "/enterprise" },
    { label: labels.partners ?? labels.growthPartners, href: "/growth-partners" },
  ];

  const resourceLinks = [
    { label: labels.resources ?? labels.knowledge, href: "/knowledge" },
    { label: labels.contact, href: "/contact" },
  ];

  const companyLinks = [
    { label: labels.companyPage, href: "/company" },
    { label: labels.careers, href: "/careers" },
    { label: labels.media, href: "/media" },
  ];

  const legalLinks = [
    { label: labels.privacy, href: "/privacy" },
    { label: labels.terms, href: "/terms" },
    { label: labels.security, href: "/security" },
  ];

  return (
    <footer className={AipifyMarketingClasses.footer}>
      <div className="mx-auto max-w-[87.5rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
              <span className="text-lg font-semibold text-aipify-text">{appName}</span>
            </Link>
            <div className="mt-5 space-y-1 text-sm text-aipify-text-secondary">
              <p className="font-semibold text-aipify-text">{labels.companyName}</p>
              {labels.address ? <p>{labels.address}</p> : <p>{labels.headquarters}</p>}
              {labels.organizationNumber ? <p>{labels.organizationNumber}</p> : null}
              {labels.supportEmail ? (
                <p>
                  <a href={`mailto:${labels.supportEmail}`} className="transition hover:text-aipify-companion">
                    {labels.supportEmail}
                  </a>
                </p>
              ) : null}
            </div>
            {labels.tagline ? (
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-aipify-text-secondary">{labels.tagline}</p>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.product ?? labels.products}</h3>
              <ul className="mt-4 space-y-2.5">
                {productLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.resources ?? labels.knowledge}</h3>
              <ul className="mt-4 space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.company}</h3>
              <ul className="mt-4 space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.legal ?? "Legal"}</h3>
              <ul className="mt-4 space-y-2.5">
                {legalLinks.map((link) => (
                  <li key={link.href + link.label}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Suspense fallback={null}>
          <GlobalFooterLanguageSelector
            currentLocale={currentLocale}
            labels={{
              title: labels.languageRegion ?? "Language & region",
              hint: labels.languageRegionHint ?? "",
              activeLanguage: labels.languageActive ?? "Active language",
              changeLanguage: labels.languageChange ?? "Change language",
              switchFailed: labels.languageSwitchFailed ?? "Language switch failed.",
              retry: labels.languageRetry ?? "Retry",
            }}
          />
        </Suspense>

        <div className="mt-10 border-t border-aipify-border pt-6 text-center text-xs text-aipify-text-muted">
          <p>{labels.copyright}</p>
          <p className="mt-2 text-[11px] font-medium tracking-wide text-aipify-text-secondary">{labels.finalSignature}</p>
        </div>
      </div>
    </footer>
  );
}
