/**
 * CSP commercial chain — DETERMINISTIC OFFLINE FIXTURE.
 *
 * Simulates the full partner commercial chain in memory by composing the existing pure modules:
 *   registration/admin decision → academy exam (scoreExam + server answer key) → certificate meta →
 *   signature badge → sales-link gates (partner-overview) → paid periods (payment-periods via the
 *   Stripe fixture mapper) → commission (commission-rules) → settlement (settlement-rules).
 *
 * This is NOT a live system and must never be presented as one:
 *  - no network, no database, no Core RPC, no Stripe SDK/keys, no clock, no randomness;
 *  - every result carries `live: false` and `source: "deterministic_offline_fixture"`;
 *  - it proves rule composition only — Core (SQL 20261941100000) remains NOT applied.
 *
 * Server/test use only (imports the Academy answer key).
 */
import { getAnswerKeyForQuestions } from "./academy/server";
import { buildCertificateMeta, type CspCertificateMeta } from "./academy/certificate";
import { selectExamVariant } from "./academy/exam-selection";
import { KOMPIS_WEB_QUESTION_IDS } from "./academy/kompis-web-question-bank";
import { scoreExam, type CspExamAnswer, type CspExamResult } from "./academy-quiz";
import { commissionAmountForSale, snapshotCommissionAtFirstConfirmedSale } from "./commission-rules";
import type { CspPartnerStatus, CspSaleStatus, CspSettlementStatus } from "./constants";
import { evaluateSalesLinkGates, parsePartnerOverview, type CspSalesLinkGateEvaluation } from "./partner-overview";
import { buildCertifiedSellerBadge, type CspSignatureBadge } from "./signature-badge";
import { validateSettlementTransition } from "./settlement-rules";
import {
  CSP_STRIPE_LIVE_WIRING_ENABLED,
  buildPaidPeriodEventFromStripeFixture,
  mapVerifiedStripeEventToPaidPeriod,
  type CspStripeFixtureEvent,
} from "./stripe-adapter";
import type { CommissionRateVersion } from "./types";

export const CSP_INTEGRATION_FIXTURE_SOURCE = "deterministic_offline_fixture" as const;

/** Fixed placeholders — no real customer, partner, or product identity. */
export const CSP_FIXTURE_PRODUCT_ID = "00000000-0000-4000-8000-0000000000a1";
export const CSP_FIXTURE_PRODUCT_KEY = "kompis_web";
export const CSP_FIXTURE_PARTNER_ID = "00000000-0000-4000-8000-0000000000b1";
export const CSP_FIXTURE_FIXED_COMMISSION = 500;
export const CSP_FIXTURE_CURRENCY = "NOK";
export const CSP_FIXTURE_FIRST_PAYMENT_AT = "2026-11-01T09:00:00.000Z";
const CSP_FIXTURE_RATE_EFFECTIVE_FROM = "2026-10-01T00:00:00.000Z";

const LINK_ELIGIBLE: readonly CspPartnerStatus[] = ["approved"];

export type FixtureStep<T = Record<string, never>> = {
  /** Always false — this fixture never claims to be a live system. */
  readonly live: false;
  readonly source: typeof CSP_INTEGRATION_FIXTURE_SOURCE;
  ok: boolean;
  error?: string;
} & T;

function step<T extends object>(ok: boolean, extra: T, error?: string): FixtureStep<T> {
  return { live: false, source: CSP_INTEGRATION_FIXTURE_SOURCE, ok, ...(error ? { error } : {}), ...extra };
}

export type FixtureExamAttempt = {
  attemptNumber: number;
  variantId: string;
  result: CspExamResult;
  certificateMeta: CspCertificateMeta | null;
};

export type FixtureSaleView = {
  paidPeriods: number;
  status: CspSaleStatus | null;
  earnCount: number;
  commissionAmount: number;
  needsReversalReview: boolean;
  snapshotAmount: number | null;
};

export type FixtureSettlement = {
  status: CspSettlementStatus;
  totalAmount: number;
  rejectionReason: string | null;
  paidAt: string | null;
  paymentReference: string | null;
  adminId: string | null;
  history: CspSettlementStatus[];
};

export class CspCommercialChainFixture {
  readonly live = false as const;
  readonly source = CSP_INTEGRATION_FIXTURE_SOURCE;
  readonly stripeLiveWiringEnabled = CSP_STRIPE_LIVE_WIRING_ENABLED;

  partnerStatus: CspPartnerStatus | null = null;
  statusReasons: string[] = [];
  agreementAccepted = false;
  productPublished = false;
  certificationPassed = false;
  certificateMeta: CspCertificateMeta | null = null;
  attempts: FixtureExamAttempt[] = [];
  linkIssued = false;

