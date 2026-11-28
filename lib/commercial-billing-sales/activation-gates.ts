/**
 * AIPIFY_COMMERCIAL_PAYMENT_REVENUE_ACTIVATION_MASTER_V2 — single activation readiness matrix.
 *
 * Pure, fail-closed, no I/O, no env reads. This module can only ANSWER "is this activation allowed";
 * it never performs one. Every writer (Stripe live, live checkout, payout, percent commission,
 * invoice send, SQL apply, EXECUTE grants, purchase CTA) is locked in code and also needs an
 * explicit owner YES that lives outside this repository's code paths.
 *
 * Facts (staging / production foundation, snapshot RPC) are observations supplied by the parent
 * agent after read-only verification — they are never inferred from environment.
 */

import {
  COMMERCIAL_BILLING_SALES_MASTER,
  COMMERCIAL_BILLING_SQL_CANDIDATES,
  COMMERCIAL_OPEN_OWNER_APPROVALS,
} from "./contract";

// ------------------------------------------------------------------ readiness matrix

export type ActivationReadiness = {
  /** Fact: foundation SQL applied on Staging (version 20261128201827). */
  stagingFoundationApplied: boolean;
  /** Fact: foundation SQL applied on Production. */
  productionFoundationApplied: boolean;
  /** Fact: get_sales_partner_program_license_snapshot callable (any environment under evaluation). */
  snapshotRpcAvailable: boolean;
  /** Writer: Stripe live objects / secrets. */
  stripeLive: boolean;
  /** Writer: live Checkout Session creation. */
  checkoutLive: boolean;
  /** Writer: payout / settlement automation. */
  payoutLive: boolean;
  /** Writer: percent-based commission. */
  percentCommission: boolean;
  /** Writer: invoice / receipt sending. */
  invoiceSend: boolean;
};

export type ActivationReadinessKey = keyof ActivationReadiness;

export const ACTIVATION_FACT_KEYS = [
  "stagingFoundationApplied",
  "productionFoundationApplied",
  "snapshotRpcAvailable",
] as const satisfies readonly ActivationReadinessKey[];

export const ACTIVATION_WRITER_KEYS = [
  "stripeLive",
  "checkoutLive",
  "payoutLive",
  "percentCommission",
  "invoiceSend",
] as const satisfies readonly ActivationReadinessKey[];

/**
 * Parent-verified baseline (2026-11-28):
 *  - Staging auedugihkduoaikfusqe: foundation migration 20261128201827 present, snapshot RPC absent.
 *  - Production qbcqoixhrvhnuwphefvw: commercial license tables/RPCs absent.
 * Every writer is closed.
 */
export const ACTIVATION_READINESS: Readonly<ActivationReadiness> = Object.freeze({
  stagingFoundationApplied: true,
  productionFoundationApplied: false,
  snapshotRpcAvailable: false,
  stripeLive: false,
  checkoutLive: false,
  payoutLive: false,
  percentCommission: false,
  invoiceSend: false,
});

/** Hard code lock. Flipping this is a separate owner task AND a code change reviewed on its own. */
export const ACTIVATION_CODE_LOCKS = {
  writersEnabledInCode: false as const,
} as const;

export const ACTIVATION_ENVIRONMENTS = {
  staging: { projectRef: "auedugihkduoaikfusqe", foundationMigrationVersion: "20261128201827" },
  production: { projectRef: "qbcqoixhrvhnuwphefvw", foundationMigrationVersion: null },
} as const;

/**
 * Merge observed FACTS onto the closed baseline. Writer keys are ignored on purpose: callers cannot
 * open a writer through this function. Non-boolean / missing facts keep the baseline value
 * (and a fact can only be set to a strict `true` by a strict `true`).
 */
export function resolveActivationReadiness(observed?: Partial<ActivationReadiness> | null): ActivationReadiness {
  const base = { ...ACTIVATION_READINESS };
  if (!observed || typeof observed !== "object") return base;
  for (const key of ACTIVATION_FACT_KEYS) {
    const v = observed[key];
    if (typeof v === "boolean") base[key] = v;
  }
  return base;
}

// ------------------------------------------------------------------ actions

export type ActivationAction =
  | "apply_production_foundation_sql"
  | "apply_staging_snapshot_read_sql"
  | "grant_snapshot_rpc_execute"
  | "read_license_snapshot_rpc"
  | "create_stripe_live_objects"
  | "create_live_checkout_session"
  | "enable_purchase_cta"
  | "activate_payout"
  | "activate_percent_commission"
  | "send_invoice";

type ActionSpec = {
  /** True when performing the action changes state somewhere (DB, Stripe, money, mail, UI exposure). */
  writer: boolean;
  /** Gates that must ALL be true in the effective readiness. */
  requires: readonly ActivationReadinessKey[];
  /** Owner decision key (see listOpenOwnerApprovals); null for pure reads. */
  ownerApproval: string | null;
};

