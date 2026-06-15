import type { EntityStatus, EntityType } from "./constants";

export type GroupParent = {
  id: string;
  legal_name: string;
  country_of_origin: string;
  tagline: string;
};

export type EntityMetrics = {
  active_users: number;
  active_subscriptions: number;
  support_open_cases: number;
};

export type BusinessEntity = {
  id: string;
  name: string;
  slug: string;
  entity_type: EntityType;
  status: EntityStatus;
  brand_name: string;
  primary_domain: string;
  company_id: string | null;
  customer_id: string | null;
  revenue_currency: string;
  payment_provider_keys: string[];
  departments_count: number;
  teams_count: number;
  administrators_count: number;
  verified_domains_count: number;
  metrics: EntityMetrics;
  created_at: string;
  updated_at: string;
};

export type GroupInvestment = {
  id: string;
  company_name: string;
  asset_class: string;
  ownership_percentage: number;
  investment_date: string | null;
  investment_amount: number | null;
  currency: string;
  status: string;
  notes: string;
};

export type SharedIntelligenceSignal = {
  id: string;
  source_entity_id: string | null;
  signal_type: string;
  summary: string;
  confidence: string;
  created_at: string;
};

export type GroupAuditEntry = {
  id: string;
  entity_id: string | null;
  event_type: string;
  summary: string;
  created_at: string;
};

export type HierarchyLevel = {
  level: number;
  name: string;
  key: string;
};

export type GroupOverviewCenter = {
  principle: string;
  foundation_statement: string;
  tagline: string;
  parent: GroupParent;
  summary: {
    total_entities: number;
    active_entities: number;
    active_users: number;
    active_subscriptions: number;
    investments_count: number;
    shared_signals_count: number;
  };
  entities: BusinessEntity[];
  investments: GroupInvestment[];
  shared_intelligence: SharedIntelligenceSignal[];
  recent_audit: GroupAuditEntry[];
  hierarchy_levels: HierarchyLevel[];
};

export type GroupOrganizationLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  foundationStatement: string;
  tagline: string;
  sections: {
    summary: string;
    entities: string;
    investments: string;
    sharedIntelligence: string;
    audit: string;
    hierarchy: string;
  };
  summary: {
    totalEntities: string;
    activeEntities: string;
    activeUsers: string;
    activeSubscriptions: string;
    investments: string;
    signals: string;
  };
  entities: {
    name: string;
    type: string;
    status: string;
    domain: string;
    users: string;
    subscriptions: string;
    departments: string;
    teams: string;
    empty: string;
    archive: string;
  };
  investments: {
    company: string;
    ownership: string;
    amount: string;
    status: string;
    empty: string;
  };
  intelligence: {
    type: string;
    confidence: string;
    empty: string;
  };
  audit: {
    empty: string;
  };
  entityTypes: Record<string, string>;
  statuses: Record<string, string>;
  signalTypes: Record<string, string>;
};
