export type BusinessPackIdentityStatus =
  | "active"
  | "beta"
  | "coming_soon"
  | "deprecated"
  | "retired";

export type BusinessPackIdentityCategory =
  | "hospitality"
  | "commerce"
  | "support"
  | "executive"
  | "operations"
  | "human_resources"
  | "marketing"
  | "intelligence"
  | "productivity"
  | "governance";

export type BusinessPackIdentityRecord = {
  pack_key: string;
  pack_name: string;
  pack_category: BusinessPackIdentityCategory;
  version: string;
  status: BusinessPackIdentityStatus;
  pack_logo_url: string | null;
  pack_cover_image_url: string | null;
  short_description: string;
  long_description: string;
  intended_audience: string;
  key_benefits: string[];
  business_value_statement: string;
  primary_use_cases: string[];
  expected_outcomes: string[];
  business_value: {
    why?: string;
    who_benefits?: string;
    problems_solved?: string;
    measurable_outcomes?: string;
  };
  features: string[];
  workspace_route: string | null;
  landing_route: string;
  knowledge_center_category: string | null;
  install_allowed: boolean;
  upgrade_route: string | null;
  release_notes_url: string | null;
  licensing_summary: string | null;
  catalog_pack_key: string | null;
};

export type BusinessPackIdentityLanding = {
  found: boolean;
  pack_key?: string;
  identity?: BusinessPackIdentityRecord;
  layout?: {
    header: { logo: string | null; name: string; version: string; status: string };
    hero: { cover: string | null; short_description: string; value_statement: string };
    overview: {
      long_description: string;
      audience: string;
      use_cases: string[];
      outcomes: string[];
    };
    business_value: BusinessPackIdentityRecord["business_value"];
    features: string[];
    knowledge_center_category: string | null;
    licensing: string | null;
  };
  actions?: {
    install_allowed: boolean;
    upgrade_route: string | null;
    activation_route: string;
    workspace_route: string | null;
    card_status: string;
  };
  governance_note?: string;
  versioning_note?: string;
};

export type BusinessPackIdentityEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  can_manage?: boolean;
  positioning?: string;
  categories?: string[];
  statuses?: Array<{ key: string; label: string; installable: boolean }>;
  version_format?: string;
  governance?: Record<string, string>;
  forbidden?: string[];
  success_criteria?: Record<string, number>;
  packs?: BusinessPackIdentityRecord[];
  recent_audit?: Array<Record<string, unknown>>;
  landing_experience?: string[];
};
