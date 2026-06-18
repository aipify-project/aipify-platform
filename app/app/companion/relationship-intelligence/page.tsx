import { CompanionRelationshipIntelligenceDashboardPanel } from "@/components/app/companion-relationship-intelligence";
import type { CompanionRelationshipIntelligenceLabels } from "@/lib/aipify/companion-relationship-intelligence";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

function buildLabels(t: Translator): CompanionRelationshipIntelligenceLabels {
  const p = "customerApp.companionRelationshipIntelligence";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyCta: t(`${p}.emptyCta`),
    accessDenied: t(`${p}.accessDenied`),
    filters: {
      search: t(`${p}.filters.search`),
      relationshipType: t(`${p}.filters.relationshipType`),
      healthLevel: t(`${p}.filters.healthLevel`),
      engagementLevel: t(`${p}.filters.engagementLevel`),
      owner: t(`${p}.filters.owner`),
      department: t(`${p}.filters.department`),
      all: t(`${p}.filters.all`),
    },
    sections: {
      strategicRelationships: t(`${p}.sections.strategicRelationships`),
      needsAttention: t(`${p}.sections.needsAttention`),
      recentInteractions: t(`${p}.sections.recentInteractions`),
      upcomingActivities: t(`${p}.sections.upcomingActivities`),
      engagementTrends: t(`${p}.sections.engagementTrends`),
      opportunities: t(`${p}.sections.opportunities`),
      reminders: t(`${p}.sections.reminders`),
      recognitionCenter: t(`${p}.sections.recognitionCenter`),
      timeline: t(`${p}.sections.timeline`),
      usageExamples: t(`${p}.sections.usageExamples`),
      allRelationships: t(`${p}.sections.allRelationships`),
    },
    dashboard: {
      healthScore: t(`${p}.dashboard.healthScore`),
      strategicRelationships: t(`${p}.dashboard.strategicRelationships`),
      needsAttention: t(`${p}.dashboard.needsAttention`),
      recentInteractions: t(`${p}.dashboard.recentInteractions`),
      upcomingActivities: t(`${p}.dashboard.upcomingActivities`),
      engagementTrends: t(`${p}.dashboard.engagementTrends`),
    },
    card: {
      organization: t(`${p}.card.organization`),
      role: t(`${p}.card.role`),
      lastInteraction: t(`${p}.card.lastInteraction`),
      health: t(`${p}.card.health`),
      engagement: t(`${p}.card.engagement`),
      recommendedAction: t(`${p}.card.recommendedAction`),
      insight: t(`${p}.card.insight`),
      owner: t(`${p}.card.owner`),
    },
    actions: {
      addRelationships: t(`${p}.actions.addRelationships`),
      addNote: t(`${p}.actions.addNote`),
      viewProfile: t(`${p}.actions.viewProfile`),
    },
    relationshipTypes: {
      customers: t(`${p}.relationshipTypes.customers`),
      prospects: t(`${p}.relationshipTypes.prospects`),
      partners: t(`${p}.relationshipTypes.partners`),
      vendors: t(`${p}.relationshipTypes.vendors`),
      employees: t(`${p}.relationshipTypes.employees`),
      executives: t(`${p}.relationshipTypes.executives`),
      advisors: t(`${p}.relationshipTypes.advisors`),
      investors: t(`${p}.relationshipTypes.investors`),
      growth_partners: t(`${p}.relationshipTypes.growthPartners`),
      strategic_contacts: t(`${p}.relationshipTypes.strategicContacts`),
    },
    healthLevels: {
      excellent: t(`${p}.healthLevels.excellent`),
      healthy: t(`${p}.healthLevels.healthy`),
      stable: t(`${p}.healthLevels.stable`),
      needs_attention: t(`${p}.healthLevels.needsAttention`),
      at_risk: t(`${p}.healthLevels.atRisk`),
    },
    engagementLevels: {
      high: t(`${p}.engagementLevels.high`),
      moderate: t(`${p}.engagementLevels.moderate`),
      low: t(`${p}.engagementLevels.low`),
      inactive: t(`${p}.engagementLevels.inactive`),
    },
    opportunityTypes: {
      reconnect: t(`${p}.opportunityTypes.reconnect`),
      partnership: t(`${p}.opportunityTypes.partnership`),
      customer_expansion: t(`${p}.opportunityTypes.customerExpansion`),
      retention: t(`${p}.opportunityTypes.retention`),
      recognition: t(`${p}.opportunityTypes.recognition`),
    },
    reminderTypes: {
      birthday: t(`${p}.reminderTypes.birthday`),
      work_anniversary: t(`${p}.reminderTypes.workAnniversary`),
      customer_anniversary: t(`${p}.reminderTypes.customerAnniversary`),
      contract_renewal: t(`${p}.reminderTypes.contractRenewal`),
      quarterly_review: t(`${p}.reminderTypes.quarterlyReview`),
      relationship_check_in: t(`${p}.reminderTypes.relationshipCheckIn`),
      partnership_review: t(`${p}.reminderTypes.partnershipReview`),
      milestone: t(`${p}.reminderTypes.milestone`),
    },
    recognitionTypes: {
      employee: t(`${p}.recognitionTypes.employee`),
      partner: t(`${p}.recognitionTypes.partner`),
      customer: t(`${p}.recognitionTypes.customer`),
    },
    recommendedActions: {
      schedule_check_in: t(`${p}.recommendedActions.scheduleCheckIn`),
      reconnect: t(`${p}.recommendedActions.reconnect`),
      recognize: t(`${p}.recommendedActions.recognize`),
      follow_up: t(`${p}.recommendedActions.followUp`),
      partnership_review: t(`${p}.recommendedActions.partnershipReview`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      autoManage: t(`${p}.faq.autoManage`),
      autoManageAnswer: t(`${p}.faq.autoManageAnswer`),
      whyImportant: t(`${p}.faq.whyImportant`),
      whyImportantAnswer: t(`${p}.faq.whyImportantAnswer`),
    },
  };
}

export default async function CompanionRelationshipIntelligencePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionRelationshipIntelligence");
  const t = createTranslator(dict);
  const labels = buildLabels(t);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
      </div>
      <CompanionRelationshipIntelligenceDashboardPanel labels={labels} />
    </div>
  );
}
