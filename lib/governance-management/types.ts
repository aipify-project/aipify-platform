export type GovernancePolicy = {
  id: string;
  policy_number: string;
  title: string;
  description: string;
  category: string;
  status: string;
  requires_acknowledgement?: boolean;
  review_date?: string | null;
  effective_date?: string | null;
};

export type GovernanceCenter = {
  found: boolean;
  principle?: string;
  companion_note?: string;
  visibility?: { scope?: string };
  overview?: {
    governance_health?: number;
    open_risks?: number;
    pending_approvals?: number;
    pending_access_reviews?: number;
    active_policies?: number;
    expiring_policies?: number;
    pending_acknowledgements?: number;
    compliance_attention?: number;
    control_violations_30d?: number;
  };
  policies?: GovernancePolicy[];
  approvals?: Record<string, unknown>[];
  access_reviews?: Record<string, unknown>[];
  compliance?: Record<string, unknown> & { records?: Record<string, unknown>[] };
  risks?: Record<string, unknown>[];
  controls?: Record<string, unknown>[];
  audit_recent?: { event_type: string; event_category: string; summary: string; created_at: string }[];
  reports?: Record<string, unknown>;
  routes?: Record<string, string>;
};
