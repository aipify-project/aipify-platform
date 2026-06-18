import Link from "next/link";

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
    <footer className="border-t border-white/10 bg-[#070a0f]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white">
                A
              </span>
              <span className="text-lg font-semibold text-white">{appName}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">{labels.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-cyan-400/80">{labels.privacyNote}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{labels.product}</h3>
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
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{labels.company}</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: labels.growthPartners, href: "/growth-partners" },
                { label: "Pilot", href: "/pilot" },
                { label: "Knowledge", href: "/knowledge" },
                { label: labels.contact, href: "/contact" },
                { label: labels.earlyAccess, href: "/early-access" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">{labels.legal}</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/privacy" className="text-sm text-slate-400 transition hover:text-white">
                  {labels.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-400 transition hover:text-white">
                  {labels.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="mx-auto max-w-xl text-center">
            <Link
              href="/book-demo"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:from-cyan-400 hover:to-violet-500"
            >
              {labels.bookDemo}
            </Link>
          </div>
          <div className="mx-auto mt-10 max-w-2xl space-y-2 text-center text-sm text-slate-400">
            <p className="font-semibold text-white">{labels.companyName}</p>
            <p>{labels.headquarters}</p>
            <p className="leading-relaxed">{labels.description}</p>
            <p className="font-medium text-cyan-400/90">{labels.signature}</p>
            <p className="text-xs text-slate-500">{labels.foundingPrinciple}</p>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {labels.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
