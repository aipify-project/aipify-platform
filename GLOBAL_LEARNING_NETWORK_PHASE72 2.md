# Global Learning Network & Core Evolution Engine — Phase 72

Privacy-safe global intelligence layer that improves Aipify Core from anonymous patterns, not customer secrets.

## Philosophy

Three intelligence levels: **Local** (tenant-only), **Organizational** (internal cross-team), **Global** (anonymous, opt-in). Global Learning learns from outcomes and patterns — never names, emails, conversations, or secrets.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/global-learning` | Dashboard with intelligence levels and participation summary |
| `/app/global-learning/settings` | Participation mode and category controls |
| `/app/global-learning/contributions` | Transparency dashboard for tenant contributions |
| `/app/evolution` | Core Evolution Board — review proposals |

## API

| Endpoint | RPC |
|----------|-----|
| `GET /api/aipify/global-learning/dashboard` | `get_global_learning_dashboard` |
| `GET/PATCH /api/aipify/global-learning/settings` | `get/update_global_learning_settings` |
| `GET /api/aipify/global-learning/export` | `export_global_learning_contribution_summary` |
| `POST /api/aipify/global-learning/submit` | `submit_global_learning_signal` |
| `POST /api/aipify/global-learning/collect` | `collect_global_learning_signals` |
| `GET /api/aipify/evolution/board` | `get_evolution_board` |
| `PATCH /api/aipify/evolution/proposals/[id]` | `update_core_evolution_proposal` |

## Participation modes

| Mode | Description |
|------|-------------|
| `none` | No Global Learning contributions |
| `anonymous_insights` | Aggregated patterns only (default) |
| `extended` | Broader anonymous participation with explicit consent |

## Anonymization pipeline

1. Collect candidate signal
2. Remove identifiers via `_glrn_sanitize_payload`
3. Convert to structured pattern
4. Policy Engine evaluation
5. Check participation settings
6. Store approved `global_learning_events` (no tenant_id)

## Migration

`supabase/migrations/20260616200000_global_learning_network_phase72.sql`

## Tables

- `tenant_global_learning_settings`
- `tenant_global_learning_contributions`
- `global_learning_events`
- `global_learning_patterns`
- `core_evolution_proposals`
- `global_learning_feedback`
- `global_learning_audit_log`

## Knowledge Center

Category: `global-learning`  
FAQ: `content/knowledge/aipify/global-learning/faq/global-learning-faq.md`

## Integrations

- **Learning Engine (Phase 65):** `collect_global_learning_signals` aggregates local events
- **Policy Engine (Phase 67):** `evaluate_policy` on signal submit
- **Industry Blueprints (Phase 70):** Blueprint performance patterns
- **Marketplace (Phase 69):** Pack adoption patterns

## Out of scope (V1)

- Training on raw customer content
- Auto-modifying customer environments
- Cross-tenant identity revelation
- Legal compliance certification claims
