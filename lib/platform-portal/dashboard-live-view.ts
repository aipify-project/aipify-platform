/**
 * Daily Platform dashboard counts.
 * A zero is shown only when the payload contains a real non-negative number.
 * Missing, null, and non-numeric values stay unavailable — never a fallback zero.
 */

export type LiveCount =
  | { state: "value"; value: number }
  | { state: "unavailable" };

export type PlatformDashboardLiveView = {
  checkedAt: string | null;
  organizationsTotal: LiveCount;
  organizationsAttention: LiveCount;
  activeAgreements: LiveCount;
  pastDue: LiveCount;
  trialing: LiveCount;
  healthyRatioPct: LiveCount;
  skillsPending: LiveCount;
  skillsPublished: LiveCount;
  supportOpen: LiveCount;
  supportWaiting: LiveCount;
  supportResolved: LiveCount;
  /** Inbox counts RPC has no critical total. */
  supportCritical: LiveCount;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function readNonNegativeCount(value: unknown): LiveCount {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return { state: "unavailable" };
  }
  return { state: "value", value: Math.trunc(value) };
}

function readCheckedAt(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || Number.isNaN(Date.parse(trimmed))) return null;
  return trimmed;
}

/** Healthy share of customer organizations. Unavailable when the denominator is 0 or missing. */
export function healthyOrganizationRatio(
  total: LiveCount,
  attention: LiveCount,
): LiveCount {
  if (total.state !== "value" || attention.state !== "value") {
    return { state: "unavailable" };
  }
  if (total.value === 0 || attention.value > total.value) {
    return { state: "unavailable" };
  }
  const pct = Math.round((1000 * (total.value - attention.value)) / total.value) / 10;
  return { state: "value", value: pct };
}

function readSupportInbox(raw: Record<string, unknown>): {
  open: LiveCount;
  waiting: LiveCount;
  resolved: LiveCount;
} {
  const inbox = asRecord(raw.support_inbox);
  if (!inbox || inbox.state !== "value") {
    return {
      open: { state: "unavailable" },
      waiting: { state: "unavailable" },
      resolved: { state: "unavailable" },
    };
  }
  return {
    open: readNonNegativeCount(inbox.open),
    waiting: readNonNegativeCount(inbox.waiting),
    resolved: readNonNegativeCount(inbox.resolved_or_closed),
  };
}

export function toPlatformDashboardLiveView(raw: unknown): PlatformDashboardLiveView {
  const row = asRecord(raw) ?? {};
  const payment = asRecord(row.payment_status_summary) ?? {};
  const success = asRecord(row.customer_success_indicators) ?? {};
  const skills = asRecord(row.marketplace_moderation) ?? {};
  const organizationsTotal = readNonNegativeCount(success.organizations_total);
  const organizationsAttention = readNonNegativeCount(row.organizations_requiring_attention);
  const support = readSupportInbox(row);

  return {
    checkedAt: readCheckedAt(row.checked_at),
    organizationsTotal,
    organizationsAttention,
    activeAgreements: readNonNegativeCount(row.active_subscriptions),
    pastDue: readNonNegativeCount(payment.past_due),
    trialing: readNonNegativeCount(payment.trialing),
    healthyRatioPct: healthyOrganizationRatio(organizationsTotal, organizationsAttention),
    skillsPending: readNonNegativeCount(skills.pending_review),
    skillsPublished: readNonNegativeCount(skills.published),
    supportOpen: support.open,
    supportWaiting: support.waiting,
    supportResolved: support.resolved,
    supportCritical: { state: "unavailable" },
  };
}
