# AIPIFY – PHASE 535

**TITLE:** Strategic Intelligence, Decision Support & Executive Advisory Engine  
**Feature owner:** CUSTOMER APP  
**Extends:** Phase 436 (Decision Intelligence at `/app/intelligence/decisions`)

## Purpose

Strategic Intelligence Engine — transforms operational data into executive insight, recommendations, forecasts, trend detection, opportunity discovery, risk intelligence, companion advisory, organization health score, and board reporting.

## Principle

Data alone has little value. Understanding creates value. Action creates results. Companion helps leaders make better decisions, but humans remain in control.

## Routes

| Route | Surface |
|-------|---------|
| `/app/intelligence` | Strategic Intelligence Center |
| `/app/intelligence/briefing` | Executive Briefing (Since Last Login) |
| `/app/intelligence/recommendations` | Recommendation Engine |
| `/app/intelligence/board-reports` | Board Reporting |
| `/app/intelligence/decisions` | Decision Intelligence (Phase 436 — linked) |
| `/app/risk` | Risk Intelligence integration |
| `/app/governance` | Governance integration |
| `/app/quality-operations` | Compliance integration |

## Database (Phase 535 delta)

**New tables:**
- `organization_strategic_intelligence_settings`
- `organization_strategic_intelligence_insights`
- `organization_strategic_intelligence_recommendations`
- `organization_strategic_intelligence_forecasts`
- `organization_strategic_intelligence_trends`
- `organization_strategic_intelligence_opportunities`
- `organization_strategic_intelligence_briefings`
- `organization_strategic_intelligence_board_reports`
- `organization_strategic_intelligence_audit_logs`

## RPCs

- `get_strategic_intelligence_operations_center(p_section)` — center bundle with all sections
- `perform_strategic_intelligence_operations_action(p_action_type, p_payload)` — generate briefing, insight, recommendation, forecast, opportunity, board report
- `_sint535_compute_health_score(p_org_id)` — organization health score
- `get_companion_strategic_intelligence_context(p_query)` — companion advisory layer
- `get_my_strategic_intelligence_summary()` — mobile-ready summary

## Module

`strategic_intelligence` · permissions `strategic_intelligence.view` / `strategic_intelligence.manage`

## Migration

`supabase/migrations/20261853500000_strategic_intelligence_decision_support_executive_advisory_engine_phase535.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
