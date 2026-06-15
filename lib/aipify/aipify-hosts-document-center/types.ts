export type HostsDocumentCenterSectionKey =
  | "property_documents"
  | "safety_documents"
  | "vendor_documents"
  | "financial_documents"
  | "templates"
  | "archive";

export type HostsDocumentRow = {
  id: string;
  document_key: string;
  document_name: string;
  category: string;
  property_id: string | null;
  property: string;
  uploaded_by: string;
  upload_date: string;
  expiration_date: string | null;
  status: string;
  current_version: number;
  file_label: string;
  updated_at: string;
};

export type HostsDocumentVersionRow = {
  id: string;
  document_id: string;
  version_number: number;
  updated_by: string;
  updated_date: string;
  change_notes: string;
  file_label: string;
};

export type HostsDocumentTemplateRow = {
  id: string;
  template_key: string;
  template_name: string;
  template_type: string;
  description: string;
};

export type HostsPropertyVaultRow = {
  property_id: string;
  property_name: string;
  document_count: number;
  expiring_documents: number;
  recently_updated: Array<{ id: string; document_name: string; updated_at: string }>;
};

export type HostsPropertyOption = {
  id: string;
  display_name: string;
};

export type HostsDocumentStats = {
  total_documents: number;
  expiring_documents: number;
  archived_documents: number;
  template_count: number;
  property_vaults: number;
};

export type HostsDocumentCenterDashboard = {
  has_customer: boolean;
  enabled: boolean;
  package_key: string;
  active_section: string;
  positioning: string;
  governance: Record<string, boolean>;
  sections: Array<{ key: string; label: string }>;
  document_categories: string[];
  document_statuses: string[];
  template_types: string[];
  stats: HostsDocumentStats;
  property_vaults: HostsPropertyVaultRow[];
  properties: HostsPropertyOption[];
  documents: HostsDocumentRow[];
  document_versions: HostsDocumentVersionRow[];
  templates: HostsDocumentTemplateRow[];
};

export type HostsDocumentCenterActionResult = {
  success: boolean;
  document_id?: string;
  action_type?: string;
  summary?: string;
};
