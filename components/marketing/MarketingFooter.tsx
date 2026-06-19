import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";

export type MarketingFooterLabels = {
  tagline: string;
  companyName: string;
  headquarters: string;
  description: string;
  signature: string;
  foundingPrinciple: string;
  product: string;
  company: string;
  legal: string;
  privacy: string;
  terms: string;
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
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
              <span className="text-lg font-semibold text-aipify-text">{appName}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-aipify-text-secondary">{labels.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-aipify-accent">{labels.privacyNote}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-aipify-text">{labels.product}</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Product", href: "/product" },
                { label: "Why Aipify", href: "/why-aipify" },
                { label: "Customer Stories", href: "/customer-stories" },
                { label: "Pricing", href: "/pricing" },
                { label: "Enterprise", href: "/enterprise" },
                { label: "Security", href: "/security" },
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
                { label: labels.growthPartners, href: "/growth-partners" },
                { label: labels.growthPartnerTerms, href: "/growth-partner-terms" },
                { label: "Pilot", href: "/pilot" },
                { label: "Knowledge", href: "/knowledge" },
                { label: labels.contact, href: "/contact" },
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
                { label: labels.bookDemo, href: "/book-demo" },
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

        <div className="mt-12 border-t border-aipify-border pt-8 text-center text-xs text-aipify-text-muted">
          <p>{labels.copyright}</p>
          <p className="mt-2">{labels.signature}</p>
        </div>
      </div>
    </footer>
  );
}
