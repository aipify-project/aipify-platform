export type PartnerMaterial = {
  id: string;
  material_key: string;
  title: string;
  description: string;
  category: string;
  language_code: string;
  format_type: string;
  industry: string;
  business_pack: string;
  version_label: string;
  is_current: boolean;
  published_at: string;
  updated_at: string;
  download_count: number;
  usage_recommendations: string;
  release_notes: string;
  customizable: boolean;
  preview_url: string;
  download_url: string;
  is_favorite: boolean;
};

export type PartnerMaterialsOverview = {
  has_access: boolean;
  can_write?: boolean;
  can_favorite?: boolean;
  team_role?: string;
  access_denied?: boolean;
  positioning?: string;
  dashboard?: {
    available_materials: number;
    recently_updated: PartnerMaterial[];
    most_downloaded: PartnerMaterial[];
    language_coverage: string[];
    readiness_score: number;
  };
  materials: PartnerMaterial[];
  centers?: {
    discovery: PartnerMaterial[];
    objections: PartnerMaterial[];
    email_templates: PartnerMaterial[];
    social: PartnerMaterial[];
    campaign_packs: PartnerMaterial[];
  };
  empty_state?: {
    title: string;
    message: string;
    cta: string;
  };
};

export type PartnerMaterialsCategories = {
  has_access: boolean;
  categories: Array<{ category: string; count: number }>;
  formats: string[];
  languages: string[];
};

export type PartnerMaterialsFavorites = {
  has_access: boolean;
  favorites: PartnerMaterial[];
  collections: Array<{
    id: string;
    title: string;
    collection_type: string;
    pack_type: string;
    item_count: number;
  }>;
};

export type PartnerMaterialsRecommended = {
  has_access: boolean;
  recommended: PartnerMaterial[];
};

export type PartnerMaterialsFilters = {
  category?: string;
  language?: string;
  format?: string;
  industry?: string;
  business_pack?: string;
  version?: string;
  search?: string;
};