const ACTION_SPECS: Readonly<Record<ActivationAction, ActionSpec>> = {
  apply_production_foundation_sql: {
    writer: true,
    requires: ["stagingFoundationApplied"],
    ownerApproval: "production_sql_apply_license_foundation",
  },
  apply_staging_snapshot_read_sql: {
    writer: true,
    requires: ["stagingFoundationApplied"],
    ownerApproval: "staging_apply_snapshot_read_rpc_only",
  },
  grant_snapshot_rpc_execute: {
    writer: true,
    requires: ["snapshotRpcAvailable"],
    ownerApproval: "execute_grant_role_matrix",
  },
  read_license_snapshot_rpc: {
    writer: false,
    requires: ["snapshotRpcAvailable"],
    ownerApproval: null,
  },
  create_stripe_live_objects: {
    writer: true,
    requires: ["stripeLive"],
    ownerApproval: "stripe_live_activation_and_secrets",
  },
  create_live_checkout_session: {
    writer: true,
    requires: ["stripeLive", "checkoutLive", "productionFoundationApplied"],
    ownerApproval: "live_checkout_session_creation",
  },
  enable_purchase_cta: {
    writer: true,
    requires: ["checkoutLive", "productionFoundationApplied", "snapshotRpcAvailable"],
    ownerApproval: "live_checkout_session_creation",
  },
  activate_payout: {
    writer: true,
    requires: ["payoutLive"],
    ownerApproval: "payout_activation_and_settlement_automation",
  },
  activate_percent_commission: {
    writer: true,
    requires: ["percentCommission"],
    ownerApproval: "percent_commission_basis_and_core_contract",
  },
  send_invoice: {
    writer: true,
    requires: ["invoiceSend"],
    ownerApproval: "stripe_invoice_vs_accounting_system_of_record",
  },
};

export const ACTIVATION_ACTIONS = Object.keys(ACTION_SPECS) as ActivationAction[];

export type ActivationDenyReason =
  | "unknown_action"
  | "gate_closed"
  | "writer_locked_in_code"
  | "owner_approval_required";

export type ActivationDecision =
  | { allowed: true; action: ActivationAction; writer: false; ownerApproval: null }
  | {
      allowed: false;
      action: string;
      writer: boolean;
      ownerApproval: string | null;
      missingGates: ActivationReadinessKey[];
      reasons: ActivationDenyReason[];
    };

export class ActivationBlockedError extends Error {
  readonly decision: Extract<ActivationDecision, { allowed: false }>;
  constructor(decision: Extract<ActivationDecision, { allowed: false }>) {
    super(`activation_blocked:${decision.action}:${decision.reasons.join(",")}`);
    this.name = "ActivationBlockedError";
    this.decision = decision;
  }
}

/** Non-throwing evaluation. Fail-closed on unknown action, missing gate, or any writer. */
export function evaluateActivation(
  action: unknown,
  observed?: Partial<ActivationReadiness> | null,
): ActivationDecision {
  if (typeof action !== "string" || !Object.prototype.hasOwnProperty.call(ACTION_SPECS, action)) {
    return {
      allowed: false,
      action: typeof action === "string" ? action : String(action),
      writer: true,
      ownerApproval: null,
      missingGates: [],
      reasons: ["unknown_action"],
    };
  }
  const known = action as ActivationAction;
  const spec = ACTION_SPECS[known];
  const readiness = resolveActivationReadiness(observed);
  const missingGates = spec.requires.filter((k) => readiness[k] !== true);
  const reasons: ActivationDenyReason[] = [];
  if (missingGates.length > 0) reasons.push("gate_closed");
  if (spec.writer) {
    if (!ACTIVATION_CODE_LOCKS.writersEnabledInCode) reasons.push("writer_locked_in_code");
    reasons.push("owner_approval_required");
  }
  if (reasons.length === 0) {
    return { allowed: true, action: known, writer: false, ownerApproval: null };
  }
  return {
    allowed: false,
    action: known,
    writer: spec.writer,
    ownerApproval: spec.ownerApproval,
    missingGates,
    reasons,
  };
}

/** Throws ActivationBlockedError unless the action is allowed. Today only reads can ever pass. */
export function assertActivationAllowed(
  action: unknown,
  observed?: Partial<ActivationReadiness> | null,
): Extract<ActivationDecision, { allowed: true }> {
  const decision = evaluateActivation(action, observed);
  if (!decision.allowed) throw new ActivationBlockedError(decision);
  return decision;
}

/** Spec accessor for docs/tests (frozen copy). */
export function describeActivationAction(action: ActivationAction): Readonly<ActionSpec> {
  const s = ACTION_SPECS[action];
  return Object.freeze({ writer: s.writer, requires: [...s.requires], ownerApproval: s.ownerApproval });
}

