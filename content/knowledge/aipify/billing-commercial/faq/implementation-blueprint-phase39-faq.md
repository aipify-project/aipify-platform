# Revenue Intelligence Engine (ABOS Phase 39) — FAQ

## What is Blueprint Phase 39?

Blueprint Phase 39 is the **Revenue Intelligence Engine** — ABOS alignment metadata extending the Billing, Packaging & Commercial Model (Phase 93) at `/app/commercial`.

## Is Blueprint Phase 39 the same as Commerce Performance Phase 104?

No. **Blueprint Phase 39** covers operational subscription revenue intelligence — MRR/ARR, renewals, expansion opportunities. **Commerce Performance Phase 104** covers product profit, loss prevention, and commerce operations at `/app/commerce-performance`. Cross-link — do not duplicate.

## Where does revenue data come from?

From tenant-scoped `commercial_*` tables — health scores, renewal events, partner commissions, and commercial analytics. Metadata only — no raw payment records or customer financial PII.

## What is Fiken's role?

**Fiken is the accounting source of truth** for bookkeeping. Aipify coordinates operational awareness and preparation — it never overrides ledger data. Configure Fiken via Integration Engine A.8 and Blueprint Phase 27.

## What is Stripe's role?

**Stripe handles primary payments** — subscription and payment event signals. Connection status is honest scaffold metadata until connectors complete.

## How does renewal intelligence work?

Scheduled renewal events from `commercial_renewal_events` drive upcoming renewal visibility. Renewal likelihood and engagement scores inform calm preparation cues — intentional follow-up, not accidental surprises.

## How does Sales Expert connect?

Sales Expert OS (A.95) cross-links renewal visibility, expansion opportunities, commission forecasting, and customer lifecycle awareness. Blueprint Phase 39 documents the alignment — it does not duplicate the Sales Expert engine.

## What is the Self Love connection?

Self Love (A.76) supports clarity not anxiety — preparation, long-term thinking, and progress recognition. Revenue visibility supports confidence, not constant financial pressure.

## What is dogfooding for revenue intelligence?

Aipify Group validates MRR/ARR visibility and renewal forecasting internally. Unonight is the first external pilot for subscription revenue intelligence.

## Where can I read the full specification?

See [IMPLEMENTATION_BLUEPRINT_PHASE39_REVENUE_INTELLIGENCE.md](../../../../IMPLEMENTATION_BLUEPRINT_PHASE39_REVENUE_INTELLIGENCE.md).
