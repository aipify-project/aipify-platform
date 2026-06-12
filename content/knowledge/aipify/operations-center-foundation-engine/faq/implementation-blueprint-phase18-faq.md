# Implementation Blueprint Phase 18 — Operations Center Engine Foundation FAQ

## What is Phase 18 of the Implementation Blueprint?

Phase 18 aligns the Operations Center Foundation Engine (Phase A.32) with ABOS Operations Center Engine Foundation requirements — module overviews, Since Last Time summaries, trust transparency, Self Love cross-links, and live success criteria.

## How is this different from other operations surfaces?

| Surface | Route | Purpose |
|---------|-------|---------|
| **Operations Center Foundation A.32** | `/app/operations-center-foundation-engine` | Cross-module event coordination and module overviews |
| **Operations Dashboard A.9** | `/app/operations-dashboard-engine` | Role-aware widget dashboard |
| **Command Center Phase 26** | `/app/command-center` | Presence and notifications |
| **AOC Phase 79** | `/app/operations` | Autonomous operations watchers |

## What are the five module overview blocks?

- **Support Overview** — open cases, escalations, resolution trends
- **Task Overview** — high-priority open, overdue, due within 7 days
- **Knowledge Overview** — published articles, drafts, open gaps, recent updates
- **Executive Overview** — executive reports, operational risks, operations concerns
- **Recognition Overview** — gratitude moments, recognition opportunities, celebrations, bell moments

## What is the Since Last Time block?

A live metadata aggregate since the user's previous login (or 7-day fallback): support cases resolved, KC articles updated, high-priority tasks completed, open bottlenecks, bell moments, and recognition moments. No PII — counts only.

## How is the Since Last Time window determined?

`_ocf_since_last_time_summary()` uses, in order: `admin_assistant_sessions.previous_login_at`, `auth.users.last_sign_in_at`, last `presence_engagement_events` activity, then a 7-day fallback. The source is documented on the dashboard.

## What are the companion communication examples?

- 🔔 Positive operational progress since last visit
- 🌹 High-priority completions deserve team recognition
- 🦉 Operations review or planning reflection moment

## What is the Self Love connection?

Self Love supports operational pacing — reduce stress, clarify priorities, highlight accomplishments, calm not overwhelm. Cross-linked to `/app/self-love-engine` as a principle, not a feature toggle. No ™ in product copy.

## How is trust maintained?

Operators see contributing modules, Since Last Time assumptions, and audit events via `_ocf_log()` — metadata only, no email, chat, orders, or PII.

## What are the Phase 18 success criteria?

Module overviews populated, Since Last Time populated, events aggregated, urgent actions visible, acknowledge/resolve workflows available, cross-module links present, companion examples documented, and metadata-only privacy enforced — computed live on the dashboard.

## Where does Unonight fit?

Unonight is the first external pilot for commerce operational coordination — support trends, launch priorities, knowledge gaps, and recognition moments. Aipify Group validates internally first.

## Does Phase 18 add new database tables?

No. Phase 18 extends `get_operations_center_foundation_engine_dashboard()` and `get_operations_center_foundation_engine_card()` with blueprint metadata, `_ocf_module_overviews()`, `_ocf_since_last_time_summary()`, and `_ocf_blueprint_success_criteria()` only.
