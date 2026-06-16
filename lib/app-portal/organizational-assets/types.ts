export type AssetType =
  | "software_license"
  | "hardware"
  | "subscription"
  | "domain_name"
  | "api_key_reference"
  | "shared_account"
  | "training_resource"
  | "internal_resource"
  | "documentation_resource"
  | "custom_asset";

export type AssetStatus =
  | "active"
  | "under_review"
  | "pending_renewal"
  | "retired"
  | "archived";

export type AssetCriticalityLevel = "low" | "moderate" | "high" | "mission_critical";

export type OrganizationalAssetItem = {
  id: string;
  asset_name: string;
  asset_type: AssetType;
  description?: string;
  description_full?: string;
  owner_id?: string | null;
  owner_name: string;
  backup_owner_id?: string | null;
  backup_owner_name: string;
  status: AssetStatus;
  vendor: string;
  purchase_date?: string | null;
  renewal_date?: string | null;
  renewal_reminder_date?: string | null;
  criticality_level: AssetCriticalityLevel;
  internal_notes?: string;
  internal_notes_full?: string;
  related_modules?: string[];
  related_external_relationship_ids?: string[];
  needs_review?: boolean;
  renewal_upcoming?: boolean;
  renewal_expired?: boolean;
  created_at: string;
  updated_at: string;
};

export type AssetRecommendation = {
  id: string;
  key: string;
  priority: string;
  asset_id?: string;
};

export type OrganizationalAssetsDashboard = {
  active: number;
  needs_review: number;
  upcoming_renewals: number;
  mission_critical: number;
  without_owner: number;
  recently_updated: OrganizationalAssetItem[];
};

export type OrganizationalAssetListResponse = {
  found: boolean;
  can_manage?: boolean;
  items: OrganizationalAssetItem[];
  dashboard?: OrganizationalAssetsDashboard;
  recommendations?: AssetRecommendation[];
  principle?: string;
};

export type OrganizationalAssetDetail = {
  found: boolean;
  can_manage?: boolean;
  asset?: OrganizationalAssetItem;
  related_risks?: Array<{ id: string; title: string; status: string }>;
  related_follow_ups?: Array<{ id: string; title: string; status: string }>;
  related_external_relationships?: Array<{ id: string; name: string; status: string }>;
  renewal_history?: Array<{ id: string; description: string; created_at: string; performed_by: string }>;
  activity_timeline?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  audit_history?: Array<{ id: string; event_type: string; description: string; created_at: string; performed_by: string }>;
  recommendations?: AssetRecommendation[];
};

export type OrganizationalAssetsLabels = {
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
    vendor: string;
    criticality: string;
    renewalBefore: string;
    all: string;
  };
  dashboard: {
    active: string;
    needsReview: string;
    upcomingRenewals: string;
    missionCritical: string;
    withoutOwner: string;
    recent: string;
  };
  form: {
    createTitle: string;
    assetName: string;
    type: string;
    description: string;
    vendor: string;
    purchaseDate: string;
    renewalDate: string;
    renewalReminder: string;
    criticality: string;
    notes: string;
    referenceNote: string;
    submit: string;
    cancel: string;
  };
  card: {
    owner: string;
    backupOwner: string;
    vendor: string;
    renewalDate: string;
    criticality: string;
    view: string;
  };
  detail: {
    overview: string;
    ownership: string;
    vendorInfo: string;
    renewals: string;
    relatedFollowUps: string;
    relatedRisks: string;
    relatedRelationships: string;
    relatedModules: string;
    renewalHistory: string;
    activity: string;
    audit: string;
    save: string;
    saved: string;
    recommendations: string;
    renewalNote: string;
    recordRenewal: string;
  };
  types: Record<AssetType, string>;
  statuses: Record<AssetStatus, string>;
  criticality: Record<AssetCriticalityLevel, string>;
  recommendations: Record<string, string>;
  faq: {
    title: string;
    whatIs: string;
    whatIsAnswer: string;
    apiKeys: string;
    apiKeysAnswer: string;
    owners: string;
    ownersAnswer: string;
  };
};
