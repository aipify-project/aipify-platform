import SupportIntakeForm from "@/components/marketing/SupportIntakeForm";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getSupportIntakeGateState } from "@/lib/support-intake";
import { buildHumanVerificationLabels } from "@/lib/system-notice/labels";

export default async function ContactSupportPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["marketing", "common"]);
  const t = createTranslator(dict);
  const intakeLive = getSupportIntakeGateState().live;

  const labels = {
    title: t("marketing.supportIntake.title"),
    subtitle: t("marketing.supportIntake.subtitle"),
    name: t("marketing.supportIntake.name"),
    email: t("marketing.supportIntake.email"),
    subject: t("marketing.supportIntake.subject"),
    message: t("marketing.supportIntake.message"),
    submit: t("marketing.supportIntake.submit"),
    submitting: t("marketing.supportIntake.submitting"),
    successCorePending: t("marketing.supportIntake.successCorePending"),
    errorGeneric: t("marketing.supportIntake.errorGeneric"),
    mailtoFallback: t("marketing.supportIntake.mailtoFallback"),
    mailtoLabel: t("marketing.supportIntake.mailtoLabel"),
    verificationRequired: t("marketing.supportIntake.verificationRequired"),
  };

  return (
    <main className="px-4 py-12 sm:px-6 lg:px-8">
      <SupportIntakeForm
        labels={labels}
        verificationLabels={buildHumanVerificationLabels(t)}
        intakeLive={intakeLive}
      />
    </main>
  );
}
