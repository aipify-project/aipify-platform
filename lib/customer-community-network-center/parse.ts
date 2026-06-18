import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AuditItem,
  BestPracticeItem,
  CertificationItem,
  CommunityEvent,
  CommunityNetworkCenter,
  CompanionGuidance,
  DiscussionItem,
  ExecutiveMetric,
  GovernanceControl,
  HubHighlight,
  IndustryGroup,
  IntelligenceItem,
  MarketplacePrepItem,
  PartnerNetworkItem,
  ReputationMetric,
  ReputationTier,
  SuccessStory,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown): boolean {
  return value === true;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseHighlight(raw: unknown): HubHighlight {
  const d = asRecord(raw);
  return {
    id: asString(d.id), highlightKey: asString(d.highlight_key), title: asString(d.title),
    summary: asString(d.summary), highlightType: asString(d.highlight_type),
    statusKey: asStatus(d.status_key), itemType: "highlight",
  };
}
function parseDiscussion(raw: unknown): DiscussionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), discussionKey: asString(d.discussion_key), title: asString(d.title),
    summary: asString(d.summary), category: asString(d.category), discussionType: asString(d.discussion_type),
    repliesLabel: asString(d.replies_label), statusKey: asStatus(d.status_key), itemType: "discussion",
  };
}
function parseGroup(raw: unknown): IndustryGroup {
  const d = asRecord(raw);
  return {
    id: asString(d.id), groupKey: asString(d.group_key), groupName: asString(d.group_name),
    summary: asString(d.summary), membersLabel: asString(d.members_label), joined: asBool(d.joined),
    statusKey: asStatus(d.status_key), itemType: "industry_group",
  };
}
function parsePractice(raw: unknown): BestPracticeItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), practiceKey: asString(d.practice_key), title: asString(d.title),
    summary: asString(d.summary), practiceType: asString(d.practice_type),
    moderationStatus: asString(d.moderation_status), statusKey: asStatus(d.status_key), itemType: "best_practice",
  };
}
function parseReputation(raw: unknown): ReputationMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), title: asString(d.title),
    valueLabel: asString(d.value_label), reputationTier: asString(d.reputation_tier, "new_member") as ReputationTier,
    statusKey: asStatus(d.status_key), itemType: "reputation_metric",
  };
}
function parseEvent(raw: unknown): CommunityEvent {
  const d = asRecord(raw);
  return {
    id: asString(d.id), eventKey: asString(d.event_key), title: asString(d.title), summary: asString(d.summary),
    eventType: asString(d.event_type), eventTiming: asString(d.event_timing), dateLabel: asString(d.date_label),
    registrationLabel: asString(d.registration_label), statusKey: asStatus(d.status_key), itemType: "event",
  };
}
function parsePartner(raw: unknown): PartnerNetworkItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemKey: asString(d.item_key), title: asString(d.title), summary: asString(d.summary),
    partnerArea: asString(d.partner_area), statusKey: asStatus(d.status_key), itemType: "partner_network",
  };
}
function parseIntelligence(raw: unknown): IntelligenceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), insightKey: asString(d.insight_key), title: asString(d.title), insight: asString(d.insight),
    feedTarget: asString(d.feed_target), statusKey: asStatus(d.status_key), itemType: "intelligence",
  };
}
function parseCompanion(raw: unknown): CompanionGuidance {
  const d = asRecord(raw);
  return {
    id: asString(d.id), guidanceKey: asString(d.guidance_key), exampleQuestion: asString(d.example_question),
    answerSummary: asString(d.answer_summary), relatedContent: asString(d.related_content),
    statusKey: asStatus(d.status_key), itemType: "companion_guidance",
  };
}
function parseStory(raw: unknown): SuccessStory {
  const d = asRecord(raw);
  return {
    id: asString(d.id), storyKey: asString(d.story_key), title: asString(d.title), summary: asString(d.summary),
    storyType: asString(d.story_type), statusKey: asStatus(d.status_key), itemType: "success_story",
  };
}
function parseCert(raw: unknown): CertificationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), certKey: asString(d.cert_key), title: asString(d.title), summary: asString(d.summary),
    progressLabel: asString(d.progress_label), statusKey: asStatus(d.status_key), itemType: "certification",
  };
}
function parseMarketplace(raw: unknown): MarketplacePrepItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), prepKey: asString(d.prep_key), title: asString(d.title), summary: asString(d.summary),
    architectureNote: asString(d.architecture_note), statusKey: asStatus(d.status_key), itemType: "marketplace_prep",
  };
}
function parseExecutive(raw: unknown): ExecutiveMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}
function parseGovernance(raw: unknown): GovernanceControl {
  const d = asRecord(raw);
  return {
    id: asString(d.id), governanceKey: asString(d.governance_key), title: asString(d.title),
    summary: asString(d.summary), roleScope: asString(d.role_scope),
    statusKey: asStatus(d.status_key), itemType: "governance",
  };
}
function parseAudit(raw: unknown): AuditItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), itemType: asString(d.item_type), action: asString(d.action),
    description: asString(d.description), createdAt: asString(d.created_at),
  };
}

