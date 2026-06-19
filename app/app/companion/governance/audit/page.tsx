import { CompanionGovernancePanel } from "@/components/app/companion-governance-operations";
import { buildCompanionGovernanceLabels } from "@/lib/customer-companion-governance-operations";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionGovernanceAuditPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionGovernanceOperations");
  return (
    <CompanionGovernancePanel
      backHref="/app/companion/governance"
      initialTab="audit"
      visibleTabs={["audit", "reports", "executive", "overview"]}
      labels={buildCompanionGovernanceLabels(createTranslator(dict))}
    />
  );
}
