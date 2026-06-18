import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type CommunityNetworkSection =
  | "overview"
  | "discussions"
  | "knowledge"
  | "bestPractices"
  | "industryGroups"
  | "partnerNetwork"
  | "events"
  | "certifications"
  | "reputation"
  | "intelligence"
  | "successStories"
  | "executive"
  | "governance"
  | "marketplace";

export type ReputationTier =
  | "new_member"
  | "active_contributor"
  | "trusted_contributor"
  | "community_expert"
  | "community_leader";

export type HubHighlight = {
  id: string;
  highlightKey: string;
  title: string;
  summary: string;
  highlightType: string;
  statusKey: OperationsStatusKey;
  itemType: "highlight";
};

export type DiscussionItem = {
  id: string;
  discussionKey: string;
  title: string;
  summary: string;
  category: string;
  discussionType: string;
  repliesLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "discussion";
};

export type IndustryGroup = {
  id: string;
  groupKey: string;
  groupName: string;
  summary: string;
  membersLabel: string;
  joined: boolean;
  statusKey: OperationsStatusKey;
  itemType: "industry_group";
};

export type BestPracticeItem = {
  id: string;
  practiceKey: string;
  title: string;
  summary: string;
  practiceType: string;
  moderationStatus: string;
  statusKey: OperationsStatusKey;
  itemType: "best_practice";
};

export type ReputationMetric = {
  id: string;
  metricKey: string;
  title: string;
  valueLabel: string;
  reputationTier: ReputationTier;
  statusKey: OperationsStatusKey;
  itemType: "reputation_metric";
};

export type CommunityEvent = {
  id: string;
  eventKey: string;
  title: string;
  summary: string;
  eventType: string;
  eventTiming: string;
  dateLabel: string;
  registrationLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "event";
};

export type PartnerNetworkItem = {
  id: string;
  itemKey: string;
  title: string;
  summary: string;
  partnerArea: string;
  statusKey: OperationsStatusKey;
  itemType: "partner_network";
};

export type IntelligenceItem = {
  id: string;
  insightKey: string;
  title: string;
  insight: string;
  feedTarget: string;
  statusKey: OperationsStatusKey;
  itemType: "intelligence";
};

export type CompanionGuidance = {
  id: string;
  guidanceKey: string;
  exampleQuestion: string;
  answerSummary: string;
  relatedContent: string;
  statusKey: OperationsStatusKey;
  itemType: "companion_guidance";
};

export type SuccessStory = {
  id: string;
  storyKey: string;
  title: string;
  summary: string;
  storyType: string;
  statusKey: OperationsStatusKey;
  itemType: "success_story";
};

export type CertificationItem = {
  id: string;
  certKey: string;
  title: string;
  summary: string;
  progressLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "certification";
};

export type MarketplacePrepItem = {
  id: string;
  prepKey: string;
  title: string;
  summary: string;
  architectureNote: string;
  statusKey: OperationsStatusKey;
  itemType: "marketplace_prep";
};

export type ExecutiveMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type GovernanceControl = {
  id: string;
  governanceKey: string;
  title: string;
  summary: string;
  roleScope: string;
  statusKey: OperationsStatusKey;
  itemType: "governance";
};

export type AuditItem = {
  id: string;
  itemType: string;
  action: string;
  description: string;
  createdAt: string;
};

export type CommunityNetworkCenter = {
  found: boolean;
  error?: string;
  memberReputationTier?: ReputationTier;
  memberReputationStatusKey?: OperationsStatusKey;
  marketplacePrepEnabled?: boolean;
  canManage?: boolean;
  canModerate?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  corePrinciple?: string;
  hubHighlights: HubHighlight[];
  discussions: DiscussionItem[];
  industryGroups: IndustryGroup[];
  bestPractices: BestPracticeItem[];
  reputationMetrics: ReputationMetric[];
  events: CommunityEvent[];
  partnerNetwork: PartnerNetworkItem[];
  communityIntelligence: IntelligenceItem[];
  companionGuidance: CompanionGuidance[];
  successStories: SuccessStory[];
  certifications: CertificationItem[];
  marketplacePrep: MarketplacePrepItem[];
  executiveOverview: ExecutiveMetric[];
  governanceControls: GovernanceControl[];
  auditHistory: AuditItem[];
  statistics: {
    discussionCount: number;
    groupCount: number;
    eventCount: number;
    storyCount: number;
  };
};