const empty: CommunityNetworkCenter = {
  found: false,
  hubHighlights: [], discussions: [], industryGroups: [], bestPractices: [], reputationMetrics: [],
  events: [], partnerNetwork: [], communityIntelligence: [], companionGuidance: [], successStories: [],
  certifications: [], marketplacePrep: [], executiveOverview: [], governanceControls: [], auditHistory: [],
  statistics: { discussionCount: 0, groupCount: 0, eventCount: 0, storyCount: 0 },
};

export function parseCommunityNetworkCenter(raw: unknown): CommunityNetworkCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...empty, error: asString(d.error) || undefined };
  const stats = asRecord(d.statistics);
  return {
    found: true,
    memberReputationTier: asString(d.member_reputation_tier, "new_member") as ReputationTier,
    memberReputationStatusKey: asStatus(d.member_reputation_status_key),
    marketplacePrepEnabled: asBool(d.marketplace_prep_enabled),
    canManage: asBool(d.can_manage),
    canModerate: asBool(d.can_moderate),
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    corePrinciple: asString(d.core_principle) || undefined,
    hubHighlights: Array.isArray(d.hub_highlights) ? d.hub_highlights.map(parseHighlight) : [],
    discussions: Array.isArray(d.discussions) ? d.discussions.map(parseDiscussion) : [],
    industryGroups: Array.isArray(d.industry_groups) ? d.industry_groups.map(parseGroup) : [],
    bestPractices: Array.isArray(d.best_practices) ? d.best_practices.map(parsePractice) : [],
    reputationMetrics: Array.isArray(d.reputation_metrics) ? d.reputation_metrics.map(parseReputation) : [],
    events: Array.isArray(d.events) ? d.events.map(parseEvent) : [],
    partnerNetwork: Array.isArray(d.partner_network) ? d.partner_network.map(parsePartner) : [],
    communityIntelligence: Array.isArray(d.community_intelligence) ? d.community_intelligence.map(parseIntelligence) : [],
    companionGuidance: Array.isArray(d.companion_guidance) ? d.companion_guidance.map(parseCompanion) : [],
    successStories: Array.isArray(d.success_stories) ? d.success_stories.map(parseStory) : [],
    certifications: Array.isArray(d.certifications) ? d.certifications.map(parseCert) : [],
    marketplacePrep: Array.isArray(d.marketplace_prep) ? d.marketplace_prep.map(parseMarketplace) : [],
    executiveOverview: Array.isArray(d.executive_overview) ? d.executive_overview.map(parseExecutive) : [],
    governanceControls: Array.isArray(d.governance_controls) ? d.governance_controls.map(parseGovernance) : [],
    auditHistory: Array.isArray(d.audit_history) ? d.audit_history.map(parseAudit) : [],
    statistics: {
      discussionCount: asNumber(stats.discussion_count),
      groupCount: asNumber(stats.group_count),
      eventCount: asNumber(stats.event_count),
      storyCount: asNumber(stats.story_count),
    },
  };
}
