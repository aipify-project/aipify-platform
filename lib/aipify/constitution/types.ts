export type CorePrinciple = {
  id: string;
  principle_key: string;
  principle_number: number;
  title: string;
  description: string;
  category: string;
  acknowledged?: boolean;
};

export type ResponsibleAiCommitment = {
  id: string;
  principle_key: string;
  title: string;
  description: string;
};

export type CommitmentRecord = {
  id: string;
  title: string;
  description: string;
  commitment_type: string;
  status: string;
};

export type ConstitutionalReview = {
  id: string;
  review_type: string;
  title: string;
  summary?: string | null;
  status: string;
  alignment_score?: number | null;
  scheduled_at?: string | null;
};

export type PartnerAlignment = {
  id: string;
  partner_name: string;
  alignment_status: string;
  alignment_score: number;
  notes?: string | null;
};

export type GovernanceDecision = {
  id: string;
  title: string;
  summary: string;
  principles_applied?: string[];
  decision_area: string;
};

export type ConstitutionCard = {
  has_customer: boolean;
  constitution_score?: number;
  principles_count?: number;
  current_version?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type ConstitutionDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  constitution_enabled?: boolean;
  acknowledgement_required?: boolean;
  partner_alignment_tracking?: boolean;
  current_version?: string;
  review_cycle_months?: number;
  constitution_score?: number;
  principles_count?: number;
  principles_acknowledged?: number;
  alignment_score?: number;
  partner_alignment_avg?: number;
  preamble?: string;
  decision_framework?: string[];
  core_principles: CorePrinciple[];
  responsible_ai_commitments: ResponsibleAiCommitment[];
  commitment_records: CommitmentRecord[];
  constitutional_reviews: ConstitutionalReview[];
  partner_alignment: PartnerAlignment[];
  governance_decisions: GovernanceDecision[];
  review_process?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type ConstitutionActionResult = {
  status?: string;
  error?: string;
};

export type ConstitutionBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