// ------------------------------------------------------------------ owner approvals

export type OpenOwnerApproval = {
  key: string;
  status: "open";
  /** Blocks the first paying Kompis customer path. */
  blocksFirstKompisPayment: boolean;
  /** Exact YES package document, when one exists. */
  yesPackage: string | null;
  /** V2 split of a combined V1 approval. */
  v2Addition: boolean;
};

const KOMPIS_BLOCKING = new Set<string>([
  "stripe_live_activation_and_secrets",
  "live_checkout_session_creation",
  "production_sql_apply_license_foundation",
  "staging_apply_snapshot_read_rpc_only",
  "execute_grant_role_matrix",
  "vat_rate_source_and_stripe_tax_vs_manual",
  "stripe_invoice_vs_accounting_system_of_record",
  "commission_rate_values_per_variant_interval",
  "license_levels_and_seat_caps_catalog",
]);

export const COMMERCIAL_ACTIVATION_YES_PACKAGES = {
  foundationProduction: {
    doc: "docs/platform/AIPIFY_COMMERCIAL_LICENSE_FOUNDATION_PRODUCTION_YES_PACKAGE_V2.md",
    sqlPath: COMMERCIAL_BILLING_SQL_CANDIDATES.foundation.path,
    sqlSha256: COMMERCIAL_BILLING_SQL_CANDIDATES.foundation.sha256,
    projectRef: ACTIVATION_ENVIRONMENTS.production.projectRef,
    stagingLedgerVersion: ACTIVATION_ENVIRONMENTS.staging.foundationMigrationVersion,
    status: "APPLY_BLOCKED_UNTIL_OWNER_YES",
  },
  snapshotReadStaging: {
    doc: "docs/platform/AIPIFY_COMMERCIAL_SNAPSHOT_READ_STAGING_YES_PACKAGE_V2.md",
    sqlPath: COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.path,
    sqlSha256: COMMERCIAL_BILLING_SQL_CANDIDATES.snapshotRead.sha256,
    projectRef: ACTIVATION_ENVIRONMENTS.staging.projectRef,
    status: "APPLY_BLOCKED_UNTIL_OWNER_YES",
    executeGrants: "deferred_separate_yes",
  },
} as const;

const YES_PACKAGE_BY_APPROVAL: Readonly<Record<string, string>> = {
  production_sql_apply_license_foundation: COMMERCIAL_ACTIVATION_YES_PACKAGES.foundationProduction.doc,
  staging_apply_snapshot_read_rpc_only: COMMERCIAL_ACTIVATION_YES_PACKAGES.snapshotReadStaging.doc,
  execute_grant_role_matrix: COMMERCIAL_ACTIVATION_YES_PACKAGES.snapshotReadStaging.doc,
  staging_apply_snapshot_read_rpc_and_execute_grants: COMMERCIAL_ACTIVATION_YES_PACKAGES.snapshotReadStaging.doc,
};

/** V2 additions: V1's combined snapshot+grants approval is split into two separate YES decisions. */
const V2_ADDITIONS = ["staging_apply_snapshot_read_rpc_only", "execute_grant_role_matrix"] as const;

/** Every open owner decision (V1 list unchanged, plus V2 splits). Always status "open" in code. */
export function listOpenOwnerApprovals(): readonly OpenOwnerApproval[] {
  const v1: OpenOwnerApproval[] = COMMERCIAL_OPEN_OWNER_APPROVALS.map((key) => ({
    key,
    status: "open",
    blocksFirstKompisPayment: KOMPIS_BLOCKING.has(key),
    yesPackage: YES_PACKAGE_BY_APPROVAL[key] ?? null,
    v2Addition: false,
  }));
  const v2: OpenOwnerApproval[] = V2_ADDITIONS.map((key) => ({
    key,
    status: "open",
    blocksFirstKompisPayment: true,
    yesPackage: YES_PACKAGE_BY_APPROVAL[key] ?? null,
    v2Addition: true,
  }));
  return Object.freeze([...v1, ...v2]);
}

/** Cross-check helper: the matrix writers must agree with the V1 compile-time master switches. */
export function activationMatrixAgreesWithMasterSwitches(): boolean {
  const s = COMMERCIAL_BILLING_SALES_MASTER.switches;
  const r = ACTIVATION_READINESS;
  return (
    r.stripeLive === s.stripeLiveEnabled &&
    r.checkoutLive === s.liveCheckoutSessionCreationEnabled &&
    r.payoutLive === s.payoutActivationEnabled &&
    r.percentCommission === s.percentCommissionActivatable &&
    r.invoiceSend === s.invoiceSendingEnabled &&
    r.productionFoundationApplied === s.productionSqlApplied
  );
}
