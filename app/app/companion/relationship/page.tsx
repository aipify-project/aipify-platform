import { CompanionRelationshipDashboardPanel } from "@/components/app/companion-relationship-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionRelationshipPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "companionRelationshipEngine");
  const t = createTranslator(dict);
  const p = "customerApp.companionRelationshipEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    identityTitle: t(`${p}.identityTitle`),
    personalityTitle: t(`${p}.personalityTitle`),
    communicationTitle: t(`${p}.communicationTitle`),
    historyTitle: t(`${p}.historyTitle`),
    memoriesTitle: t(`${p}.memoriesTitle`),
    milestonesTitle: t(`${p}.milestonesTitle`),
    trustTitle: t(`${p}.trustTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    auditTitle: t(`${p}.auditTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricStatus: t(`${p}.metricStatus`),
    metricStrength: t(`${p}.metricStrength`),
    metricInteractions: t(`${p}.metricInteractions`),
    metricPreferences: t(`${p}.metricPreferences`),
    metricTrust: t(`${p}.metricTrust`),
    metricStyle: t(`${p}.metricStyle`),
    metricHealth: t(`${p}.metricHealth`),
    metricSatisfaction: t(`${p}.metricSatisfaction`),
    companionName: t(`${p}.companionName`),
    companionIdentity: t(`${p}.companionIdentity`),
    identityNotToolNote: t(`${p}.identityNotToolNote`),
    currentTone: t(`${p}.currentTone`),
    currentStyle: t(`${p}.currentStyle`),
    currentDetail: t(`${p}.currentDetail`),
    noPersonality: t(`${p}.noPersonality`),
    noCommunication: t(`${p}.noCommunication`),
    noHistory: t(`${p}.noHistory`),
    noMemories: t(`${p}.noMemories`),
    noMilestones: t(`${p}.noMilestones`),
    noTrust: t(`${p}.noTrust`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openIdentityRelationship: t(`${p}.openIdentityRelationship`),
    openPersonalization: t(`${p}.openPersonalization`),
    openTrustAdoption: t(`${p}.openTrustAdoption`),
    updateCommunicationStyle: t(`${p}.updateCommunicationStyle`),
    approveMemory: t(`${p}.approveMemory`),
    removeMemory: t(`${p}.removeMemory`),
    recordMilestone: t(`${p}.recordMilestone`),
    refreshTrust: t(`${p}.refreshTrust`),
    updatePreferences: t(`${p}.updatePreferences`),
    disablePersonalization: t(`${p}.disablePersonalization`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    acting: t(`${p}.acting`),
    achieved: t(`${p}.achieved`),
    pending: t(`${p}.pending`),
    satisfactionLabel: t(`${p}.satisfactionLabel`),
    governanceUserControlsPersonalization: t(`${p}.governanceUserControlsPersonalization`),
    governanceUserControlsMemory: t(`${p}.governanceUserControlsMemory`),
    governanceUserCanReview: t(`${p}.governanceUserCanReview`),
    governanceUserCanDisable: t(`${p}.governanceUserCanDisable`),
    governanceTrustTransparent: t(`${p}.governanceTrustTransparent`),
    executiveSummary: t(`${p}.executiveSummary`),
    adoptionLabel: t(`${p}.adoptionLabel`),
    engagementLabel: t(`${p}.engagementLabel`),
    trustLabel: t(`${p}.trustLabel`),
    strengthLabel: t(`${p}.strengthLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CompanionRelationshipDashboardPanel labels={labels} />
    </div>
  );
}
