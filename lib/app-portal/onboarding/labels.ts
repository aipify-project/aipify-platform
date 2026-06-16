import type { OnboardingLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildOnboardingLabels(t: Translator): OnboardingLabels {
  const p = "customerApp.portalStructure.gettingStarted";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    emptyCta: t(`${p}.emptyCta`),
    principle: t(`${p}.principle`),
    sections: {
      overview: t(`${p}.sections.overview`),
      checklist: t(`${p}.sections.checklist`),
      recommendations: t(`${p}.sections.recommendations`),
      milestones: t(`${p}.sections.milestones`),
      adoption: t(`${p}.sections.adoption`),
      completed: t(`${p}.sections.completed`),
    },
    overview: {
      progress: t(`${p}.overview.progress`),
      status: t(`${p}.overview.status`),
      nextSteps: t(`${p}.overview.nextSteps`),
      advisory: t(`${p}.overview.advisory`),
    },
    statuses: {
      not_started: t(`${p}.statuses.notStarted`),
      in_progress: t(`${p}.statuses.inProgress`),
      completed: t(`${p}.statuses.completed`),
    },
    taskStatuses: {
      not_started: t(`${p}.taskStatuses.notStarted`),
      in_progress: t(`${p}.taskStatuses.inProgress`),
      completed: t(`${p}.taskStatuses.completed`),
      optional: t(`${p}.taskStatuses.optional`),
    },
    categories: {
      organization: t(`${p}.categories.organization`),
      team: t(`${p}.categories.team`),
      security: t(`${p}.categories.security`),
      integrations: t(`${p}.categories.integrations`),
      business_packs: t(`${p}.categories.businessPacks`),
      knowledge_support: t(`${p}.categories.knowledgeSupport`),
    },
    tasks: {
      org_profile: t(`${p}.tasks.orgProfile`),
      org_settings: t(`${p}.tasks.orgSettings`),
      org_localization: t(`${p}.tasks.orgLocalization`),
      team_invite: t(`${p}.tasks.teamInvite`),
      team_admin_roles: t(`${p}.tasks.teamAdminRoles`),
      team_permissions: t(`${p}.tasks.teamPermissions`),
      security_2fa: t(`${p}.tasks.security2fa`),
      security_access: t(`${p}.tasks.securityAccess`),
      security_preferences: t(`${p}.tasks.securityPreferences`),
      integration_connect: t(`${p}.tasks.integrationConnect`),
      integration_health: t(`${p}.tasks.integrationHealth`),
      integration_sync: t(`${p}.tasks.integrationSync`),
      pack_install: t(`${p}.tasks.packInstall`),
      pack_review: t(`${p}.tasks.packReview`),
      pack_configure: t(`${p}.tasks.packConfigure`),
      knowledge_explore: t(`${p}.tasks.knowledgeExplore`),
      support_assistant: t(`${p}.tasks.supportAssistant`),
      support_contact: t(`${p}.tasks.supportContact`),
    },
    recommendations: {
      inviteAdmins: t(`${p}.recommendations.inviteAdmins`),
      enable2fa: t(`${p}.recommendations.enable2fa`),
      installFirstPack: t(`${p}.recommendations.installFirstPack`),
      reviewSupportAssistant: t(`${p}.recommendations.reviewSupportAssistant`),
      exploreExecutiveInsights: t(`${p}.recommendations.exploreExecutiveInsights`),
    },
    milestones: {
      org_setup_complete: t(`${p}.milestones.orgSetupComplete`),
      first_integration: t(`${p}.milestones.firstIntegration`),
      onboarding_complete: t(`${p}.milestones.onboardingComplete`),
    },
    adoption: {
      featuresExplored: t(`${p}.adoption.featuresExplored`),
      featuresNotDiscovered: t(`${p}.adoption.featuresNotDiscovered`),
      suggestedPacks: t(`${p}.adoption.suggestedPacks`),
      nextActions: t(`${p}.adoption.nextActions`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      requiredSteps: t(`${p}.faq.requiredSteps`),
      requiredStepsAnswer: t(`${p}.faq.requiredStepsAnswer`),
      revisit: t(`${p}.faq.revisit`),
      revisitAnswer: t(`${p}.faq.revisitAnswer`),
    },
    actions: {
      markComplete: t(`${p}.actions.markComplete`),
      dismissMilestone: t(`${p}.actions.dismissMilestone`),
    },
  };
}
