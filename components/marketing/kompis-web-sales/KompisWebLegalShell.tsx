import Image from "next/image";
import Link from "next/link";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import "./kompis-web-sales.css";

const BRAND_MARK = "/brand/aipify-kompis-avatar.png";

type Props = {
  labels: KompisWebSalesLabels;
  appName: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

/**
 * Thin public chrome for Privacy/Terms — same header/footer family as the sales homepage.
 * Does not remount MarketingNavbar (legacy mega-nav).
 */
export default function KompisWebLegalShell({
  labels,
  appName,
  title,
  subtitle,
  children,
}: Props) {
  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={BRAND_MARK} alt="" width={40} height={40} priority />
            <span>{appName}</span>
          </Link>
          <div className="kompis-web-sales-nav-actions">
            <Link href={labels.hrefs.login} className="kompis-web-sales-secondary">
              {labels.nav.login}
            </Link>
            <Link href={labels.hrefs.start} className="kompis-web-sales-primary">
              {labels.nav.startFree}
            </Link>
          </div>
        </div>
      </header>

      <main className="kompis-web-sales-shell" style={{ paddingBlock: "40px 64px", maxWidth: 760 }}>
        <p className="kompis-web-sales-eyebrow">{appName}</p>
        <h1 className="kompis-web-sales-display" style={{ fontSize: "clamp(1.75rem, 3vw, 2.35rem)" }}>
          {title}
        </h1>
        {subtitle ? <p className="kompis-web-sales-lead">{subtitle}</p> : null}
        <div style={{ marginTop: 28 }}>{children}</div>
      </main>

      <footer className="kompis-web-sales-footer">
        <div className="kompis-web-sales-shell kompis-web-sales-footer-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand">
            <Image src={BRAND_MARK} alt="" width={32} height={32} />
            <span>{labels.footer.tagline}</span>
          </Link>
          <nav className="kompis-web-sales-footer-links" aria-label={labels.footer.home}>
            <Link href={labels.hrefs.home}>{labels.footer.home}</Link>
            <Link href={labels.hrefs.privacy}>{labels.footer.privacy}</Link>
            <Link href={labels.hrefs.terms}>{labels.footer.terms}</Link>
            <Link href={labels.hrefs.contact}>{labels.footer.contact}</Link>
            <Link href={labels.hrefs.becomeSeller}>{labels.footer.becomeSeller}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
