import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

export type MarketingFooterLabels = {
  tagline: string;
  companyName: string;
  headquarters: string;
  businessOperatingSystem: string;
  description: string;
  signature: string;
  brandSignatureLine1: string;
  brandSignatureLine2: string;
  finalSignature: string;
  foundingPrinciple: string;
  product: string;
  company: string;
  legal: string;
  privacy: string;
  terms: string;
  security: string;
  knowledge: string;
  growthPartnerTerms: string;
  contact: string;
  earlyAccess: string;
  bookDemo: string;
  growthPartners: string;
  copyright: string;
  privacyNote: string;
};

type MarketingFooterProps = {
  appName: string;
  labels: MarketingFooterLabels;
};

export default function MarketingFooter({ appName, labels }: MarketingFooterProps) {
  return (
    <footer className={AipifyMarketingClasses.footer}>
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
              <span className="text-lg font-semibold text-aipify-text">{appName}</span>
            </Link>
            <div className="mt-5 space-y-1 text-sm">
              <p className="font-semibold text-aipify-text">{labels.companyName}</p>
              <p className="text-aipify-text-secondary">{labels.headquarters}</p>
              <p className="text-aipify-text-muted">{labels.businessOperatingSystem}</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-aipify-text-secondary">{labels.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-aipify-accent">{labels.privacyNote}</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.product}</h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Product", href: "/product" },
                  { label: "Why Aipify", href: "/why-aipify" },
                  { label: "Enterprise", href: "/enterprise" },
                  { label: labels.security, href: "/security" },
                ].map((link) => (
                  <li key={link.href}>
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
                {[
                  { label: labels.contact, href: "/contact" },
                  { label: labels.knowledge, href: "/knowledge" },
                  { label: labels.growthPartners, href: "/growth-partners" },
                  { label: labels.earlyAccess, href: "/early-access" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.legal}</h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: labels.privacy, href: "/privacy" },
                  { label: labels.terms, href: "/terms" },
                  { label: labels.growthPartnerTerms, href: "/growth-partner-terms" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-aipify-text-secondary transition hover:text-aipify-companion">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-aipify-border pt-8 text-center text-xs text-aipify-text-muted">
          <p>{labels.copyright}</p>
          <p className="mt-3 text-[11px] font-medium tracking-wide text-aipify-text-secondary">
            {labels.brandSignatureLine1}
          </p>
          <p className="mt-0.5 text-[11px] tracking-wide text-aipify-text-muted">
            {labels.finalSignature}
          </p>
        </div>
      </div>
    </footer>
  );
}
