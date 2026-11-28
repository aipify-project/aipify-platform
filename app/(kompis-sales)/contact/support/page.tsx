import type { Metadata } from "next";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
import PublicSafeBackLink from "@/components/marketing/PublicSafeBackLink";
import SupportIntakeForm from "@/components/marketing/SupportIntakeForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";
import { getSupportIntakeGateState } from "@/lib/support-intake";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing"]);
  const t = createTranslator(dict);
  const intakeLive = getSupportIntakeGateState().live;
  return {
    title: t("marketing.supportIntake.title"),
    description: t(
      intakeLive
        ? "marketing.supportIntake.subtitle"
        : "marketing.supportIntake.subtitleInactive",
    ),
  };
}

export default async function ContactSupportPage() {
  const { labels: salesLabels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  const intakeLive = getSupportIntakeGateState().live;

  const formLabels = {
    title: t("marketing.supportIntake.title"),
    subtitle: t(
      intakeLive
        ? "marketing.supportIntake.subtitle"
        : "marketing.supportIntake.subtitleInactive",
    ),
    name: t("marketing.supportIntake.name"),
    email: t("marketing.supportIntake.email"),
    subject: t("marketing.supportIntake.subject"),
    message: t("marketing.supportIntake.message"),
    submit: t("marketing.supportIntake.submit"),
    submitting: t("marketing.supportIntake.submitting"),
    successCorePending: t("marketing.supportIntake.successCorePending"),
    temporaryUnavailable: t("marketing.supportIntake.temporaryUnavailable"),
    successSubmitted: t("marketing.supportIntake.successSubmitted"),
    errorGeneric: t("marketing.supportIntake.errorGeneric"),
    mailtoFallback: t("marketing.supportIntake.mailtoFallback"),
    mailtoLabel: t("marketing.supportIntake.mailtoLabel"),
    verificationRequired: t("marketing.supportIntake.verificationRequired"),
    privacy: t(intakeLive ? "marketing.supportIntake.privacy" : "marketing.supportIntake.privacyInactive"),
    nameRequired: t("marketing.supportIntake.nameRequired"),
    emailInvalid: t("marketing.supportIntake.emailInvalid"),
    subjectTooShort: t("marketing.supportIntake.subjectTooShort"),
    messageTooShort: t("marketing.supportIntake.messageTooShort"),
    referenceLabel: t("marketing.supportIntake.referenceLabel"),
  };

  return (
    <KompisWebSalesChrome
      labels={salesLabels}
      appName={appName}
      locale={locale}
      showTitle={false}
      contentMaxWidth={720}
    >
      <p className="kompis-web-sales-eyebrow">{appName}</p>
      <div className="mt-4">
        <SupportIntakeForm
          labels={formLabels}
          verificationLabels={buildHumanVerificationLabels(t)}
          intakeLive={intakeLive}
        />
      </div>
      <p style={{ marginTop: 28 }}>
        <PublicSafeBackLink
          label={salesLabels.start.back}
          className="kompis-web-sales-cta-quiet"
          fallbackHref={salesLabels.hrefs.home}
        />
      </p>
    </KompisWebSalesChrome>
  );
}
