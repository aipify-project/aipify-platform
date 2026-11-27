import Image from "next/image";
import Link from "next/link";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import type { PublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import KompisWebSalesLocaleSwitcher from "./KompisWebSalesLocaleSwitcher";
import "./kompis-web-sales.css";

const BRAND_MARK = "/brand/aipify-kompis-avatar.png";

type Props = {
  labels: KompisWebSalesLabels;
  appName: string;
  locale: PublicFooterEnabledLocale;
  children: React.ReactNode;
  /** Content max width; legal pages stay narrow, seller/contact can be wider. */
  contentMaxWidth?: number | string;
  title?: string;
  subtitle?: string;
  /** When false, omit page title block (caller supplies its own hero). */
  showTitle?: boolean;
  /** Extra class on the main content shell. */
  mainClassName?: string;
};

/**
 * Shared public sales chrome for Kompis Web surfaces.
 * Same header/footer family as the homepage — never the legacy mega-nav.
 */
export default function KompisWebSalesChrome({
  labels,
  appName,
  locale,
  children,
  contentMaxWidth = 760,
  title,
  subtitle,
  showTitle = true,
  mainClassName,
}: Props) {
  const maxWidth =
    typeof contentMaxWidth === "number" ? `${contentMaxWidth}px` : contentMaxWidth;

  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={BRAND_MARK} alt="" width={40} height={40} priority />
            <span>{appName}</span>
          </Link>
          <nav className="kompis-web-sales-nav-links" aria-label={labels.footer.product}>
            <Link href={`${labels.hrefs.home}#product`}>{labels.nav.product}</Link>
            <Link href={`${labels.hrefs.home}#how`}>{labels.nav.how}</Link>
            <Link href={`${labels.hrefs.home}#pricing`}>{labels.nav.pricing}</Link>
            <Link href={labels.hrefs.faq}>{labels.nav.faq}</Link>
          </nav>
          <div className="kompis-web-sales-nav-actions">
            <KompisWebSalesLocaleSwitcher
              locale={locale}
              languageMenuLabel={labels.nav.languageMenu}
              languageSwitchFailed={labels.nav.languageSwitchFailed}
            />
            <Link href={labels.hrefs.login} className="kompis-web-sales-secondary">
              {labels.nav.login}
            </Link>
            <Link
              href={labels.hrefs.start}
              className="kompis-web-sales-primary"
              {...marketingDataAttr("cta_click", "kompis_web_sales_chrome_start_free")}
            >
              {labels.nav.startFree}
            </Link>
          </div>
        </div>
        <div className="kompis-web-sales-shell kompis-web-sales-mobile-nav" aria-label={labels.footer.product}>
          <Link href={`${labels.hrefs.home}#product`}>{labels.nav.product}</Link>
          <Link href={`${labels.hrefs.home}#how`}>{labels.nav.how}</Link>
          <Link href={`${labels.hrefs.home}#pricing`}>{labels.nav.pricing}</Link>
          <Link href={labels.hrefs.faq}>{labels.nav.faq}</Link>
        </div>
      </header>

      <main
        className={mainClassName ?? "kompis-web-sales-shell"}
        style={
          mainClassName
            ? undefined
            : { paddingBlock: "40px 64px", maxWidth, width: "100%", marginInline: "auto" }
        }
      >
        {showTitle && title ? (
          <>
            <p className="kompis-web-sales-eyebrow">{appName}</p>
            <h1
              className="kompis-web-sales-display"
              style={{ fontSize: "clamp(1.75rem, 3vw, 2.35rem)" }}
            >
              {title}
            </h1>
            {subtitle ? <p className="kompis-web-sales-lead">{subtitle}</p> : null}
            <div style={{ marginTop: 28 }}>{children}</div>
          </>
        ) : (
          children
        )}
      </main>

      <footer className="kompis-web-sales-footer">
        <div className="kompis-web-sales-shell kompis-web-sales-footer-inner">
          <Link href={labels.hrefs.home} className="kompis-web-sales-brand">
            <Image src={BRAND_MARK} alt="" width={32} height={32} />
            <span>{labels.footer.tagline}</span>
          </Link>
          <nav className="kompis-web-sales-footer-links" aria-label={labels.footer.home}>
            <Link href={`${labels.hrefs.home}#product`}>{labels.footer.product}</Link>
            <Link href={`${labels.hrefs.home}#how`}>{labels.footer.how}</Link>
            <Link href={`${labels.hrefs.home}#pricing`}>{labels.footer.pricing}</Link>
            <Link href={labels.hrefs.faq}>{labels.footer.faq}</Link>
            <Link href={labels.hrefs.contact}>{labels.footer.contact}</Link>
            <Link
              href={labels.hrefs.becomeSeller}
              {...marketingDataAttr("cta_click", "kompis_web_sales_chrome_become_seller")}
            >
              {labels.footer.becomeSeller}
            </Link>
            <Link href={labels.hrefs.privacy}>{labels.footer.privacy}</Link>
            <Link href={labels.hrefs.terms}>{labels.footer.terms}</Link>
            <Link href={labels.hrefs.home}>{labels.footer.home}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
