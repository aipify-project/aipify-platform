# Aipify — Permanent Business Pack Activation Gate

Permanent platform rule for all current and future upgrades, plans, modules, add-ons, and Business Packs.

A customer must **never** see a newly purchased or activated feature before the complete activation chain has passed automated validation.

## Required activation sequence

```
payment or plan change
→ subscription update
→ license validation
→ Business Pack installation
→ entitlement creation
→ required database tables and schemas
→ required RPC availability
→ role permissions
→ organization module status
→ read-only GET validation
→ focused smoke check
→ menu and route visibility
```

## Atomic activation

A feature is either:

- **fully validated and available** (`active`)
- **hidden**
- **shown as activation in progress** (`pending_activation`, `validating`)

Do not expose partially provisioned modules.

## Activation states

| State | Customer menu | Customer message |
|-------|---------------|------------------|
| `pending_activation` | Hidden | Aktivering pågår |
| `validating` | Hidden | Aktivering pågår |
| `active` | Visible | — |
| `activation_failed` | Hidden | Safe message only |
| `suspended` | Hidden | Billing/support path |
| `removed` | Hidden | — |

Only `active` may expose the full customer route.

## Failure behavior

If any activation step fails:

- Do not expose the menu entry as active
- Do not send the customer to a broken page
- Keep entitlement in pending or failed activation state
- Log the exact failed step
- Store a safe diagnostic result
- Notify Platform Admin (`platform_health_alerts`)
- Allow governed, idempotent retry
- Preserve previous working access
- Do not partially revoke unrelated features

## Required validation (before menu visibility)

- Subscription is active
- License is active (or approved grace/internal)
- Business Pack is installed
- Entitlement exists and is active
- Required tables exist
- Required RPCs exist with expected signatures
- PostgREST schema cache recognizes RPCs (`pg_proc` presence)
- Required permissions exist
- Role-to-permission grants exist
- Organization modules are staged/active
- GET/list RPCs are read-only (no INSERT/UPDATE/UPSERT in STABLE/IMMUTABLE bodies)
- Route guard and API use the same organization context
- Smoke validation passes (SQL gate; HTTP smoke optional extension)
- No false Permission Missing or access_denied for SQL execution errors

## Migration rule

Never re-run historical migrations in production to activate a feature.

Use only:

- forward-only migrations
- idempotent provisioning migrations
- focused compatibility migrations
- explicit activation functions (`run_business_pack_activation_gate`)
- safe schema-cache reloads (`notify pgrst, 'reload schema'`)

Historical migrations may be patched in the repository for future clean installations.

## Security and governance

Do **not** solve activation failures with:

- Owner bypasses
- Direct user permissions
- Hardcoded customer IDs
- Organization-name matching
- Hidden manual database edits
- Broad permission grants
- Automatic re-running of historical migrations

Access flow:

```
organization → subscription → license → Business Pack → entitlement → module → role permission → validated route access
```

## Code

- Tables: `organization_business_pack_activation_gates`, `organization_business_pack_activation_step_logs`
- Orchestrator: `run_business_pack_activation_gate()` (VOLATILE)
- Retry: `retry_business_pack_activation_gate()` (VOLATILE, idempotent)
- Read: `get_organization_business_pack_activation_gates()` (STABLE)
- Platform: `get_platform_business_pack_activation_overview()` (STABLE, aggregates)
- Menu gate: `is_organization_module_active()`, `_dmn505_is_nav_visible()`
- Module staging: `activate_business_pack_modules()` → gate → `active` only when validated

## Phase 620 freeze

Services V1 must not be frozen until this gate is enforced. See `.cursor/rules/business-pack-activation-gate.mdc`.