  private readonly displayName: string;
  private readonly rateVersions: CommissionRateVersion[] = [
    {
      id: "00000000-0000-4000-8000-0000000000c1",
      productId: CSP_FIXTURE_PRODUCT_ID,
      amount: CSP_FIXTURE_FIXED_COMMISSION,
      currency: CSP_FIXTURE_CURRENCY,
      effectiveFrom: CSP_FIXTURE_RATE_EFFECTIVE_FROM,
    },
  ];
  private paidPeriods = 0;
  private earnCount = 0;
  private needsReversalReview = false;
  private snapshotAmount: number | null = null;
  private processedEventIds: string[] = [];
  private settlement: FixtureSettlement | null = null;

  constructor(displayName = "Fixture Partner") {
    this.displayName = displayName;
  }

  // ── Applicant → admin decision ────────────────────────────────────────────
  applyAsPartner(): FixtureStep<{ status: CspPartnerStatus }> {
    this.partnerStatus = "registered";
    return step(true, { status: "registered" as CspPartnerStatus });
  }

  /** Mirrors Core `csp_set_partner_status`: admin only, reason (3–500 chars) always required. */
  adminSetPartnerStatus(status: CspPartnerStatus, reason: string): FixtureStep<{ status: CspPartnerStatus | null }> {
    if (this.partnerStatus === null) return step(false, { status: null }, "partner_not_found");
    const r = (reason ?? "").trim();
    if (r.length < 3 || r.length > 500) return step(false, { status: this.partnerStatus }, "reason_required");
    this.partnerStatus = status;
    this.statusReasons.push(r);
    if (status === "suspended" || status === "rejected") this.linkIssued = false;
    return step(true, { status });
  }

  acceptAgreement(): void {
    this.agreementAccepted = true;
  }

  publishProduct(): void {
    this.productPublished = true;
  }

  // ── Academy exam → certificate ────────────────────────────────────────────
  /** Answers the first `correctCount` of 15 questions correctly. Attempt index = prior attempts. */
  submitExamAttempt(correctCount: number): FixtureStep<{ attempt: FixtureExamAttempt }> {
    const index = this.attempts.length;
    const variant = selectExamVariant(index, KOMPIS_WEB_QUESTION_IDS);
    const key = getAnswerKeyForQuestions(variant.questionIds);
    const answers: CspExamAnswer[] = variant.questionIds.map((questionId, i) => {
      const correct = key[questionId];
      return { questionId, selectedOptionId: i < correctCount ? correct : correct === "a" ? "b" : "a" };
    });
    const result = scoreExam(answers, key);

    let certificateMeta: CspCertificateMeta | null = null;
    if (result.passed) {
      certificateMeta = buildCertificateMeta({
        fullName: this.displayName,
        passedAt: "2026-11-10T10:00:00.000Z",
        locale: "en",
        derivationSeed: `${CSP_FIXTURE_PARTNER_ID}|${CSP_FIXTURE_PRODUCT_KEY}`,
      });
      this.certificationPassed = true;
      this.certificateMeta = certificateMeta;
    }
    const attempt: FixtureExamAttempt = {
      attemptNumber: index + 1,
      variantId: variant.variantId,
      result,
      certificateMeta,
    };
    this.attempts.push(attempt);
    return step(true, { attempt });
  }

  // ── Badge & link gates ────────────────────────────────────────────────────
  badge(): CspSignatureBadge {
    return buildCertifiedSellerBadge({
      certificationActive: this.certificationPassed,
      partnerActive: this.partnerStatus !== null && LINK_ELIGIBLE.includes(this.partnerStatus),
      productLabel: "Buddy Web",
    });
  }

  /** Builds a Core-shaped overview payload and evaluates gates with the real server-side logic. */
  evaluateLinkGates(): CspSalesLinkGateEvaluation {
    const overview = parsePartnerOverview({
      partner: {
        id: CSP_FIXTURE_PARTNER_ID,
        status: this.partnerStatus,
        display_name: this.displayName,
        agreement_accepted: this.agreementAccepted,
      },
      products: this.productPublished
        ? [
            {
              id: CSP_FIXTURE_PRODUCT_ID,
              product_key: CSP_FIXTURE_PRODUCT_KEY,
              fixed_commission_amount: CSP_FIXTURE_FIXED_COMMISSION,
              currency: CSP_FIXTURE_CURRENCY,
              certification_status: this.certificationPassed ? "passed" : "not_started",
            },
          ]
        : [],
      certifications: this.certificationPassed
        ? [{ product_id: CSP_FIXTURE_PRODUCT_ID, product_key: CSP_FIXTURE_PRODUCT_KEY, status: "passed" }]
        : [],
    });
    return evaluateSalesLinkGates(overview, CSP_FIXTURE_PRODUCT_KEY);
  }

