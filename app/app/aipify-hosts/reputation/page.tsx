import { AipifyHostsReputationCenterDashboardPanel } from "@/components/app/aipify-hosts-reputation-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsReputationPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.reputation";
  const c = "hosts.common";

  const sectionKeys = [
    "review_overview", "property_reviews", "review_trends",
    "improvement_opportunities", "recovery_actions",
  ] as const;
  const reviewStatusKeys = ["new", "reviewed", "action_required", "closed"] as const;
  const reviewCategoryKeys = [
    "cleanliness", "communication", "check_in_experience", "accuracy",
    "value", "location", "guest_experience",
  ] as const;
  const recoveryActionKeys = [
    "create_task", "assign_owner", "schedule_inspection", "open_incident", "document_resolution",
  ] as const;
  const caseStatusKeys = ["open", "in_progress", "resolved", "overdue"] as const;
  const reputationStatusKeys = ["critical", "attention", "good", "excellent", "unknown"] as const;
  const opportunityTypeKeys = [
    "repeated_complaints", "declining_category", "operational_weakness", "property_trend",
  ] as const;
  const severityKeys = ["high", "medium", "low"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    governanceNote: t(`${p}.governanceNote`),
    averageRating: t(`${p}.averageRating`),
    propertiesRequiringAttention: t(`${p}.propertiesRequiringAttention`),
    topPerformingProperties: t(`${p}.topPerformingProperties`),
    openRecoveryCases: t(`${p}.openRecoveryCases`),
    newReviews: t(`${p}.newReviews`),
    actionRequired: t(`${p}.actionRequired`),
    filterProperty: t(`${p}.filterProperty`),
    allProperties: t(`${p}.allProperties`),
    filterCategory: t(`${p}.filterCategory`),
    allCategories: t(`${p}.allCategories`),
    filterStatus: t(`${p}.filterStatus`),
    allStatuses: t(`${p}.allStatuses`),
    property: t(`${p}.property`),
    stayPeriod: t(`${p}.stayPeriod`),
    overallRating: t(`${p}.overallRating`),
    reviewDate: t(`${p}.reviewDate`),
    status: t(`${p}.status`),
    actions: t(`${p}.actions`),
    markReviewed: t(`${p}.markReviewed`),
    flagActionRequired: t(`${p}.flagActionRequired`),
    scheduleInspection: t(`${p}.scheduleInspection`),
    createTask: t(`${p}.createTask`),
    openIncident: t(`${p}.openIncident`),
    assignOwner: t(`${p}.assignOwner`),
    documentResolution: t(`${p}.documentResolution`),
    closeCase: t(`${p}.closeCase`),
    defaultOwner: t(`${p}.defaultOwner`),
    defaultResolutionNote: t(`${p}.defaultResolutionNote`),
    caseReference: t(`${p}.caseReference`),
    actionType: t(`${p}.actionType`),
    assignedOwner: t(`${p}.assignedOwner`),
    dueDate: t(`${p}.dueDate`),
    overdue: t(`${p}.overdue`),
    ratingTrends: t(`${p}.ratingTrends`),
    categoryTrends: t(`${p}.categoryTrends`),
    propertyComparisons: t(`${p}.propertyComparisons`),
    emptyReviewsTitle: t(`${p}.emptyReviewsTitle`),
    emptyReviewsMessage: t(`${p}.emptyReviewsMessage`),
    emptyTrendsTitle: t(`${p}.emptyTrendsTitle`),
    emptyTrendsMessage: t(`${p}.emptyTrendsMessage`),
    emptyOpportunitiesTitle: t(`${p}.emptyOpportunitiesTitle`),
    emptyOpportunitiesMessage: t(`${p}.emptyOpportunitiesMessage`),
    emptyRecoveryTitle: t(`${p}.emptyRecoveryTitle`),
    emptyRecoveryMessage: t(`${p}.emptyRecoveryMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of reviewStatusKeys) labels[`reviewStatus_${key}`] = t(`${p}.reviewStatuses.${key}`);
  for (const key of reviewCategoryKeys) labels[`reviewCategory_${key}`] = t(`${p}.reviewCategories.${key}`);
  for (const key of recoveryActionKeys) labels[`recoveryAction_${key}`] = t(`${p}.recoveryActions.${key}`);
  for (const key of caseStatusKeys) labels[`caseStatus_${key}`] = t(`${p}.caseStatuses.${key}`);
  for (const key of reputationStatusKeys) labels[`reputationStatus_${key}`] = t(`${p}.reputationStatuses.${key}`);
  for (const key of opportunityTypeKeys) labels[`opportunityType_${key}`] = t(`${p}.opportunityTypes.${key}`);
  for (const key of severityKeys) labels[`severity_${key}`] = t(`${p}.severity.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.pageTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsReputationCenterDashboardPanel labels={labels} />
    </div>
  );
}
