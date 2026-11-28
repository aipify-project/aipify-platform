# AIPIFY_WIDGET_APPEARANCE_EDITOR — APPROVAL_READY (candidate)

**Status:** APPROVAL_READY · **not applied** · **not LIVE**  
**Owner request needed:** exact YES per environment before any Core writer or Production activation.

## Finding (Master V3 / Phase I)

No safe existing APP/Core **read/write** contract was found for visitor-widget appearance (theme, welcome copy, colors) that Agent 2 can wire without inventing persistence.

Current APP surface `/app/website-kompis/appearance` remains an **honest hub** linking Connection, FAQ, Operator, Profile, and Support. It does **not** fake save.

Website Kompis **public chain remains frozen** — no widget runtime edits in this candidate.

## Proposed contract (authoring only)

| Item | Proposal |
| --- | --- |
| Channel | APP tenant settings (not public widget) |
| Read | `get_website_kompis_appearance_settings(org)` — returns approved fields only |
| Write | `upsert_website_kompis_appearance_settings` — owner/admin, audit, idempotency |
| Fields (draft) | `accent_token`, `welcome_message` (max length), `show_branding` — no raw CSS |
| Runtime | Public widget reads only **approved published** snapshot after separate publish step |
| Forbidden | UnoNight hardcoding · client-side secret · parallel widget fork |

## Tests required before YES

1. Local contract tests for null vs empty string vs unset  
2. Tenant isolation negative tests  
3. Fail-closed when RPC missing  
4. Frozen public-chain hashes unchanged  

## Exact approval packet (when owner is ready)

1. Staging SQL SHA (new migration candidate — not authored until YES to write SQL)  
2. Staging apply YES  
3. Staging signed-in E2E YES  
4. Production apply YES (separate)  

Until then: keep honest Appearance hub.
