/**
 * Percent commission is CORE_BLOCKED until owner-approved settlement contract lands.
 * Fixed one-time commission from csp_sales_products remains Production truth.
 */

export const PERCENT_COMMISSION_STATUS = "core_blocked" as const;

export const PERCENT_COMMISSION_BLOCKED_REASON = "needs_core_contract" as const;

/** Proposed money basis options — not active in settlement. */
export const PERCENT_COMMISSION_BASIS_OPTIONS = [
  "net_ex_vat_after_discount",
  "gross_incl_vat_after_discount",
  "paid_amount_captured",
] as const;

export type PercentCommissionBasisOption = (typeof PERCENT_COMMISSION_BASIS_OPTIONS)[number];

export type PercentCommissionContractProposal = {
  status: typeof PERCENT_COMMISSION_STATUS;
  blockedReason: typeof PERCENT_COMMISSION_BLOCKED_REASON;
  /** Must be chosen and tested before activation. */
  requiredBasisDecision: readonly PercentCommissionBasisOption[];
  currency: "must_match_paid_invoice_currency";
  minorUnits: "integer_minor_units_then_round_half_up_to_currency";
  discounts: "apply_before_percent_basis";
  vat: "depends_on_selected_basis";
  refundsAndChargebacks: "update_status_without_deleting_history";
  partialPayments: "accrue_only_on_captured_portion_of_selected_basis";
  priceVersion: "bind_to_invoice_line_product_and_rate_version_at_capture";
  trial: "no_commission";
  monthlyQualification: "after_second_real_paid_period";
  annualQualification: "after_first_confirmed_annual_payment";
  renewals: "no_recurring_renewal_commission";
  frontendRule: "never_store_or_compute_percent_in_ui";
};

export const PERCENT_COMMISSION_CONTRACT_PROPOSAL: PercentCommissionContractProposal = {
  status: PERCENT_COMMISSION_STATUS,
  blockedReason: PERCENT_COMMISSION_BLOCKED_REASON,
  requiredBasisDecision: PERCENT_COMMISSION_BASIS_OPTIONS,
  currency: "must_match_paid_invoice_currency",
  minorUnits: "integer_minor_units_then_round_half_up_to_currency",
  discounts: "apply_before_percent_basis",
  vat: "depends_on_selected_basis",
  refundsAndChargebacks: "update_status_without_deleting_history",
  partialPayments: "accrue_only_on_captured_portion_of_selected_basis",
  priceVersion: "bind_to_invoice_line_product_and_rate_version_at_capture",
  trial: "no_commission",
  monthlyQualification: "after_second_real_paid_period",
  annualQualification: "after_first_confirmed_annual_payment",
  renewals: "no_recurring_renewal_commission",
  frontendRule: "never_store_or_compute_percent_in_ui",
};

export function isPercentCommissionActivatable(): false {
  return false;
}
