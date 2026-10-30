import Image from "next/image";
import Link from "next/link";
import "./kompis-web-sales.css";

const BRAND_MARK = "/brand/aipify-kompis-avatar.png";

export type KompisWebLegalSection = { title: string; body: string };

type Props = {
  appName: string;
  title: string;
  updated?: string;
  sections: KompisWebLegalSection[];
  backLabel: string;
  privacyLabel: string;
  termsLabel: string;
  homeHref: string;
  privacyHref: string;
  termsHref: string;
  active: "privacy" | "terms";
};

export default function KompisWebLegalPage({
  appName,
  title,
  updated,
  sections,
  backLabel,
  privacyLabel,
  termsLabel,
  homeHref,
  privacyHref,
  termsHref,
  active,
}: Props) {
  return (
    <div className="kompis-web-sales">
      <header className="kompis-web-sales-nav">
        <div className="kompis-web-sales-shell kompis-web-sales-nav-inner">
          <Link href={homeHref} className="kompis-web-sales-brand" aria-label={appName}>
            <Image src={BRAND_MARK} alt="" width={40} height={40} priority />
            <span>{appName}</span>
          </Link>
          <nav className="kompis-web-sales-nav-actions" aria-label={title}>
            <Link
              href={privacyHref}
              className={active === "privacy" ? "kompis-web-sales-primary" : "kompis-web-sales-secondary"}
            >
              {privacyLabel}
            </Link>
            <Link
              href={termsHref}
              className={active === "terms" ? "kompis-web-sales-primary" : "kompis-web-sales-secondary"}
            >
              {termsLabel}
            </Link>
          </nav>
        </div>
      </header>

      <main className="kompis-web-sales-shell" style={{ paddingBlock: "48px", maxWidth: 760 }}>
        <Link href={homeHref} className="kompis-web-sales-cta-quiet" style={{ display: "inline-flex", marginBottom: 16 }}>
          {backLabel}
        </Link>
        <h1 className="kompis-web-sales-display" style={{ maxWidth: "none", fontSize: "clamp(28px, 4vw, 42px)" }}>
          {title}
        </h1>
        {updated ? <p className="kompis-web-sales-hint">{updated}</p> : null}
        <div style={{ display: "grid", gap: 28, marginTop: 28 }}>
          {sections.map((section) => (
            <article key={section.title}>
              <h2 style={{ fontSize: "1.15rem", margin: "0 0 8px", fontWeight: 750 }}>{section.title}</h2>
              <p className="kompis-web-sales-lead" style={{ margin: 0, maxWidth: "none" }}>
                {section.body}
              </p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
