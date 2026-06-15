import { AipifyHostsQualityCenterDashboardPanel } from "@/components/app/aipify-hosts-quality-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsQualityPage() {
  const dict = await getDictionary(await getLocale(), ["hosts"]);
  const t = createTranslator(dict);
  const p = "hosts.quality";
  const c = "hosts.common";

  const typeKeys = ["arrival", "departure", "routine", "seasonal", "emergency", "compliance"] as const;
  const statusKeys = ["scheduled", "in_progress", "awaiting_review", "approved", "requires_action"] as const;
  const outcomeKeys = ["passed", "passed_with_notes", "action_required", "failed"] as const;
  const sectionKeys = ["upcoming_inspections", "active_inspections", "completed_inspections", "quality_reviews", "standards_library"] as const;
  const timelineKeys = ["inspection_created", "inspection_started", "findings_recorded", "actions_assigned", "inspection_closed"] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    errorTitle: t(`${p}.errorTitle`),
    errorMessage: t(`${p}.errorMessage`),
    retry: t(`${c}.retry`),
    backToHosts: t(`${c}.backToHosts`),
    governanceNote: t(`${p}.governanceNote`),
    upcomingCount: t(`${p}.upcomingCount`),
    activeCount: t(`${p}.activeCount`),
    overdueCount: t(`${p}.overdueCount`),
    failedCount: t(`${p}.failedCount`),
    avgScore: t(`${p}.avgScore`),
    property: t(`${p}.property`),
    inspectionType: t(`${p}.inspectionType`),
    inspector: t(`${p}.inspector`),
    scheduledDate: t(`${p}.scheduledDate`),
    completionDate: t(`${p}.completionDate`),
    status: t(`${p}.status`),
    outcome: t(`${p}.outcome`),
    actions: t(`${p}.actions`),
    startInspection: t(`${p}.startInspection`),
    submitForReview: t(`${p}.submitForReview`),
    scheduleInspection: t(`${p}.scheduleInspection`),
    inspectorPlaceholder: t(`${p}.inspectorPlaceholder`),
    allProperties: t(`${p}.allProperties`),
    correctivePlaceholder: t(`${p}.correctivePlaceholder`),
    addCorrective: t(`${p}.addCorrective`),
    photoLabelPlaceholder: t(`${p}.photoLabelPlaceholder`),
    addPhoto: t(`${p}.addPhoto`),
    escalate: t(`${p}.escalate`),
    correctiveActions: t(`${p}.correctiveActions`),
    timeline: t(`${p}.timeline`),
    recommendedActions: t(`${p}.recommendedActions`),
    improvementOpportunities: t(`${p}.improvementOpportunities`),
    emptyInspectionsTitle: t(`${p}.emptyInspectionsTitle`),
    emptyInspectionsMessage: t(`${p}.emptyInspectionsMessage`),
    emptyReviewsTitle: t(`${p}.emptyReviewsTitle`),
    emptyReviewsMessage: t(`${p}.emptyReviewsMessage`),
    actionRecorded: t(`${c}.actionRecorded`),
    actionFailed: t(`${c}.actionFailed`),
  };

  for (const key of typeKeys) labels[`type_${key}`] = t(`${p}.types.${key}`);
  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of outcomeKeys) labels[`outcome_${key}`] = t(`${p}.outcomes.${key}`);
  for (const key of sectionKeys) labels[`section_${key}`] = t(`${p}.sections.${key}`);
  for (const key of timelineKeys) labels[`timeline_${key}`] = t(`${p}.timelineTypes.${key}`);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsQualityCenterDashboardPanel labels={labels} />
    </div>
  );
}
