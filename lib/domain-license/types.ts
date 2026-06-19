export type DomainRecord = {
  id: string;
  domain: string;
  display_name?: string;
  domain_status: string;
  connected_platform?: string;
  license_status?: string;
  is_primary?: boolean;
  verification_status?: string;
  installed_packs?: { pack_key: string; license_status: string; installed_at?: string }[];
  assigned_users?: number;
  created_at?: string;
};

export type DomainLicenseCenter = {
  found: boolean;
  principle?: string;
  structure?: string;
  primary_domain_id?: string;
  license_summary?: {
    purchased: number;
    used: number;
    available: number;
    included: number;
    purchased_additional: number;
  };
  active_domains?: DomainRecord[];
  pending_domains?: DomainRecord[];
  installed_packs?: {
    domain_id: string;
    domain: string;
    pack_key: string;
    license_status: string;
    installed_at?: string;
  }[];
  supported_platforms?: string[];
  store_route?: string;
  domain_license_product_route?: string;
};

export type DomainOption = {
  domain_id: string;
  domain: string;
  display_name?: string;
  domain_status?: string;
  connected_platform?: string;
  is_primary?: boolean;
  license_status?: string;
};
