# Implementation Blueprint — Phase 132 Coordinated Companion Workforce

See [COORDINATED_COMPANION_WORKFORCE_ENGINE_PHASE132.md](../../COORDINATED_COMPANION_WORKFORCE_ENGINE_PHASE132.md).

## Blueprint helpers

All `_ccwfbp132_*` — never collide with `_mag_*`, `_cmpm_*`, `_pco_*`.

## Engine helpers

All `_ccwf_*` for tenant settings, seed data, audit, and metrics.

## Public RPCs

- `get_companion_workforce_engine_dashboard()`
- `get_companion_workforce_engine_card()`
- `list_companion_workforce_members(p_tenant_id)`
- `record_companion_workforce_collaboration(...)`
- `record_companion_workforce_conflict(...)`
