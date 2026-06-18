import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type RelationshipSectionKey =
  | "customer_relationships"
  | "employee_relationships"
  | "vendor_relationships"
  | "partner_relationships"
  | "project_relationships"
  | "dependency_map";

export type RelationshipEntity = {
  id: string;
  title: string;
  summary: string;
  entityType: string;
  sectionKey: RelationshipSectionKey;
  owner: string;
  department: string;
  statusKey: OperationsStatusKey;
  riskLevel: string;
  lastContactAt?: string | null;
  openTasks?: number;
  openSupportCases?: number;
  revenueLabel?: string;
  contractExpiresAt?: string | null;
  blockedBy?: string;
  dependencies?: unknown[];
  suggestedAction?: string;
  itemType: "entity";
};

export type RelationshipRisk = {
  id: string;
  title: string;
  summary: string;
  riskType: string;
  statusKey: OperationsStatusKey;
  owner: string;
  suggestedAction?: string;
  itemType: "risk";
};

export type RelationshipTimelineEvent = {
  id: string;
  eventType: string;
  title: string;
  summary: string;
  occurredAt?: string;
  itemType: "timeline";
};

export type CompanionRelationshipRecommendation = {
  id: string;
  title: string;
  summary: string;
  recommendationType: string;
  statusKey: OperationsStatusKey;
  suggestedAction?: string;
  status: string;
  itemType: "recommendation";
};

export type ExecutiveRelationshipDashboard = {
  mostImportantCustomers: Array<Record<string, unknown>>;
  mostImportantVendors: Array<Record<string, unknown>>;
  mostImportantProjects: Array<Record<string, unknown>>;
  relationshipRisks: number;
  relationshipOpportunities: number;
};

export type OrganizationalRelationshipIntelligence = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  sections: {
    customerRelationships: RelationshipEntity[];
    employeeRelationships: RelationshipEntity[];
    vendorRelationships: RelationshipEntity[];
    partnerRelationships: RelationshipEntity[];
    projectRelationships: RelationshipEntity[];
    dependencyMap: RelationshipEntity[];
  };
  organizationalRisks: RelationshipRisk[];
  relationshipTimeline: RelationshipTimelineEvent[];
  companionRecommendations: CompanionRelationshipRecommendation[];
  executiveDashboard: ExecutiveRelationshipDashboard;
  statistics: {
    customerCount: number;
    employeeCount: number;
    vendorCount: number;
    partnerCount: number;
    projectCount: number;
    dependencyCount: number;
    riskCount: number;
    recommendationCount: number;
  };
  error?: string;
};
