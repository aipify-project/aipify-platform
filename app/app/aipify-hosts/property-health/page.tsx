import { AipifyHostsPropertyHealthDashboardPanel } from "@/components/app/aipify-hosts-property-health";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsPropertyHealthPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.propertyHealth";
  const c = "hosts.common";

  const sectionKeys = ["portfolio_overview", "property_scores", "open_risks", "recommended_actions"] as const;
  const levelKeys = ["excellent", "good", "attention_required", "critical"] as const;
  const categoryKeys = ["guest_experience", "operations", "safety", "maintenance", "finance", "compliance"] as const;
  const inputKeys = [
    "occupancy_status", "guest_satisfaction", "cleaning_completion", "maintenance_status",
    "incident_history", "inspection_results", "supply_readiness", "access_readiness", "document_readiness",
  ] as const;
  const riskKeys = [
    "cleaning_overdue", "maintenance_overdue", "open_critical_incident", "low_supplies",
    "missing_access_instructions", "expired_document", "failed_inspection",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    overallScore: t(`${p}.overallScore`),
    scoreTrend: t(`${p}.scoreTrend`),
    openRisks: t(`${p}.openRisks`),
    pendingActions: t(`${p}.pendingActions`),
    levelDistribution: t(`${p}.levelDistribution`),
    topStrengths: t(`${p}.topStrengths`),
    scoreTrendChart: t(`${p}.scoreTrendChart`),
    property: t(`${p}.property`),
    level: t(`${p}.level`),
    trend: t(`${p}.trend`),
    guestExperience: t(`${p}.guestExperience`),
    operations: t(`${p}.operations`),
    actions: t(`${p}.actions`),
    viewDetail: t(`${p}.viewDetail`),
    backToScores: t(`${p}.backToScores`),
    categoryBreakdown: t(`${p}.categoryBreakdown`),
    scoreInputs: t(`${p}.inputsHeading`),
    openProperty: t(`${p}.openProperty`),
    createTask: t(`${p}.createTask`),
    scheduleInspection: t(`${p}.scheduleInspection`),
    viewIncidents: t(`${p}.viewIncidents`),
    reviewSupplies: t(`${p}.reviewSupplies`),
    riskIndicator: t(`${p}.riskIndicator`),
    severity: t(`${p}.severity`),
    summary: t(`${p}.summary`),
    hoursUnresolved: t(`${p}.hoursUnresolved`),
    resolveRisk: t(`${p}.resolveRisk`),
    actionSummary: t(`${p}.actionSummary`),
    category: t(`${p}.category`),
    priority: t(`${p}.priority`),
    completeAction: t(`${p}.completeAction`),
    emptyScoresTitle: t(`${p}.emptyScoresTitle`),
    emptyScoresMessage: t(`${p}.emptyScoresMessage`),
    emptyRisksTitle: t(`${p}.emptyRisksTitle`),
    emptyRisksMessage: t(`${p}.emptyRisksMessage`),
    emptyActionsTitle: t(`${p}.emptyActionsTitle`),
    emptyActionsMessage: t(`${p}.emptyActionsMessage`),
    openRisksPreview: t(`${p}.openRisksPreview`),
    recommendedActionsPreview: t(`${p}.recommendedActionsPreview`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of levelKeys) labels[`level_${key}`] = t(`${p}.scoreLevels.${key}`);
  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);
  for (const key of inputKeys) labels[`input_${key}`] = t(`${p}.scoreInputs.${key}`);
  for (const key of riskKeys) labels[`risk_${key}`] = t(`${p}.riskIndicators.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsPropertyHealthDashboardPanel labels={labels} />
    </div>
  );
}
