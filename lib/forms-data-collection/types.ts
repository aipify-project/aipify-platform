export type FormRecord = {
  id: string;
  form_number?: string | null;
  name: string;
  description?: string | null;
  form_type: string;
  status: string;
  version: number;
  is_public: boolean;
  business_pack_key?: string | null;
  department_name?: string | null;
  domain_name?: string | null;
  owner_name?: string | null;
  field_count?: number;
  submission_count?: number;
  updated_at?: string | null;
};

export type FormSubmission = {
  id: string;
  submission_number?: string | null;
  form_id: string;
  form_name?: string | null;
  submitter_name?: string | null;
  department_name?: string | null;
  status: string;
  approval_status: string;
  scan_reference?: string | null;
  submitted_at?: string | null;
  updated_at?: string | null;
};

export type FormTemplate = {
  id: string;
  template_key: string;
  name: string;
  description?: string | null;
  template_type: string;
  business_pack_key?: string | null;
  field_count?: number;
};

export type FormsDataCollectionCenter = {
  found: boolean;
  principle?: string;
  overview?: Record<string, unknown>;
  forms?: FormRecord[];
  submissions?: FormSubmission[];
  pending_approvals?: FormSubmission[];
  templates?: FormTemplate[];
  automation?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  field_types?: string[];
  audit_recent?: { action: string; summary: string; created_at: string }[];
  routes?: Record<string, string>;
};
