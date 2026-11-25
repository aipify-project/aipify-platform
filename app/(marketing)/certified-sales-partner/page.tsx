import type { Metadata } from "next";
import Link from "next/link";
import { CertifiedSalesPartnerRegistrationForm } from "@/components/marketing/CertifiedSalesPartnerRegistrationForm";
import PublicBreadcrumbs from "@/components/marketing/public/PublicBreadcrumbs";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildCspRegistrationFormLabels } from "@/lib/partners-portal/csp-workspace-labels";

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
    <div className={`min-w-0 ${AipifyMarketingClasses.canvas}`}>
      <div className="relative overflow-hidden">
        <div className={AipifyMarketingClasses.heroGradient} aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <PublicBreadcrumbs
            items={[
              { label: t("marketing.certifiedSalesPartner.breadcrumbs.home"), href: "/" },
              { label: t("marketing.certifiedSalesPartner.breadcrumbs.current") },
            ]}
          />

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">
                {t("marketing.certifiedSalesPartner.hero.eyebrow")}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-aipify-text sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
                {t("marketing.certifiedSalesPartner.hero.title")}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-aipify-text-secondary">
                {t("marketing.certifiedSalesPartner.hero.subtitle")}
              </p>
              <p className="mt-3 max-w-2xl text-sm text-aipify-text-secondary">
                {t("marketing.certifiedSalesPartner.hero.programNote")}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#apply" className={AipifyMarketingClasses.primaryCta}>
                  {t("marketing.certifiedSalesPartner.hero.cta")}
                </a>
                <a href="#how-it-works" className={AipifyMarketingClasses.secondaryCta}>
                  {t("marketing.certifiedSalesPartner.hero.secondaryCta")}
                </a>
              </div>
              <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                {[
                  t("marketing.certifiedSalesPartner.points.independent"),
                  t("marketing.certifiedSalesPartner.points.certification"),
                  t("marketing.certifiedSalesPartner.points.commission"),
                  t("marketing.certifiedSalesPartner.points.noGuarantee"),
                ].map((point) => (
                  <li
                    key={point}
                    className={`${AipifyMarketingClasses.card} flex gap-3 p-4 text-sm leading-relaxed text-aipify-text-secondary`}
                  >
                    <span
                      className="mt-1 inline-flex h-2 w-2 shrink-0 rounded-full bg-aipify-companion"
                      aria-hidden
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="lg:col-span-5">
              <div className={`${AipifyMarketingClasses.card} bg-aipify-surface p-6 sm:p-8`}>
                <h2 className="text-lg font-semibold text-aipify-text">
                  {t("marketing.certifiedSalesPartner.aside.title")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">
                  {t("marketing.certifiedSalesPartner.aside.body")}
                </p>
                <ol className="mt-6 space-y-3 text-sm text-aipify-text-secondary">
                  {steps.slice(0, 4).map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-aipify-accent-soft text-xs font-semibold text-aipify-companion">
                        {index + 1}
                      </span>
                      <span className="pt-1 leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
                <Link href="#how-it-works" className="mt-6 inline-flex text-sm font-semibold text-aipify-companion">
                  {t("marketing.certifiedSalesPartner.aside.seeFullPath")}
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <section className={AipifyMarketingClasses.sectionAlt} id="who-for">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl">
            {t("marketing.certifiedSalesPartner.whoFor.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-aipify-text-secondary">
            {t("marketing.certifiedSalesPartner.whoFor.subtitle")}
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {fitItems.map((item) => (
              <li key={item} className={`${AipifyMarketingClasses.card} text-sm leading-relaxed text-aipify-text-secondary`}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl">
            {t("marketing.certifiedSalesPartner.howItWorks.title")}
          </h2>
          <p className="mt-3 max-w-3xl text-base text-aipify-text-secondary">
            {t("marketing.certifiedSalesPartner.howItWorks.subtitle")}
          </p>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step} className={`${AipifyMarketingClasses.card} flex gap-4`}>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-aipify-companion text-sm font-semibold text-white">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed text-aipify-text-secondary">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-8 max-w-3xl text-sm text-aipify-text-secondary">
            {t("marketing.certifiedSalesPartner.howItWorks.honesty")}
          </p>
        </div>
      </section>

      <section id="apply" className={`scroll-mt-24 ${AipifyMarketingClasses.sectionAlt}`}>
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-4">
              <h2 className="text-2xl font-semibold tracking-tight text-aipify-text sm:text-3xl">
                {t("marketing.certifiedSalesPartner.applyIntro.title")}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-aipify-text-secondary">
                {t("marketing.certifiedSalesPartner.applyIntro.body")}
              </p>
              <p className="mt-4 text-sm text-aipify-text-secondary">
                {t("marketing.certifiedSalesPartner.applyIntro.bankLater")}
              </p>
            </div>
            <div className="lg:col-span-8">
              <CertifiedSalesPartnerRegistrationForm
                locale={String(locale)}
                labels={buildCspRegistrationFormLabels(t)}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
