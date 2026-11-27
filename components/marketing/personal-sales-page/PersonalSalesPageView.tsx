import Image from "next/image";
import Link from "next/link";
import type { PersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import type { PersonalSalesPublication } from "@/lib/personal-sales-page/contract";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
import type { KompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import type { PublicFooterEnabledLocale } from "@/lib/i18n/public-locales";

const HERO = "/website-kompis/dashboard/kompis_mascot_premium_v2.png";

export function PersonalSalesPageView({
  chrome,
  appName,
  locale,
  labels,
  publication,
  startHref,
  howHref,
  monthly,
  annual,
  productBlocked,
}: {
  chrome: KompisWebSalesLabels;
  appName: string;
  locale: PublicFooterEnabledLocale;
  labels: PersonalSalesLabels;
  publication: PersonalSalesPublication;
  startHref: string;
  howHref: string;
  monthly: string | null;
  annual: string | null;
  productBlocked: boolean;
}) {
  const published = publication.state === "published";
  const advisor = published && publication.advisorName
    ? labels.recommendedBy.replace("{name}", publication.advisorName)
    : null;

  return (
    <KompisWebSalesChrome labels={chrome} appName={appName} locale={locale} showTitle={false} contentMaxWidth={1120}>
      <section className="kompis-web-sales-hero" aria-labelledby="personal-sales-title">
        <div className="kompis-web-sales-hero-copy">
          <p className="kompis-web-sales-eyebrow">{advisor ?? appName}</p>
          <h1 id="personal-sales-title" className="kompis-web-sales-display">
            {published ? labels.heroTitle : labels.unavailableTitle}
          </h1>
          <p className="kompis-web-sales-lead">{published ? labels.heroLead : labels.unavailableBody}</p>
          <div className="kompis-web-sales-cta-row">
            <Link className="kompis-web-sales-primary" href={startHref}>
              {published && !productBlocked ? labels.startFree : labels.closedCta}
            </Link>
            <Link className="kompis-web-sales-secondary" href={howHref}>
              {labels.seeHow}
            </Link>
          </div>
          <p className="kompis-web-sales-lead">{labels.noCheckout}</p>
        </div>
        <div className="kompis-web-sales-mascot-stage">
          <Image src={HERO} alt="" width={420} height={420} priority />
        </div>
      </section>
      {productBlocked ? <p className="kompis-web-sales-lead">{labels.productUnavailable}</p> : null}
      <section aria-labelledby="personal-sales-benefits">
        <h2 id="personal-sales-benefits" className="kompis-web-sales-display">
          {labels.benefitTitle}
        </h2>
        <ul>
          {labels.benefits.map((benefit) => (
            <li key={benefit}>{benefit}</li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="personal-sales-price">
        <h2 id="personal-sales-price">{labels.priceTitle}</h2>
        <h3>{labels.productTitle}</h3>
        {monthly && annual ? (
          <>
            <p>{labels.pricePlanned}</p>
            <p>
              {monthly} {labels.perMonth}
            </p>
            <p>
              {annual} {labels.perYear}
            </p>
          </>
        ) : (
          <p>{labels.priceMissing}</p>
        )}
      </section>
      {published ? (
        <section aria-labelledby="personal-sales-interest">
          <h2 id="personal-sales-interest">{labels.interestTitle}</h2>
          <p>{labels.interestPending}</p>
          <p>{labels.interestPrivacy}</p>
          <Link href="/privacy">{labels.privacyLink}</Link>
        </section>
      ) : null}
    </KompisWebSalesChrome>
  );
}
