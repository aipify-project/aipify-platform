import { GovernanceTrustPanel } from "@/components/app/governance/GovernanceTrustPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernanceTrustPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <GovernanceTrustPanel
      labels={{
        title: t("customerApp.governance.trust.title"),
        subtitle: t("customerApp.governance.trust.subtitle"),
        loading: t("customerApp.governance.trust.loading"),
        back: t("customerApp.governance.trust.back"),
        empty: t("customerApp.governance.trust.empty"),
        success: t("customerApp.governance.trust.success"),
        failure: t("customerApp.governance.trust.failure"),
        approvals: t("customerApp.governance.trust.approvals"),
      }}
    />
  );
}
