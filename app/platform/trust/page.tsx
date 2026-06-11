import PlatformAssistantMemoryPanel from "@/components/platform/PlatformAssistantMemoryPanel";
import PlatformLifeOsPanel from "@/components/platform/PlatformLifeOsPanel";
import PlatformContextPanel from "@/components/platform/PlatformContextPanel";
import PlatformAttentionPanel from "@/components/platform/PlatformAttentionPanel";
import PlatformDecisionPanel from "@/components/platform/PlatformDecisionPanel";
import PlatformBusinessDnaPanel from "@/components/platform/PlatformBusinessDnaPanel";
import PlatformSupportOperationsPanel from "@/components/platform/PlatformSupportOperationsPanel";
import PlatformGoalsPanel from "@/components/platform/PlatformGoalsPanel";
import PlatformIdentityPanel from "@/components/platform/PlatformIdentityPanel";
import PlatformRelationshipPanel from "@/components/platform/PlatformRelationshipPanel";
import PlatformTrustActionsPanel from "@/components/platform/PlatformTrustActionsPanel";
import { PlatformTrustScaffold } from "@/components/platform/trust";
import {
  ALLOWED_STORAGE_CATEGORIES,
  DATA_ACCESS_LEVELS,
  PROHIBITED_STORAGE_CATEGORIES,
} from "@/lib/trust";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformTrustPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  const supabase = await createClient();
  const { data: governance } = await supabase.rpc("get_platform_trust_governance");

  const statsValue = governance
    ? t("platform.trust.statsValue")
        .replace("{allowed}", String(ALLOWED_STORAGE_CATEGORIES.length))
        .replace("{prohibited}", String(PROHIBITED_STORAGE_CATEGORIES.length))
        .replace("{levels}", String(DATA_ACCESS_LEVELS.length))
        .replace("{audits}", String(governance.audit_event_count ?? 0))
    : undefined;

  return (
    <>
      <PlatformAssistantMemoryPanel
        labels={{
          title: t("platform.assistantMemory.title"),
          subtitle: t("platform.assistantMemory.subtitle"),
          loading: t("platform.assistantMemory.loading"),
          active: t("platform.assistantMemory.active"),
          tenants: t("platform.assistantMemory.tenants"),
          disabled: t("platform.assistantMemory.disabled"),
          byCategory: t("platform.assistantMemory.byCategory"),
          privacyNote: t("platform.assistantMemory.privacyNote"),
        }}
      />
      <PlatformSupportOperationsPanel
        labels={{
          title: t("platform.supportOperations.title"),
          subtitle: t("platform.supportOperations.subtitle"),
          loading: t("platform.supportOperations.loading"),
          profiles: t("platform.supportOperations.profiles"),
          openCases: t("platform.supportOperations.openCases"),
          autoReplied: t("platform.supportOperations.autoReplied"),
          escalated: t("platform.supportOperations.escalated"),
          gaps: t("platform.supportOperations.gaps"),
          privacyNote: t("platform.supportOperations.privacyNote"),
        }}
      />
      <PlatformBusinessDnaPanel
        labels={{
          title: t("platform.businessDna.title"),
          subtitle: t("platform.businessDna.subtitle"),
          loading: t("platform.businessDna.loading"),
          profiles: t("platform.businessDna.profiles"),
          active: t("platform.businessDna.active"),
          templates: t("platform.businessDna.templates"),
          knowledge: t("platform.businessDna.knowledge"),
          drafts: t("platform.businessDna.drafts"),
          avgHealth: t("platform.businessDna.avgHealth"),
          privacyNote: t("platform.businessDna.privacyNote"),
        }}
      />
      <PlatformDecisionPanel
        labels={{
          title: t("platform.decisionSupport.title"),
          subtitle: t("platform.decisionSupport.subtitle"),
          loading: t("platform.decisionSupport.loading"),
          profiles: t("platform.decisionSupport.profiles"),
          pending: t("platform.decisionSupport.pending"),
          accepted: t("platform.decisionSupport.accepted"),
          byDomain: t("platform.decisionSupport.byDomain"),
          byConfidence: t("platform.decisionSupport.byConfidence"),
          privacyNote: t("platform.decisionSupport.privacyNote"),
        }}
      />
      <PlatformAttentionPanel
        labels={{
          title: t("platform.attentionGuardian.title"),
          subtitle: t("platform.attentionGuardian.subtitle"),
          loading: t("platform.attentionGuardian.loading"),
          profiles: t("platform.attentionGuardian.profiles"),
          activeFocus: t("platform.attentionGuardian.activeFocus"),
          blocks: t("platform.attentionGuardian.blocks"),
          enabled: t("platform.attentionGuardian.enabled"),
          privacyNote: t("platform.attentionGuardian.privacyNote"),
        }}
      />
      <PlatformGoalsPanel
        labels={{
          title: t("platform.goalsDreams.title"),
          subtitle: t("platform.goalsDreams.subtitle"),
          loading: t("platform.goalsDreams.loading"),
          users: t("platform.goalsDreams.users"),
          active: t("platform.goalsDreams.active"),
          completed: t("platform.goalsDreams.completed"),
          milestones: t("platform.goalsDreams.milestones"),
          byCategory: t("platform.goalsDreams.byCategory"),
          privacyNote: t("platform.goalsDreams.privacyNote"),
        }}
      />
      <PlatformContextPanel
        labels={{
          title: t("platform.contextEngine.title"),
          subtitle: t("platform.contextEngine.subtitle"),
          loading: t("platform.contextEngine.loading"),
          profiles: t("platform.contextEngine.profiles"),
          connections: t("platform.contextEngine.connections"),
          pending: t("platform.contextEngine.pending"),
          events: t("platform.contextEngine.events"),
          byMode: t("platform.contextEngine.byMode"),
          privacyNote: t("platform.contextEngine.privacyNote"),
        }}
      />
      <PlatformIdentityPanel
        labels={{
          title: t("platform.identity.title"),
          subtitle: t("platform.identity.subtitle"),
          loading: t("platform.identity.loading"),
          profiles: t("platform.identity.profiles"),
          onboarded: t("platform.identity.onboarded"),
          pending: t("platform.identity.pending"),
          byMode: t("platform.identity.byMode"),
          privacyNote: t("platform.identity.privacyNote"),
        }}
      />
      <PlatformRelationshipPanel
        labels={{
          title: t("platform.relationships.title"),
          subtitle: t("platform.relationships.subtitle"),
          loading: t("platform.relationships.loading"),
          tenants: t("platform.relationships.tenants"),
          people: t("platform.relationships.people"),
          notes: t("platform.relationships.notes"),
          timeline: t("platform.relationships.timeline"),
          disabled: t("platform.relationships.disabled"),
          byType: t("platform.relationships.byType"),
          privacyNote: t("platform.relationships.privacyNote"),
        }}
      />
      <PlatformLifeOsPanel
        labels={{
          title: t("platform.lifeOs.title"),
          subtitle: t("platform.lifeOs.subtitle"),
          loading: t("platform.lifeOs.loading"),
          tenants: t("platform.lifeOs.tenants"),
          checklists: t("platform.lifeOs.checklists"),
          memories: t("platform.lifeOs.memories"),
          reschedule: t("platform.lifeOs.reschedule"),
          byPriority: t("platform.lifeOs.byPriority"),
          byLifeArea: t("platform.lifeOs.byLifeArea"),
          privacyNote: t("platform.lifeOs.privacyNote"),
        }}
      />
      <PlatformTrustActionsPanel
        labels={{
          title: t("platform.trustActions.title"),
          subtitle: t("platform.trustActions.subtitle"),
          loading: t("platform.trustActions.loading"),
          pending: t("platform.trustActions.pending"),
          executed: t("platform.trustActions.executed"),
          rejected: t("platform.trustActions.rejected"),
          emergency: t("platform.trustActions.emergency"),
          highestRisk: t("platform.trustActions.highestRisk"),
          recentActivity: t("platform.trustActions.recentActivity"),
          noActivity: t("platform.trustActions.noActivity"),
        }}
      />
      <PlatformTrustScaffold
      title={t("platform.trust.title")}
      subtitle={t("platform.trust.subtitle")}
      statsLabel={t("platform.trust.statsLabel")}
      statsValue={statsValue}
      responsibility={
        typeof governance?.platform_responsibility === "string"
          ? governance.platform_responsibility
          : t("platform.trust.responsibility")
      }
      areas={[
        t("platform.trust.areas.governance"),
        t("platform.trust.areas.audit"),
        t("platform.trust.areas.learning"),
        t("platform.trust.areas.skills"),
        t("platform.trust.areas.offboarding"),
      ]}
    />
    </>
  );
}
