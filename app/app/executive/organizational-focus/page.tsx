import { OrganizationalFocusCenterPanel } from "@/components/app/organizational-focus-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalFocusCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalFocusCenter";

  return (
    <OrganizationalFocusCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalAlignmentLink: t(`${p}.organizationalAlignmentLink`),
        executionExcellenceLink: t(`${p}.executionExcellenceLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        attentionGuardianLink: t(`${p}.attentionGuardianLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
        priorityDistributionTitle: t(`${p}.priorityDistributionTitle`),
        overloadsTitle: t(`${p}.overloadsTitle`),
        prioritizationTitle: t(`${p}.prioritizationTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        discussOverload: t(`${p}.discussOverload`),
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        owner: t(`${p}.owner`),
        focusScore: t(`${p}.focusScore`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          attention_required: t(`${p}.healthLabels.attention_required`),
          fragmented: t(`${p}.healthLabels.fragmented`),
        },
        overloadTypes: {
          excessive_initiatives: t(`${p}.overloadTypes.excessive_initiatives`),
          competing_priorities: t(`${p}.overloadTypes.competing_priorities`),
          resource_fragmentation: t(`${p}.overloadTypes.resource_fragmentation`),
          meeting_overload: t(`${p}.overloadTypes.meeting_overload`),
          review_fatigue: t(`${p}.overloadTypes.review_fatigue`),
        },
        timelineTypes: {
          priority_shift: t(`${p}.timelineTypes.priority_shift`),
          initiative_added: t(`${p}.timelineTypes.initiative_added`),
          initiative_completed: t(`${p}.timelineTypes.initiative_completed`),
          focus_improvement: t(`${p}.timelineTypes.focus_improvement`),
          executive_intervention: t(`${p}.timelineTypes.executive_intervention`),
        },
        reviewTypes: {
          weekly: t(`${p}.reviewTypes.weekly`),
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
        },
        metrics: {
          activeInitiatives: t(`${p}.metrics.activeInitiatives`),
          strongFocus: t(`${p}.metrics.strongFocus`),
          focusRisks: t(`${p}.metrics.focusRisks`),
          concentration: t(`${p}.metrics.concentration`),
          priorityClarity: t(`${p}.metrics.priorityClarity`),
          reviewDiscipline: t(`${p}.metrics.reviewDiscipline`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          attention: t(`${p}.executiveFields.attention`),
          concentration: t(`${p}.executiveFields.concentration`),
          overload: t(`${p}.executiveFields.overload`),
          alignment: t(`${p}.executiveFields.alignment`),
        },
      }}
    />
  );
}
