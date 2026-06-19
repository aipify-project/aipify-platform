# AIPIFY – PHASE 537

**TITLE:** Universal Search, Discovery & Organizational Intelligence Engine  
**Feature owner:** CUSTOMER APP  
**Integrates with:** Command Bar (Cmd+K / Ctrl+K), Companion

## Purpose

Universal search experience across the Aipify platform — global search, natural language queries, permission-aware unified results, discovery, saved searches, and search analytics.

## Principle

Do not make users navigate. Help users discover. Users should search. Aipify should find.

## Routes

| Route | Surface |
|-------|---------|
| `/app/search` | Universal Search Center |
| `/app/search/discovery` | Discovery Engine |
| Cmd+K / Ctrl+K | Global Command Bar search (integrated) |

## Database (Phase 537 delta)

**New tables:**
- `organization_universal_search_settings`
- `organization_universal_search_index`
- `organization_universal_search_saved`
- `organization_universal_search_audit_logs`

## RPCs

- `get_universal_search_operations_center(p_section)` — center bundle
- `perform_universal_search_query(p_query, p_filters, p_mode, p_limit)` — unified permission-aware search
- `perform_universal_search_operations_action(p_action_type, p_payload)` — save search, rebuild index
- `_usearch537_rebuild_index(p_org_id)` — index from CRM, people, workflows, assets, domains
- `_usearch537_parse_natural_language(p_query)` — natural language intent
- `get_companion_universal_search_context(p_query)` — companion uses same engine
- `get_my_universal_search_summary()` — mobile-ready

## Module

`universal_search` · permissions `universal_search.view` / `universal_search.manage` · visibility `always`

## Migration

`supabase/migrations/20261853700000_universal_search_discovery_organizational_intelligence_engine_phase537.sql`

---

Aipify Group AS · Bergen. Norway. For the world.
