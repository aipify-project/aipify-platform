import { FinancialGuardrailsPanel } from "@/components/app/governance/FinancialGuardrailsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FinancialGuardrailsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.financialGuardrails";

  return (
    <FinancialGuardrailsPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        activeTitle: t(`${p}.activeTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        alertsTitle: t(`${p}.alertsTitle`),
        expendituresTitle: t(`${p}.expendituresTitle`),
        trendsTitle: t(`${p}.trendsTitle`),
        utilizationTitle: t(`${p}.utilizationTitle`),
        highValueTitle: t(`${p}.highValueTitle`),
        exceptionsTitle: t(`${p}.exceptionsTitle`),
        effectivenessTitle: t(`${p}.effectivenessTitle`),
        accept: t(`${p}.accept`),
        dismiss: t(`${p}.dismiss`),
        suspend: t(`${p}.suspend`),
        delete: t(`${p}.delete`),
        privacyNote: t(`${p}.privacyNote`),
        approvalsLink: t(`${p}.approvalsLink`),
        approvalProfilesLink: t(`${p}.approvalProfilesLink`),
        governanceLink: t(`${p}.governanceLink`),
        spendingCategories: {
          personal: t(`${p}.spendingCategories.personal`),
          business: t(`${p}.spendingCategories.business`),
          enterprise: t(`${p}.spendingCategories.enterprise`),
        },
        limitTypes: {
          per_transaction: t(`${p}.limitTypes.per_transaction`),
          monthly: t(`${p}.limitTypes.monthly`),
          team: t(`${p}.limitTypes.team`),
        },
        approvalThresholds: {
          level_1: t(`${p}.approvalThresholds.level_1`),
          level_2: t(`${p}.approvalThresholds.level_2`),
          level_3: t(`${p}.approvalThresholds.level_3`),
          level_4: t(`${p}.approvalThresholds.level_4`),
        },
      }}
    />
  );
}
