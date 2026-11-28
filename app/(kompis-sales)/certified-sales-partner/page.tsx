import type { Metadata } from "next";
import { CertifiedSalesPartnerRegistrationForm } from "@/components/marketing/CertifiedSalesPartnerRegistrationForm";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
import PublicSafeBackLink from "@/components/marketing/PublicSafeBackLink";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { buildCspRegistrationFormLabels } from "@/lib/partners-portal/csp-workspace-labels";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  return {
    title: t("marketing.certifiedSalesPartner.meta.title"),
    description: t("marketing.certifiedSalesPartner.meta.description"),
  };
}

export default async function CertifiedSalesPartnerRecruitmentPage() {
  const { labels: salesLabels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);

  const steps = [
    t("marketing.certifiedSalesPartner.howItWorks.steps.apply"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.review"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.academy"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.links"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.sale"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.commission"),
    t("marketing.certifiedSalesPartner.howItWorks.steps.settlement"),
  ];

  const fitItems = [
    t("marketing.certifiedSalesPartner.whoFor.items.registered"),
    t("marketing.certifiedSalesPartner.whoFor.items.b2b"),
    t("marketing.certifiedSalesPartner.whoFor.items.certify"),
    t("marketing.certifiedSalesPartner.whoFor.items.ethical"),
  ];

  return (
    <KompisWebSalesChrome
      labels={salesLabels}
      appName={appName}
      locale={locale}
      showTitle={false}
      contentMaxWidth={1120}
    >
      <div className="kompis-web-sales-section" style={{ paddingTop: 8 }}>
        <p className="kompis-web-sales-eyebrow">
          {t("marketing.certifiedSalesPartner.hero.eyebrow")}
        </p>
        <h1 className="kompis-web-sales-display" style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}>
          {t("marketing.certifiedSalesPartner.hero.title")}
        </h1>
        <p className="kompis-web-sales-lead" style={{ maxWidth: 640 }}>
          {t("marketing.certifiedSalesPartner.hero.subtitle")}
        </p>
        <p className="kompis-web-sales-note" style={{ maxWidth: 640, marginTop: 10 }}>
          {t("marketing.certifiedSalesPartner.hero.programNote")}
        </p>
        <div className="kompis-web-sales-cta-row" style={{ marginTop: 22 }}>
          <a href="#apply" className="kompis-web-sales-primary">
            {t("marketing.certifiedSalesPartner.hero.cta")}
          </a>
          <a href="#how-it-works" className="kompis-web-sales-cta-quiet">
            {t("marketing.certifiedSalesPartner.hero.secondaryCta")}
          </a>
          <PublicSafeBackLink
            label={salesLabels.start.back}
            className="kompis-web-sales-cta-quiet"
            fallbackHref={salesLabels.hrefs.home}
          />
        </div>
        <ul className="kompis-web-sales-feature-strip" style={{ marginTop: 32 }}>
          {[
            t("marketing.certifiedSalesPartner.points.independent"),
            t("marketing.certifiedSalesPartner.points.certification"),
            t("marketing.certifiedSalesPartner.points.commission"),
            t("marketing.certifiedSalesPartner.points.noGuarantee"),
          ].map((point) => (
            <li key={point} className="kompis-web-sales-feature-item">
              <strong>{point}</strong>
            </li>
          ))}
        </ul>
      </div>

      <section className="kompis-web-sales-section" id="who-for" style={{ scrollMarginTop: 96 }}>
        <h2 className="kompis-web-sales-section-title">
          {t("marketing.certifiedSalesPartner.whoFor.title")}
        </h2>
        <p className="kompis-web-sales-section-lead">
          {t("marketing.certifiedSalesPartner.whoFor.subtitle")}
        </p>
        <div className="kompis-web-sales-how-grid" style={{ marginTop: 24 }}>
          {fitItems.map((item) => (
            <article key={item} className="kompis-web-sales-how-card">
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="kompis-web-sales-section" id="how-it-works" style={{ scrollMarginTop: 96 }}>
        <h2 className="kompis-web-sales-section-title">
          {t("marketing.certifiedSalesPartner.howItWorks.title")}
        </h2>
        <p className="kompis-web-sales-section-lead">
          {t("marketing.certifiedSalesPartner.howItWorks.subtitle")}
        </p>
        <ol className="kompis-web-sales-how-grid" style={{ marginTop: 28, listStyle: "none", padding: 0 }}>
          {steps.map((step, index) => (
            <li key={step} className="kompis-web-sales-how-card">
              <div className="kompis-web-sales-how-card-top">
                <span className="kompis-web-sales-step-index">{index + 1}</span>
              </div>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        <p className="kompis-web-sales-note" style={{ marginTop: 20 }}>
          {t("marketing.certifiedSalesPartner.howItWorks.honesty")}
        </p>
      </section>

      <section
        id="apply"
        className="kompis-web-sales-section"
        style={{ scrollMarginTop: 96, paddingBottom: 8 }}
      >
        <div style={{ display: "grid", gap: 28, gridTemplateColumns: "minmax(0, 1fr)" }}>
          <div>
            <h2 className="kompis-web-sales-section-title">
              {t("marketing.certifiedSalesPartner.applyIntro.title")}
            </h2>
            <p className="kompis-web-sales-section-lead">
              {t("marketing.certifiedSalesPartner.applyIntro.body")}
            </p>
            <p className="kompis-web-sales-note" style={{ marginTop: 12 }}>
              {t("marketing.certifiedSalesPartner.applyIntro.bankLater")}
            </p>
          </div>
          <div className="kompis-web-sales-panel" style={{ padding: 24 }}>
            <CertifiedSalesPartnerRegistrationForm
              locale={String(locale)}
              labels={buildCspRegistrationFormLabels(t)}
              verificationLabels={buildHumanVerificationLabels(t)}
            />
          </div>
        </div>
      </section>
    </KompisWebSalesChrome>
  );
}
