# Implementation Blueprint Phase 13 — Executive Insights Engine Foundation FAQ

## What is Phase 13 of the Implementation Blueprint?

Phase 13 aligns the Executive Insights Engine (Phase A.35) with ABOS Executive Insights Foundation requirements — clarity over noise, Since Last Time summaries, insight categories, trust transparency, and live success criteria.

## How is this different from `/app/executive` and `/platform/executive`?

**Executive Insights Engine A.35** at `/app/executive-insights-engine` provides tenant-scoped reporting, risks, opportunities, and schedules. **Customer `/app/executive`** delivers daily briefings. **Platform `/platform/executive`** is Aipify Group global governance — never mix layers.

## What are the five insight categories?

- **Operational** — health scores, quality findings, operations alerts
- **Support** — case resolution, escalation patterns, support AI metrics
- **Knowledge** — KC updates, knowledge gaps, procedure coverage
- **Companion** — proactive guidance, bell moments (🔔), gratitude (🌹), reflection (🦉)
- **Strategic** — opportunities, alignment, predictive insights

## What is the Since Last Time block?

A live metadata aggregate since the user's previous login (or 7-day fallback): support cases resolved, KC articles updated, high-priority tasks completed, open bottlenecks, and bell moment counts. No PII — counts and trends only.

## How is the Since Last Time window determined?

`_eie_since_last_time_summary()` uses, in order: `admin_assistant_sessions.previous_login_at`, `auth.users.last_sign_in_at`, last `presence_engagement_events` activity, then a 7-day fallback. The source is documented on the dashboard.

## What is the Self Love connection?

Self Love supports executive perspective, sustainable pacing, team recognition, and healthy prioritization — a principle cross-linked to `/app/self-love-engine`, not a feature toggle. No ™ in product copy.

## How is trust maintained?

Executives see contributing modules, health score factors, Since Last Time assumptions, and audit events via `_eie_log()` — metadata only, no email, chat, orders, or PII.

## What are the Phase 13 success criteria?

Reports generated, health score computed, risks and opportunities surfaced, Since Last Time populated, schedules available, action recommendations present, and metadata-only privacy enforced — computed live on the dashboard.

## Where does Unonight fit?

Unonight is the first external pilot for commerce executive visibility — support trends, customer success trajectory, bottlenecks, and action recommendations with human approval. Aipify Group validates internally first.

## Does Phase 13 add new database tables?

No. Phase 13 extends `get_executive_insights_engine_dashboard()` and `get_executive_insights_engine_card()` with blueprint metadata, `_eie_since_last_time_summary()`, and `_eie_blueprint_success_criteria()` only.
