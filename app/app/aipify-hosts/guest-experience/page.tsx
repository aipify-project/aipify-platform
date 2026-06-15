import { AipifyHostsGuestExperienceDashboardPanel } from "@/components/app/aipify-hosts-guest-experience";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsGuestExperiencePage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.guestExperience";
  const c = "hosts.common";

  const sectionKeys = ["experience_overview", "guest_feedback", "service_recovery", "improvement_opportunities", "experience_trends"] as const;
  const metricKeys = ["overall_satisfaction", "check_in_experience", "property_cleanliness", "communication_quality", "property_accuracy", "issue_resolution", "likelihood_to_return"] as const;
  const expStatusKeys = ["excellent", "good", "needs_improvement", "critical"] as const;
  const recoveryStatusKeys = ["open", "in_progress", "resolved", "closed"] as const;
  const oppTypeKeys = ["repeated_complaints", "declining_satisfaction", "operational_failure", "property_weakness"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    guestSatisfactionScore: t(`${p}.guestSatisfactionScore`),
    openRecoveryCases: t(`${p}.openRecoveryCases`),
    topImprovementAreas: t(`${p}.topImprovementAreas`),
    strongestProperties: t(`${p}.strongestProperties`),
    overdue: t(`${p}.overdue`),
    criticalCount: t(`${p}.criticalCount`),
    categoryPerformance: t(`${p}.categoryPerformance`),
    topImprovementAreasList: t(`${p}.topImprovementAreasList`),
    monthlyTrends: t(`${p}.monthlyTrends`),
    property: t(`${p}.property`),
    stayPeriod: t(`${p}.stayPeriod`),
    category: t(`${p}.category`),
    rating: t(`${p}.rating`),
    comments: t(`${p}.comments`),
    submittedAt: t(`${p}.submittedAt`),
    status: t(`${p}.status`),
    assignedOwner: t(`${p}.assignedOwner`),
    dueDate: t(`${p}.dueDate`),
    resolutionNotes: t(`${p}.resolutionNotes`),
    actions: t(`${p}.actions`),
    createTask: t(`${p}.createTask`),
    assignOwner: t(`${p}.assignOwner`),
    documentResolution: t(`${p}.documentResolution`),
    closeCase: t(`${p}.closeCase`),
    opportunityType: t(`${p}.opportunityType`),
    summary: t(`${p}.summary`),
    severity: t(`${p}.severity`),
    satisfaction: t(`${p}.satisfaction`),
    trend: t(`${p}.trend`),
    returningGuests: t(`${p}.returningGuests`),
    month: t(`${p}.month`),
    recentFeedback: t(`${p}.recentFeedback`),
    openRecoveryPreview: t(`${p}.openRecoveryPreview`),
    emptyFeedbackTitle: t(`${p}.emptyFeedbackTitle`),
    emptyFeedbackMessage: t(`${p}.emptyFeedbackMessage`),
    emptyRecoveryTitle: t(`${p}.emptyRecoveryTitle`),
    emptyRecoveryMessage: t(`${p}.emptyRecoveryMessage`),
    emptyOpportunitiesTitle: t(`${p}.emptyOpportunitiesTitle`),
    emptyOpportunitiesMessage: t(`${p}.emptyOpportunitiesMessage`),
    emptyMetricsTitle: t(`${p}.emptyMetricsTitle`),
    emptyMetricsMessage: t(`${p}.emptyMetricsMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of metricKeys) labels[`metric_${key}`] = t(`${p}.metrics.${key}`);
  for (const key of expStatusKeys) labels[`expStatus_${key}`] = t(`${p}.experienceStatuses.${key}`);
  for (const key of recoveryStatusKeys) labels[`recoveryStatus_${key}`] = t(`${p}.recoveryStatuses.${key}`);
  for (const key of oppTypeKeys) labels[`oppType_${key}`] = t(`${p}.opportunityTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsGuestExperienceDashboardPanel labels={labels} />
    </div>
  );
}
