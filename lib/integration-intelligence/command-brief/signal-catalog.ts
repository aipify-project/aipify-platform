import type {
  CommandBriefPanel,
  CommandBriefRelatedAction,
  CommandBriefSignalSeverity,
  CommandBriefSignalType,
  CommandBriefSourceTier,
} from "./types";

export type CommandBriefCatalogEntry = {
  signal_key: string;
  signal_type: CommandBriefSignalType;
  category: string;
  title_key: string;
  summary_key: string;
  default_severity: CommandBriefSignalSeverity;
  source_tier: CommandBriefSourceTier;
  related_capability: string | null;
  required_permission: string | null;
  related_action: CommandBriefRelatedAction | null;
  panels: readonly CommandBriefPanel[];
};

const CORE_PREFIX = "customerApp.companionPlatformKnowledge.commandBriefCore";
const VERIFICATION_PREFIX = "customerApp.companionPlatformKnowledge.verification.commandBrief";
const BOOKING_PREFIX = "customerApp.companionPlatformKnowledge.booking.commandBrief";

function signal(
  signalKey: string,
  input: Omit<CommandBriefCatalogEntry, "signal_key">,
): CommandBriefCatalogEntry {
  return { signal_key: signalKey, ...input };
}

function domainSignal(
  signalKey: string,
  category: string,
  signalType: CommandBriefSignalType,
  permission: string,
  capability: string,
  href: string,
): CommandBriefCatalogEntry {
  return signal(signalKey, {
    signal_type: signalType,
    category,
    title_key: `${CORE_PREFIX}.signals.${signalKey}.title`,
    summary_key: `${CORE_PREFIX}.signals.${signalKey}.summary`,
    default_severity: "medium",
    source_tier: "compatible_live",
    related_capability: capability,
    required_permission: permission,
    related_action: {
      kind: "open_page",
      label_key: `${CORE_PREFIX}.actions.openDetails`,
      href,
      capability_key: capability,
      executable: true,
    },
    panels: ["app"],
  });
}

