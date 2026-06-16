export type RelationshipType =
  | "supplier"
  | "strategic_partner"
  | "technology_vendor"
  | "consultant"
  | "outsourcing_provider"
  | "financial_institution"
  | "legal_advisor"
  | "insurance_provider"
  | "service_provider"
  | "custom";

export type RelationshipStatus =
  | "active"
  | "under_review"
  | "pending_renewal"
  | "suspended"
  | "ended";

export type CriticalityLevel = "low" | "moderate" | "high" | "mission_critical";

export type ExternalRelationshipItem = {
  id: string;
  organization_name: string;
  relationship_type: RelationshipType;
  primary_contact: string;
  secondary_contact: string;
  email: string;
  phone: string;
  country: string;
  status: RelationshipStatus;
  owner_id?: string | null;
  owner_name: string;
  stakeholder_ids?: string[];
  shared_with_ids?: string[];
  service_description?: string;
  service_description_full?: string;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  renewal_reminder_date?: string | null;
  criticality_level: CriticalityLevel;
  notes?: string;
  notes_full?: string;
  needs_review?: boolean;
  renewal_upcoming?: boolean;
  renewal_expired?: boolean;
  created_at: string;
  updated_at: string;
};

export type RelationshipRecommendation = {
  id: string;
  key: string;
  priority: string;
  relationship_id?: string;
};

export type ExternalRelationshipsDashboard = {
  active: number;
  upcoming_renewals: number;
  critical: number;
  needs_review: number;
  without_owner: number;
  recently_updated: ExternalRelationshipItem[];
};

export type ExternalRelationshipListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: ExternalRelationshipItem[];
  dashboard?: ExternalRelationshipsDashboard;
  recommendations?: RelationshipRecommendation[];
  principle?: string;
};

export type ExternalRelationshipDetail = {
  found: boolean;
  can_manage?: boolean;
  relationship?: ExternalRelationshipItem;
  stakeholders?: Array<{ user_id: string; name: string }>;
  related_risks?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  renewal_history?: Array<{ id: string; description: string; created_at: string; performed_by: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: RelationshipRecommendation[];
};

export type ExternalRelationshipsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  emptyTitle: string;
  emptyBody: string;
  emptyCta: string;
  back: string;
  notFound: string;
  filters: {
    search: string;
    type: string;
    status: string;
    owner: string;
    criticality: string;
    country: string;
    renewalBefore: string;
    all: string;
  };
  dashboard: {
    active: string;
    upcomingRenewals: string;
    critical: string;
    needsReview: string;
    withoutOwner: string;
    recent: string;
  };
  form: {
    createTitle: string;
    organizationName: string;
    type: string;
    primaryContact: string;
    secondaryContact: string;
    email: string;
    phone: string;
    country: string;
    criticality: string;
    serviceDescription: string;
    contractStart: string;
    contractEnd: string;
    renewalReminder: string;
    notes: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    contact: string;
    country: string;
    contractEnd: string;
    criticality: string;
    view: string;
  };
  detail: {
    overview: string;
    contacts: string;
    ownership: string;
    contracts: string;
    relatedRisks: string;
    relatedFollowUps: string;
    renewalHistory: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    renewalNote: string;
    recordRenewal: string;
  };
  types: Record<RelationshipType, string>;
  statuses: Record<RelationshipStatus, string>;
  criticality: Record<CriticalityLevel, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    owners: string;
    ownersAnswer: string;
    autoManage: string;
    autoManageAnswer: string;
  };
};
