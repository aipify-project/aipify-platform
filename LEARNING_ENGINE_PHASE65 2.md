# Learning Engine — Feedback Loop (Phase 65)

Phase 65 extends the Phase 29 Learning Engine with a governed feedback loop: Aipify suggests, users decide, outcomes happen, and future recommendations improve — safely and reversibly.

## Philosophy

Observe → Suggest → User decides → Outcome → Feedback → Learning updated

## Prerequisites

Phase 29 foundation: [LEARNING_ENGINE.md](./LEARNING_ENGINE.md) — learning modes, review center, `customer_learning_memory`.

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/learning` | Learning dashboard — metrics, patterns, events |
| `/app/learning/review` | Phase 29 review center (modes, remove learnings) |
| `/app/learning/feedback` | Learning events & feedback trail |
| `/app/learning/rules` | Learned prioritization rules |
| `/app/learning/settings` | Module learning toggles, reset |
| `/app/learning/audit` | Learning audit log |

## Database tables (Phase 65)

- `learning_settings` — tenant module toggles, retention, review requirements
- `learning_events` — decisions and outcomes with confidence tracking
- `learning_feedback` — explicit user feedback
- `learning_outcomes` — completed, dismissed, delegated outcomes
- `learning_rules` — learned prioritization/filter rules
- `learning_scores` — pattern confidence adjustments
- `learning_audit_log` — governed audit trail

Phase 29 tables remain: `customer_learning_settings`, `customer_learning_memory`, `customer_learning_reviews`.

## API (`/api/aipify/learning-engine/*`)

- `GET card` — home summary
- `GET dashboard` — metrics, top patterns, recent events
- `GET/POST events` — list / record learning events
- `POST feedback` — record feedback
- `GET rules` — learned rules
- `GET audit` — audit log
- `GET/PATCH settings` — tenant settings
- `POST collect` — collect signals from Action Center, Quality, Memory
- `POST reset` — reset scores and rules
- `POST unonight/seed` — Unonight pilot learning data

## What Aipify learns from

Approvals, Action Center outcomes, Support AI feedback, Quality false positives, automations, briefing engagement, desktop notifications, Knowledge Center gaps — per module settings.

## What Aipify never does (Phase 65 scope)

- Uncontrolled global model training
- Cross-tenant learning without consent
- Hidden behavioural profiling or employee scoring
- Automatic removal of approvals
- Irreversible learning changes

## Integrations

- **Memory Engine (62)** — context vs outcome evaluation
- **Action Center (64)** — completed/dismissed actions → learning events
- **Quality Guardian** — false positive tracking reduces noise
- **Governance (54)** — `_tacc_log_audit` on learning audit actions
- **Desktop Companion, Briefing, Knowledge Center** — configurable collectors

## Library

- Phase 65: `lib/aipify/learning-engine/` — types, parse, jobs (server-only)
- Phase 29: `lib/learning/` — modes, explanation, review center

## Migration

`supabase/migrations/20260615400000_learning_engine_phase65.sql`

## Knowledge Center

FAQ at `content/knowledge/aipify/learning/faq/learning-engine-faq.md`, category `learning-engine`.
