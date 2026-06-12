# Trust, Transparency & Explainability Engine — Phase 76

> **ABOS Trust Engine:** See [TRUST_ENGINE.md](./TRUST_ENGINE.md) — canonical ABOS trust foundation spec that extends this phase (philosophy, confidence communication, accountability, Self Love, Relationship Intelligence integration). Migration `20260926000000_trust_engine_abos_spec_alignment.sql`.

Build a comprehensive Trust, Transparency and Explainability framework so every important Aipify decision can be understood, reviewed, audited, and trusted.

## Philosophy

No important decision without explanation. Aipify earns trust through transparency, explainability, auditability, predictability, governance, and human oversight — never by asking users to trust AI blindly.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/trust` | Trust Score, coverage, recent explanations, feedback |
| `/app/trust/explanations/[id]` | Full explanation detail with override and feedback |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/trust/card` | `get_trust_card` |
| `GET /api/aipify/trust/dashboard` | `get_trust_dashboard` |
| `GET /api/aipify/trust/metrics` | `calculate_explainability_trust_score` |
| `GET /api/aipify/explanations` | `list_decision_explanations` |
| `GET /api/aipify/explanations/[id]` | `get_decision_explanation` |
| `GET /api/aipify/explanations/decision/[decisionId]` | `get_decision_explanation_by_decision` |
| `POST /api/aipify/explanations/[id]` | `submit_explanation_feedback` / `override_decision_explanation` |
| `POST /api/aipify/trust/jobs/run` | `calculate_explainability_trust_score` |

## Explanation template

Decision Summary → Reasoning → Information Used → Rules Applied → Confidence Level → Alternatives Considered → Recommended Next Actions

## Explanation layers

1. **Simple** — user-friendly
2. **Operational** — administrator understanding
3. **Technical** — advanced users and developers

## Trust Score (0–100)

Inputs: explanation coverage, view rate, satisfaction, override frequency, escalations.

## Migration

`supabase/migrations/20260616700000_trust_transparency_explainability_phase76.sql`  
ABOS spec alignment: `supabase/migrations/20260926000000_trust_engine_abos_spec_alignment.sql` — see [TRUST_ENGINE.md](./TRUST_ENGINE.md)

Tables: `decision_explanations`, `explanation_events`, `explainability_trust_metrics`, `explanation_feedback`, `explainability_audit_log`

Note: Distinct from Phase 54 `aipify_trust_scores` (governance actor trust) — Phase 76 measures operational explainability trust.

## Integrations

Seeded explanations for: governance, marketplace, blueprint, desktop, value, agent collaboration

## Knowledge Center

Category: `trust`  
FAQ: `content/knowledge/aipify/trust/faq/trust-faq.md`

## Out of scope (V1)

- Hiding important reasoning
- False certainty
- Revealing sensitive information in explanations
- Explanations that bypass Governance
