# Product Roadmap & Idea Management Engine — Phase 276

**Feature owner:** Platform Admin  
**Route:** `/platform/product/roadmap-center`  
**Module:** `lib/product-roadmap/`  
**Migration:** `supabase/migrations/20261463000000_product_roadmap_idea_management_engine_phase276.sql`

## Purpose

Structured system for collecting, prioritizing, planning, and tracking product initiatives across the Aipify ecosystem.

## Capabilities

| Area | Description |
|------|-------------|
| Roadmap categories | New features, improvements, technical debt, security, customer requests, growth, strategic |
| Roadmap views | Now, Next, Later, Under consideration, Completed |
| Idea intake | Title, description, category, source, strategic value, effort, priority, related phases |
| Scoring framework | Customer demand, revenue, alignment, complexity, risk reduction, competitive advantage |
| Status workflow | New → Under review → Approved → Planned → In development → Testing → Released / Declined |
| Customer linking | Multiple requests per initiative; enterprise and Growth Partner counts |
| Release communication | Publish to release notes, customer announcements, in-app notifications |
| Filters | Category, priority, status, source, release window |
| Audit logging | Idea created, priority/status changes, releases, customer linkage |

## APIs

| Method | Path | RPC |
|--------|------|-----|
| GET | `/api/product-roadmap/overview` | `get_product_roadmap_center(p_filters)` |
| POST | `/api/product-roadmap/actions` | `record_product_roadmap_action(p_payload)` |

## Founding principle

The best product roadmaps are shaped by customer needs, strategic thinking, and disciplined execution.

Aipify Group AS — Bergen, Norway. For the world.
