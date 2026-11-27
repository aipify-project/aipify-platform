import type { Metadata } from "next";
import Link from "next/link";
import KompisWebSalesChrome from "@/components/marketing/kompis-web-sales/KompisWebSalesChrome";
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
  return {
    title: t("marketing.supportIntake.title"),
    description: t("marketing.supportIntake.subtitle"),
  };
}

export default async function ContactSupportPage() {
  const { labels: salesLabels, appName, locale } = await loadKompisWebSalesRouteContext();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  const intakeLive = getSupportIntakeGateState().live;

  const formLabels = {
    title: t("marketing.supportIntake.title"),
    subtitle: t("marketing.supportIntake.subtitle"),
    name: t("marketing.supportIntake.name"),
    email: t("marketing.supportIntake.email"),
    subject: t("marketing.supportIntake.subject"),
    message: t("marketing.supportIntake.message"),
    submit: t("marketing.supportIntake.submit"),
    submitting: t("marketing.supportIntake.submitting"),
    successCorePending: t("marketing.supportIntake.successCorePending"),
    successSubmitted: t("marketing.supportIntake.successSubmitted"),
    errorGeneric: t("marketing.supportIntake.errorGeneric"),
    mailtoFallback: t("marketing.supportIntake.mailtoFallback"),
    mailtoLabel: t("marketing.supportIntake.mailtoLabel"),
    verificationRequired: t("marketing.supportIntake.verificationRequired"),
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
      <SupportIntakeForm
        labels={formLabels}
        verificationLabels={buildHumanVerificationLabels(t)}
        intakeLive={intakeLive}
      />
      <p style={{ marginTop: 28 }}>
        <Link href={salesLabels.hrefs.home} className="kompis-web-sales-cta-quiet">
          {salesLabels.start.backHome}
        </Link>
      </p>
    </KompisWebSalesChrome>
  );
}
