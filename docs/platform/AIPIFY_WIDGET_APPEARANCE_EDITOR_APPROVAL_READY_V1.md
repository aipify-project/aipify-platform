# AIPIFY_WIDGET_APPEARANCE_EDITOR — APPROVAL_READY (candidate)

**Status:** APPROVAL_READY · **not applied** · **not LIVE**  
**Owner request needed:** exact YES per environment before any Core writer or Production activation.

## Finding (Master V5 / Phase C)

No safe existing APP/Core **theme** read/write contract was found for visitor-widget appearance (`accent_token`, free-text `welcome_message`, `show_branding`) that Agent 2 can wire without inventing persistence.

**Existing (reused, not invented):** domain install chrome (launcher icon / tone / welcome **variant**) via Connection → `GET/PATCH /api/app/domains/website-kompis` for verified domains. That is **not** the theme editor.

APP surface `/app/website-kompis/appearance` is fail-closed for theme save. It links Connection for install chrome and shows writer-unavailable status. It does **not** fake success.

Website Kompis **public chain remains frozen** — no widget runtime edits in this candidate.

## SQL candidate (authored)

| Item | Value |
| --- | --- |
| Path | `docs/platform/sql-candidates/website_kompis_appearance_settings_v1.sql` |
| SHA256 | `6a95f4dc9f1dcd3aaf12146da914de9034a576521c16a3fc44020b7ec614f696` |
| Table | `website_kompis_appearance_settings` |
| Read | `get_website_kompis_appearance_settings()` |
| Write | `upsert_website_kompis_appearance_settings(text, text, boolean, text)` |
| Grants | **revoked** until separate activation YES |
| Apply | **blocked** until exact owner YES |

## Proposed contract

| Item | Proposal |
| --- | --- |
| Channel | APP tenant settings (not public widget) |
| Fields | `accent_token` ∈ companion_purple \| soft_indigo \| slate · `welcome_message` ≤ 160 · `show_branding` boolean — no raw CSS |
| Runtime | Public widget reads only **approved published** snapshot after separate publish step |
| Forbidden | UnoNight hardcoding · client-side secret · parallel widget fork · public-chain mutation |

## Adapter (APP)

- `lib/website-kompis-appearance/` — fail-closed read/write until RPCs exist and are activated
- Contract version: `v1_candidate`

## Tests required before YES

1. Local contract tests for null vs empty string vs unset  
2. Tenant isolation negative tests  
3. Fail-closed when RPC missing (shipped)  
4. Frozen public-chain hashes unchanged  

## Exact approval packet

1. Staging SQL apply YES — file + SHA above  
2. Staging grants + APP writer gate YES  
3. Staging signed-in E2E YES  
4. Production apply YES (separate)  
5. Production activation YES (separate)  

Until then: keep fail-closed Appearance surface.