export const COMMAND_BRIEF_SIGNAL_CATALOG: readonly CommandBriefCatalogEntry[] = [
  domainSignal("activity_change", "community", "attention", "customer_community.view", "community.read", "/app/community"),
  domainSignal("new_members", "community", "opportunity", "customer_community.view", "member.read", "/app/community"),
  domainSignal("reward_milestone", "community", "opportunity", "customer_community.view", "community.read", "/app/community"),
  domainSignal("pending_moderation", "moderation", "attention", "moderation.view", "moderation.read", "/app/moderation"),
  domainSignal("reports_requiring_attention", "moderation", "risk", "moderation.view", "moderation.read", "/app/moderation"),
  domainSignal("listing_review", "marketplace", "attention", "marketplace.view", "listing.read", "/app/marketplace"),
  signal("pending_verification", {
    signal_type: "attention",
    category: "verification",
    title_key: `${VERIFICATION_PREFIX}.pendingVerification`,
    summary_key: `${VERIFICATION_PREFIX}.pendingVerification`,
    default_severity: "high",
    source_tier: "exact_live",
    related_capability: "verification.read",
    required_permission: "verification.view",
    related_action: {
      kind: "open_page",
      label_key: `${CORE_PREFIX}.actions.openDetails`,
      href: "/app/verification",
      capability_key: "verification.read",
      executable: true,
    },
    panels: ["app"],
  }),
  signal("verification_needs_information", {
    signal_type: "attention",
    category: "verification",
    title_key: `${VERIFICATION_PREFIX}.needsInformation`,
    summary_key: `${VERIFICATION_PREFIX}.needsInformation`,
    default_severity: "medium",
    source_tier: "exact_live",
    related_capability: "verification.read",
    required_permission: "verification.view",
    related_action: {
      kind: "view_details",
      label_key: `${CORE_PREFIX}.actions.viewDetails`,
      href: "/app/verification",
      capability_key: "verification.read",
      executable: true,
    },
    panels: ["app"],
  }),
  signal("verification_high_priority", {
    signal_type: "risk",
    category: "verification",
    title_key: `${VERIFICATION_PREFIX}.highPriority`,
    summary_key: `${VERIFICATION_PREFIX}.highPriority`,
    default_severity: "high",
    source_tier: "exact_live",
    related_capability: "verification.read",
    required_permission: "verification.view",
    related_action: {
      kind: "open_page",
      label_key: `${CORE_PREFIX}.actions.openDetails`,
      href: "/app/verification",
      capability_key: "verification.read",
      executable: true,
    },
    panels: ["app"],
  }),
  signal("verification_oldest_pending", {
    signal_type: "attention",
    category: "verification",
    title_key: `${VERIFICATION_PREFIX}.oldestPending`,
    summary_key: `${VERIFICATION_PREFIX}.oldestPending`,
    default_severity: "medium",
    source_tier: "exact_live",
    related_capability: "verification.read",
    required_permission: "verification.view",
    related_action: {
      kind: "open_page",
      label_key: `${CORE_PREFIX}.actions.openDetails`,
      href: "/app/verification",
      capability_key: "verification.read",
      executable: true,
    },
    panels: ["app"],
  }),
  ...(
    [
      ["upcoming_bookings", "upcomingBookings"],
      ["unassigned_booking", "unassignedBooking"],
      ["booking_conflict", "bookingConflict"],
      ["availability_gap", "availabilityGap"],
      ["absence_coverage_needed", "absenceCoverageNeeded"],
      ["vacation_return_schedule", "vacationReturnSchedule"],
      ["booking_requiring_attention", "bookingRequiringAttention"],
      ["cancellation_change", "cancellationChange"],
    ] as const
  ).map(([signalKey, i18nKey]) =>
    signal(signalKey, {
      signal_type:
        signalKey.includes("conflict") || signalKey.includes("absence") ? "risk" : "attention",
      category: "booking",
      title_key: `${BOOKING_PREFIX}.${i18nKey}`,
      summary_key: `${BOOKING_PREFIX}.${i18nKey}`,
      default_severity: signalKey.includes("conflict") ? "high" : "medium",
      source_tier: "exact_live",
      related_capability: "booking.read",
      required_permission: "appointments.view",
      related_action: {
        kind: "open_page",
        label_key: `${CORE_PREFIX}.actions.openDetails`,
        href: "/app/appointments",
        capability_key: "booking.read",
        executable: true,
      },
      panels: ["app"],
    }),
  ),
  domainSignal("new_lead", "sales", "opportunity", "sales.view", "lead.read", "/app/sales"),
  domainSignal("lead_without_follow_up", "sales", "follow_up", "sales.view", "lead.read", "/app/sales"),
  domainSignal("recommended_follow_up", "sales", "recommendation", "sales.view", "lead.read", "/app/sales"),
  domainSignal("deal_status_change", "sales", "attention", "sales.view", "deal.read", "/app/sales"),
  domainSignal("sales_target_deviation", "sales", "forecast_warning", "sales.view", "sales.read", "/app/sales"),
  domainSignal("customer_health_warning", "sales", "health_score", "sales.view", "customer.read", "/app/sales"),
  domainSignal("churn_risk", "sales", "risk", "sales.view", "customer.read", "/app/sales"),
  domainSignal("conversion_deviation", "sales", "anomaly", "sales.view", "sales.read", "/app/sales"),
  domainSignal("overdue_invoice", "finance", "attention", "billing.view", "invoice.read", "/app/settings/billing"),
  domainSignal("subscription_change", "finance", "attention", "billing.view", "subscription.read", "/app/settings/billing"),
  domainSignal("forecast_warning", "finance", "forecast_warning", "billing.view", "finance.read", "/app/finance"),
  domainSignal("revenue_deviation", "finance", "anomaly", "billing.view", "finance.read", "/app/finance"),
  domainSignal("payment_failure", "finance", "alert", "billing.view", "payment.read", "/app/settings/billing"),
  domainSignal("payout_attention", "finance", "attention", "billing.view", "payout.read", "/app/finance"),
  domainSignal("reconciliation_issue", "finance", "risk", "billing.view", "finance.read", "/app/finance"),
  domainSignal("verification_pending", "security", "attention", "security.view", "verification.read", "/app/settings/security"),
  domainSignal("access_review_required", "security", "attention", "security.view", "access.read", "/app/settings/security"),
  domainSignal("security_incident", "security", "alert", "security.view", "incident.read", "/app/settings/security"),
  domainSignal("failed_login_2fa_issue", "security", "risk", "security.view", "auth.read", "/app/settings/security"),
  domainSignal("expiring_certificate", "security", "attention", "security.view", "certificate.read", "/app/settings/security"),
  domainSignal("compliance_attention", "security", "attention", "security.view", "compliance.read", "/app/settings/security"),
  domainSignal("unresolved_risk_signal", "security", "risk", "security.view", "risk.read", "/app/settings/security"),
  domainSignal("permission_anomaly", "security", "anomaly", "security.view", "permission.read", "/app/settings/security"),
  domainSignal("onboarding_in_progress", "hr", "attention", "hr.view", "onboarding.read", "/app/hr"),
  domainSignal("absence_upcoming", "hr", "attention", "hr.view", "absence.read", "/app/absence"),
  domainSignal("expiring_certifications", "hr", "attention", "hr.view", "certification.read", "/app/hr"),
  domainSignal("training_pending", "hr", "attention", "hr.view", "training.read", "/app/hr"),
  domainSignal("pending_invitations", "hr", "attention", "hr.view", "team.read", "/app/team"),
  domainSignal("performance_reviews", "hr", "attention", "hr.view", "performance.read", "/app/hr"),
  domainSignal("low_stock", "warehouse", "attention", "warehouse.view", "inventory.read", "/app/warehouse"),
  domainSignal("delayed_receipt", "warehouse", "attention", "warehouse.view", "receipt.read", "/app/warehouse"),
  domainSignal("transfer_in_progress", "warehouse", "attention", "warehouse.view", "transfer.read", "/app/warehouse"),
  domainSignal("inventory_discrepancy", "warehouse", "anomaly", "warehouse.view", "inventory.read", "/app/warehouse"),
  domainSignal("replenishment_required", "warehouse", "attention", "warehouse.view", "inventory.read", "/app/warehouse"),
  domainSignal("unresolved_support_case", "support", "attention", "support.view", "case.read", "/app/support"),
  domainSignal("sla_risk", "support", "risk", "support.view", "case.read", "/app/support"),
  domainSignal("escalation_required", "support", "alert", "support.view", "case.read", "/app/support"),
];

const catalogByKey = new Map(
  COMMAND_BRIEF_SIGNAL_CATALOG.map((entry) => [entry.signal_key, entry]),
);

export function getCommandBriefCatalogEntry(signalKey: string): CommandBriefCatalogEntry | null {
  return catalogByKey.get(signalKey) ?? null;
}

export function listCommandBriefCatalogKeys(): readonly string[] {
  return COMMAND_BRIEF_SIGNAL_CATALOG.map((entry) => entry.signal_key);
}