  issueSalesLink(): FixtureStep<{ gates: CspSalesLinkGateEvaluation["gates"] }> {
    const evaluation = this.evaluateLinkGates();
    if (!evaluation.allowed) return step(false, { gates: evaluation.gates }, "sales_link_gates_not_met");
    this.linkIssued = true;
    return step(true, { gates: evaluation.gates });
  }

  // ── Paid periods → commission ─────────────────────────────────────────────
  /** Feeds an offline Stripe-shaped fixture event through the mapper → applyVerifiedPaidPeriod. */
  recordPaymentEvent(fixture: CspStripeFixtureEvent): FixtureStep<{ reason: string; newlyEarned: boolean; sale: FixtureSaleView }> {
    if (!this.linkIssued && this.paidPeriods === 0) {
      return step(false, { reason: "no_attribution_link", newlyEarned: false, sale: this.saleView() }, "no_attribution_link");
    }
    const mapped = mapVerifiedStripeEventToPaidPeriod(
      buildPaidPeriodEventFromStripeFixture(fixture, {
        paidPeriods: this.paidPeriods,
        processedEventIds: this.processedEventIds,
        needsReversalReview: this.needsReversalReview,
      }),
    );
    if (!mapped.mapped) {
      return step(false, { reason: mapped.reason, newlyEarned: false, sale: this.saleView() }, mapped.reason);
    }
    const s = mapped.state;
    if (s.changed || s.reason === "duplicate_event_ignored") {
      // Remember every handled event id so replays are detected by the ledger, not the payload.
      if (!this.processedEventIds.includes(fixture.eventId)) this.processedEventIds.push(fixture.eventId);
    }
    if (s.paidPeriods === 1 && this.paidPeriods === 0) {
      this.snapshotAmount =
        snapshotCommissionAtFirstConfirmedSale(this.rateVersions, CSP_FIXTURE_PRODUCT_ID, CSP_FIXTURE_FIRST_PAYMENT_AT)
          ?.amount ?? null;
    }
    this.paidPeriods = s.paidPeriods;
    this.needsReversalReview = s.needsReversalReview;
    if (s.newlyEarned) this.earnCount += 1;
    return step(true, { reason: s.reason, newlyEarned: s.newlyEarned, sale: this.saleView() });
  }

  saleView(): FixtureSaleView {
    const status: CspSaleStatus | null =
      this.paidPeriods >= 2 ? "earned" : this.paidPeriods === 1 ? "registered_awaiting_second_payment" : null;
    return {
      paidPeriods: this.paidPeriods,
      status,
      earnCount: this.earnCount,
      commissionAmount: status
        ? commissionAmountForSale({
            paidPeriodsCount: this.paidPeriods,
            snapshotAmount: this.snapshotAmount,
            status,
          })
        : 0,
      needsReversalReview: this.needsReversalReview,
      snapshotAmount: this.snapshotAmount,
    };
  }

  // ── Settlement ────────────────────────────────────────────────────────────
  /** Opens a settlement from the earned commission. Fails closed when nothing is earned. */
  openSettlement(): FixtureStep<{ settlement: FixtureSettlement | null }> {
    const total = this.saleView().commissionAmount;
    if (total <= 0) return step(false, { settlement: null }, "nothing_earned");
    this.settlement = {
      status: "open",
      totalAmount: total,
      rejectionReason: null,
      paidAt: null,
      paymentReference: null,
      adminId: null,
      history: ["open"],
    };
    return step(true, { settlement: this.settlement });
  }

  transitionSettlement(
    to: CspSettlementStatus,
    extras: { rejectionReason?: string | null; paidAt?: string | null; paymentReference?: string | null; adminId?: string | null } = {},
  ): FixtureStep<{ settlement: FixtureSettlement | null }> {
    if (!this.settlement) return step(false, { settlement: null }, "settlement_not_found");
    const check = validateSettlementTransition(this.settlement.status, to, extras);
    if (!check.ok) return step(false, { settlement: this.settlement }, check.error);
    this.settlement = {
      ...this.settlement,
      status: to,
      rejectionReason: to === "voided" ? (extras.rejectionReason ?? "").trim() : this.settlement.rejectionReason,
      paidAt: to === "paid" ? new Date(extras.paidAt as string).toISOString() : this.settlement.paidAt,
      paymentReference: to === "paid" ? (extras.paymentReference as string).trim() : this.settlement.paymentReference,
      adminId: to === "paid" ? (extras.adminId as string).trim() : this.settlement.adminId,
      history: [...this.settlement.history, to],
    };
    return step(true, { settlement: this.settlement });
  }
}
