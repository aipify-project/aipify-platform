import { GovernanceAuditPanel } from "@/components/app/governance/GovernanceAuditPanel";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GovernanceAuditPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);

  return (
    <GovernanceAuditPanel
      labels={{
        title: t("customerApp.governance.audit.title"),
        subtitle: t("customerApp.governance.audit.subtitle"),
        loading: t("customerApp.governance.audit.loading"),
        back: t("customerApp.governance.audit.back"),
        empty: t("customerApp.governance.audit.empty"),
      }}
    />
  );
}
