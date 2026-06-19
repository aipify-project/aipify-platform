import { RiskOperationsPanel } from "@/components/app/risk-operations";
import { buildRiskOperationsLabels } from "@/lib/risk-operations/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function RiskRegisterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildRiskOperationsLabels(t);

  return (
    <RiskOperationsPanel
      labels={labels}
      initialTab="risk_register"
      titleOverride={labels.registerTitle}
      visibleTabs={["overview", "risk_register", "mitigation_plans", "executive_risk", "reports"]}
    />
  );
}
