# AI Decision Support & Recommendation Engine — Phase 280

**Feature owner:** Platform Admin  
**Route:** `/platform/intelligence/decision-center`  
**Module:** `lib/platform-decision-center/`  
**Migration:** `supabase/migrations/20261467000000_ai_decision_support_recommendation_engine_phase280.sql`

## Purpose

Provide executives, administrators, and customer success teams with AI-powered recommendations based on operational data, customer behavior, and platform insights.

## Capabilities

| Area | Description |
|------|-------------|
| Overview cards | Generated, accepted, declined, high impact, risks, pending reviews |
| Categories | Customer success, revenue growth, product, support, operational efficiency, security, governance |
| Recommendation record | Title, description, category, impact, confidence (0–100%), status, recommended actions |
| Impact levels | Low, medium, high, strategic |
| Status workflow | New → under review → accepted → implemented / dismissed |
| Executive summary | Opportunities and risks highlighted for leadership |
| Actions | Accept, dismiss, start review, mark implemented, create task, assign owner, add note, link roadmap |
| Filters | Category, impact level, confidence minimum, status, owner |
| Audit logging | Generated, reviewed, accepted, dismissed, task created |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/platform-decision-center/overview` | `get_platform_decision_center(p_filters)` |
| POST | `/api/platform-decision-center/actions` | `record_platform_decision_action(p_payload)` |

## Distinction

This is the **Platform Admin** decision intelligence surface under Intelligence → Decision Center. The Customer App Decision Support Engine (Phase DSE) at `/app/assistant/decisions` remains tenant-scoped personal/business guidance — separate module and tables.

## Founding principle

Information alone is not enough. The true value of intelligence lies in helping people make better decisions at the right time.

Aipify Group AS — Bergen, Norway. For the world.
