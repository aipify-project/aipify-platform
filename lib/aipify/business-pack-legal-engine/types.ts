export type LegalDocumentKey =
  | "terms_and_conditions"
  | "license_agreement"
  | "acceptable_use_policy"
  | "privacy_addendum"
  | "subscription_terms"
  | "cancellation_policy"
  | "limitation_of_liability"
  | "governing_law";

export type LegalDocument = {
  document_key: LegalDocumentKey | string;
  title: string;
  version: string;
  body_template: string;
  body?: string;
  effective_date: string;
  published_at: string;
  requires_acceptance: boolean;
  accepted: boolean;
};

export type AcceptanceItem = {
  document_key: string;
  title: string;
  version: string;
  accepted: boolean;
};

export type BusinessPackLegalCenter = {
  found: boolean;
  pack_key?: string;
  principle?: string;
  definition?: {
    pack_name: string;
    publication_status: string;
    pack_terms: Record<string, string>;
    governing_law: string;
    jurisdiction: string;
    company_field_placeholders: string[];
    company_config_source: string;
  };
  overview?: {
    governing_law: string;
    jurisdiction: string;
    publication_status: string;
    all_required_accepted: boolean;
    activation_blocked: boolean;
  };
  documents?: LegalDocument[];
  acceptance_required?: AcceptanceItem[];
  company?: {
    legal_company_name: string;
    organization_number: string;
    headquarters_address: string;
    country: string;
    contact_email: string;
    website: string;
  };
  mandatory_documents?: string[];
  governance_note?: string;
  legal_center_route?: string;
};

export type BusinessPackLegalEngineDashboard = {
  has_access: boolean;
  is_platform_admin?: boolean;
  principle?: string;
  mandatory_documents?: string[];
  governance?: Record<string, string>;
  forbidden?: string[];
  summary?: Record<string, number>;
  definitions?: Array<Record<string, unknown>>;
  recent_audit?: Array<Record<string, unknown>>;
  success_criteria?: string[];
};
