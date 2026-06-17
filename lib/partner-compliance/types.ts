export type PartnerComplianceDashboard = {
  compliance_status: string;
  business_verification_status: string;
  identity_verification_status: string;
  self_billing_agreement_status: string;
  tax_information_status: string;
  settlement_eligibility: string;
  banking_verification_status: string;
  health_score_label: string;
  health_score_pct: number;
  requirements_approved: boolean;
  country_code: string;
};

export type PartnerComplianceOverview = {
  has_access: boolean;
  can_write?: boolean;
  team_role?: string;
  access_denied?: boolean;
  filtered_out?: boolean;
  positioning?: string;
  dashboard?: PartnerComplianceDashboard;
  business?: {
    company_name: string;
    registration_number: string;
    vat_number: string;
    country_code: string;
    registered_address: string;
    legal_representative: string;
    verification_status: string;
  };
  banking?: {
    account_holder: string;
    account_number: string;
    iban: string;
    swift_bic: string;
    country_code: string;
    verification_status: string;
    expires_at: string;
  };
  alerts?: Array<{ alert_key: string; message: string; severity: string }>;
  timeline?: Array<{
    id: string;
    event_type: string;
    title: string;
    summary: string;
    created_at: string;
  }>;
  empty_state?: {
    title: string;
    message: string;
    cta: string;
  };
};

export type PartnerComplianceDocuments = {
  has_access: boolean;
  documents: Array<{
    id: string;
    document_type: string;
    file_name: string;
    document_status: string;
    expires_at: string;
    created_at: string;
  }>;
};

export type PartnerComplianceTaxProfile = {
  has_access: boolean;
  tax_profile: {
    vat_registered: boolean;
    vat_number: string;
    country_code: string;
    tax_classification: string;
    reverse_charge_eligible: boolean;
    additional_tax_references: unknown[];
    profile_status: string;
    verified_at: string;
  };
};

export type PartnerComplianceAgreements = {
  has_access: boolean;
  current: {
    agreement_version: string;
    accepted: boolean;
    accepted_at: string;
    accepted_by: string | null;
    status: string;
  };
  history: Array<{
    agreement_version: string;
    accepted: boolean;
    accepted_at: string;
    status: string;
  }>;
};

export type PartnerComplianceFilters = {
  compliance_status?: string;
  country?: string;
  verification_status?: string;
  agreement_status?: string;
  tax_status?: string;
  date_from?: string;
  search?: string;
  document_status?: string;
};
