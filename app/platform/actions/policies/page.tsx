import PlatformActionPoliciesPanel from "@/components/platform/PlatformActionPoliciesPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionPoliciesPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformActionPoliciesPanel
      labels={{
        title: t("platform.actions.pages.policies.title"),
        subtitle: t("platform.actions.pages.policies.subtitle"),
        customerPolicies: t("platform.actions.policies.customerPolicies"),
        loading: t("platform.actions.loading"),
        empty: t("platform.actions.pages.policies.empty"),
        tenant: t("platform.actions.policies.tenant"),
        riskLevel: t("platform.actions.policies.riskLevel"),
        rule: t("platform.actions.policies.rule"),
        autoApprove: t("platform.actions.policies.autoApprove"),
        approverRole: t("platform.actions.policies.approverRole"),
        manualOnly: t("platform.actions.policies.manualOnly"),
        yes: t("platform.actions.yes"),
        no: t("platform.actions.no"),
        platformDefault: t("platform.actions.policies.platformDefault"),
        riskLabels: {
          low: t("platform.actions.risk.low"),
          medium: t("platform.actions.risk.medium"),
          high: t("platform.actions.risk.high"),
          critical: t("platform.actions.risk.critical"),
        },
      }}
    />
  );
}
