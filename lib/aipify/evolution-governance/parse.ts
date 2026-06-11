import type {
  EvolutionGovernanceBoard,
  EvolutionGovernanceCard,
  EvolutionProposalDetail,
  EvolutionActionResult,
} from "./types";

export function parseEvolutionGovernanceCard(data: unknown): EvolutionGovernanceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    open_proposals: d.open_proposals as number | undefined,
    critical_pending: d.critical_pending as number | undefined,
    suggestions_enabled: d.suggestions_enabled as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    human_authority_required: d.human_authority_required as boolean | undefined,
  };
}

export function parseEvolutionGovernanceBoard(data: unknown): EvolutionGovernanceBoard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_authority_required: d.human_authority_required as boolean | undefined,
    suggestions_enabled: d.suggestions_enabled as boolean | undefined,
    low_risk_auto_publish: d.low_risk_auto_publish as boolean | undefined,
    philosophy: d.philosophy as string | undefined,
    safety_note: d.safety_note as string | undefined,
    proposals: Array.isArray(d.proposals) ? (d.proposals as EvolutionGovernanceBoard["proposals"]) : [],
    history: Array.isArray(d.history) ? (d.history as EvolutionGovernanceBoard["history"]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as EvolutionGovernanceBoard["briefings"]) : [],
    approval_matrix: d.approval_matrix as Record<string, unknown> | undefined,
    categories: Array.isArray(d.categories) ? (d.categories as EvolutionGovernanceBoard["categories"]) : [],
    status_flow: Array.isArray(d.status_flow) ? (d.status_flow as string[]) : [],
    integrations: d.integrations as Record<string, string> | undefined,
  };
}

export function parseEvolutionProposalDetail(data: unknown): EvolutionProposalDetail {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    proposal: (d.proposal ?? {}) as EvolutionProposalDetail["proposal"],
    reviews: Array.isArray(d.reviews) ? (d.reviews as EvolutionProposalDetail["reviews"]) : [],
    approvals: Array.isArray(d.approvals) ? (d.approvals as EvolutionProposalDetail["approvals"]) : [],
    history: Array.isArray(d.history) ? (d.history as EvolutionProposalDetail["history"]) : [],
  };
}

export function parseEvolutionActionResult(data: unknown): EvolutionActionResult {
  return (data ?? {}) as EvolutionActionResult;
}
