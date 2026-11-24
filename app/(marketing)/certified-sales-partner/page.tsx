import type { Metadata } from "next";
import Link from "next/link";
import { CertifiedSalesPartnerRegistrationForm } from "@/components/marketing/CertifiedSalesPartnerRegistrationForm";
import PublicBreadcrumbs from "@/components/marketing/public/PublicBreadcrumbs";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  return {
    title: t("marketing.certifiedSalesPartner.meta.title"),
    description: t("marketing.certifiedSalesPartner.meta.description"),
  };
}

export default async function CertifiedSalesPartnerRecruitmentPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);

  return (
    <div className={`min-w-0 ${AipifyMarketingClasses.canvas}`}>
      <div className="relative overflow-hidden">
        <div className={AipifyMarketingClasses.heroGradient} aria-hidden />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <PublicBreadcrumbs
            items={[
              { label: t("marketing.certifiedSalesPartner.breadcrumbs.home"), href: "/" },
              { label: t("marketing.certifiedSalesPartner.breadcrumbs.current") },
            ]}
          />
          <p className="mt-10 text-sm font-semibold uppercase tracking-wide text-aipify-companion">
            Aipify
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-aipify-text sm:text-5xl">
            {t("marketing.certifiedSalesPartner.hero.title")}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-aipify-text-secondary">
            {t("marketing.certifiedSalesPartner.hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/partners" className={AipifyMarketingClasses.primaryCta}>
              {t("marketing.certifiedSalesPartner.hero.cta")}
            </Link>
            <Link
              href="/growth-partners"
              className="inline-flex items-center justify-center rounded-xl border border-aipify-border bg-aipify-surface px-6 py-3 text-sm font-semibold text-aipify-text"
            >
              {t("marketing.certifiedSalesPartner.hero.secondaryCta")}
            </Link>
          </div>
          <ul className="mt-10 grid max-w-3xl gap-3 text-sm text-aipify-text-secondary">
            <li>{t("marketing.certifiedSalesPartner.points.independent")}</li>
            <li>{t("marketing.certifiedSalesPartner.points.certification")}</li>
            <li>{t("marketing.certifiedSalesPartner.points.commission")}</li>
            <li>{t("marketing.certifiedSalesPartner.points.noGuarantee")}</li>
          </ul>
          <CertifiedSalesPartnerRegistrationForm
            labels={{
              title: t("marketing.certifiedSalesPartner.registration.title"),
              fullName: t("marketing.certifiedSalesPartner.registration.fullName"),
              email: t("marketing.certifiedSalesPartner.registration.email"),
              country: t("marketing.certifiedSalesPartner.registration.country"),
              legalBusinessName: t("marketing.certifiedSalesPartner.registration.legalBusinessName"),
              businessRegistrationNumber: t(
                "marketing.certifiedSalesPartner.registration.businessRegistrationNumber",
              ),
              phone: t("marketing.certifiedSalesPartner.registration.phone"),
              address: t("marketing.certifiedSalesPartner.registration.address"),
              confirmBusiness: t("marketing.certifiedSalesPartner.registration.confirmBusiness"),
              confirmTerms: t("marketing.certifiedSalesPartner.registration.confirmTerms"),
              confirmCertification: t(
                "marketing.certifiedSalesPartner.registration.confirmCertification",
              ),
              confirmAccuracy: t("marketing.certifiedSalesPartner.registration.confirmAccuracy"),
              submit: t("marketing.certifiedSalesPartner.registration.submit"),
              submitting: t("marketing.certifiedSalesPartner.registration.submitting"),
              successTitle: t("marketing.certifiedSalesPartner.registration.successTitle"),
              successBody: t("marketing.certifiedSalesPartner.registration.successBody"),
              backendClosedTitle: t(
                "marketing.certifiedSalesPartner.registration.backendClosedTitle",
              ),
              backendClosedBody: t(
                "marketing.certifiedSalesPartner.registration.backendClosedBody",
              ),
              errorGeneric: t("marketing.certifiedSalesPartner.registration.errorGeneric"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
