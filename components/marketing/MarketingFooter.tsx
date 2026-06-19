import Link from "next/link";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { parseFooterGovernanceLabels } from "@/lib/marketing/governance/labels";
import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";

type MarketingFooterProps = {
  appName: string;
  marketing: MarketingDictionary;
};

export default function MarketingFooter({ appName, marketing }: MarketingFooterProps) {
  const labels = parseFooterGovernanceLabels(marketing);

  const productLinks = [
    { label: labels.product ?? labels.products ?? "Product", href: "/product" },
    { label: labels.businessPacks, href: "/pricing#business-packs" },
    { label: labels.enterprise, href: "/enterprise" },
    { label: labels.growthPartners, href: "/growth-partners" },
  ];

  const resourceLinks = [
    { label: labels.knowledge, href: "/knowledge" },
    { label: labels.security, href: "/security" },
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
    { label: labels.growthPartnerTerms, href: "/growth-partner-terms" },
  ];

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

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-semibold text-aipify-text">{labels.products}</h3>
              <ul className="mt-4 space-y-2.5">
                {productLinks.map((link) => (
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
              <h3 className="text-sm font-semibold text-aipify-text">{labels.knowledge}</h3>
              <ul className="mt-4 space-y-2.5">
                {resourceLinks.map((link) => (
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
          <p className="mt-3 text-[11px] font-medium tracking-wide text-aipify-text-secondary">{labels.brandSignatureLine1}</p>
          <p className="mt-0.5 text-[11px] tracking-wide text-aipify-text-muted">{labels.finalSignature}</p>
        </div>
      </div>
    </footer>
  );
}
