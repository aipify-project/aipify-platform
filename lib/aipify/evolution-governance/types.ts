export const EVOLUTION_CATEGORIES = [
  "knowledge",
  "automation",
  "workflow",
  "blueprint",
  "marketplace",
  "prompt",
  "desktop",
  "policy",
] as const;

export const EVOLUTION_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export const EVOLUTION_STATUSES = [
  "proposed",
  "under_review",
  "approved",
  "scheduled",
  "implemented",
  "validated",
  "archived",
  "rejected",
] as const;

export type EvolutionProposal = {
  id: string;
  category: string;
  title: string;
  description: string;
  source: string;
  expected_value?: Record<string, unknown>;
  expected_benefits?: string | null;
  potential_risks?: string | null;
  risk_level: string;
  status: string;
  recommended_reviewers?: unknown;
  implementation_recommendation?: string | null;
  rollback_guidance?: string | null;
  confidence_level?: string;
  simulation_required?: boolean;
  simulation_validated?: boolean;
  approval_level_required?: string;
  created_at?: string;
  scheduled_at?: string | null;
  implemented_at?: string | null;
};

export type EvolutionHistoryEntry = {
  id: string;
  proposal_id?: string;
  outcome: string;
  implementation_status: string;
  notes?: string | null;
  recorded_at?: string;
  proposal_title?: string;
};

export type EvolutionGovernanceCard = {
  has_customer: boolean;
  open_proposals?: number;
  critical_pending?: number;
  suggestions_enabled?: boolean;
  philosophy?: string;
  human_authority_required?: boolean;
};

export type EvolutionGovernanceBoard = {
  has_customer: boolean;
  human_authority_required?: boolean;
  suggestions_enabled?: boolean;
  low_risk_auto_publish?: boolean;
  philosophy?: string;
  safety_note?: string;
  proposals: EvolutionProposal[];
  history: EvolutionHistoryEntry[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  approval_matrix?: Record<string, unknown>;
  categories?: Array<{ key: string; label: string; examples: string }>;
  status_flow?: string[];
  integrations?: Record<string, string>;
};

export type EvolutionProposalDetail = {
  proposal: EvolutionProposal & { supporting_evidence?: unknown; human_authority_required?: boolean };
  reviews: Array<{ id: string; decision: string; notes?: string | null; reviewed_at?: string }>;
  approvals: Array<{ id: string; approval_level: string; approved_at?: string }>;
  history: EvolutionHistoryEntry[];
};

export type EvolutionActionResult = {
  status?: string;
  human_authority_required?: boolean;
  note?: string;
  error?: string;
  autonomous_implementation?: boolean;
  rollback_guidance?: string | null;
};
