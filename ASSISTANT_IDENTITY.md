# Assistant Identity & Welcome Experience (Foundation Module)

Foundation module for Aipify's assistant personality: welcome flow, phrase library, communication preferences, and Knowledge Center FAQ. Aipify should feel like a professional assistant you hired — not software you must configure alone.

## Philosophy

- Ask who hired Aipify
- Learn preferred name and communication style
- Store safely in tenant + Memory Engine
- Use in briefings, Desktop Companion, notifications, and support tone
- Never override governance, approvals, or user control

## Customer App routes

| Route | Purpose |
|-------|---------|
| `/app/welcome` | Six-step welcome flow |
| `/app/settings/assistant-identity` | Edit identity, preferences, reset welcome |

## API routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/aipify/assistant-identity/profile` | GET, PATCH | Identity profile bundle |
| `/api/aipify/assistant-identity/card` | GET | Home banner card |
| `/api/aipify/assistant-identity/greeting` | GET | Render greeting by context |
| `/api/aipify/assistant-identity/welcome/start` | POST | Start welcome (audit event) |
| `/api/aipify/assistant-identity/welcome/complete` | POST | Complete welcome + Memory sync |
| `/api/aipify/assistant-identity/preferences` | GET, PATCH | User communication prefs |
| `/api/aipify/assistant-identity/settings` | GET, PATCH | Tenant governance settings |
| `/api/aipify/assistant-identity/phrases/render` | POST | Render phrase with variables |
| `/api/aipify/assistant-identity/reset` | POST | Reset welcome flow |
| `/api/aipify/assistant-identity/unonight/seed` | POST | Unonight pilot seed |

## Database (migration `20260615500000_assistant_identity_foundation.sql`)

- `assistant_identity_settings` — tenant governance (enable, require welcome, phrase overrides)
- `assistant_identity_profiles` — owner name, address name, style, focus, uncertainty, welcome state
- `assistant_communication_preferences` — per-user language, tone, greeting toggles
- `assistant_phrase_templates` — global + tenant phrase library (no/en/sv/da seeds)
- `assistant_identity_events` — audit trail (welcome_started, preferences_set, etc.)

Key RPCs: `get_assistant_identity_profile`, `start_assistant_welcome`, `complete_assistant_welcome`, `render_assistant_phrase`, `get_assistant_greeting`, `reset_assistant_welcome`, `seed_unonight_assistant_identity`.

## Library

`lib/aipify/assistant-identity/` — types, parse, safety (unsafe phrase blocklist), barrel export.

## Integrations

| Module | Integration |
|--------|-------------|
| **Home** | `AssistantIdentityWelcomeBanner` when welcome incomplete |
| **Briefing** | `AipifyBriefingCard` fetches `since_last_login` greeting |
| **Desktop Companion** | `DesktopCompanionCard` fetches `daily_greeting` from identity |
| **Memory Engine** | `complete_assistant_welcome` syncs via `_mem_upsert_profile` |
| **Knowledge Center** | FAQ + guides under `content/knowledge/aipify/assistant/` |
| **Governance** | `assistant_identity_settings` controls personalization |
| **Audit** | `assistant_identity_events` logs changes |

## Relation to Phase 34 Identity Engine

Phase 34 (`/app/assistant/identity`, `identity_profiles`) handles per-user communication style in the Identity Engine. Assistant Identity is the **foundation welcome and phrase layer** — complementary, not duplicate.

## Unonight pilot

Call `POST /api/aipify/assistant-identity/unonight/seed` or RPC `seed_unonight_assistant_identity` for tenant-specific welcome phrases and briefing copy.

## Knowledge Center import

After deploy:

```json
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```

Category slug: `assistant-identity`.

## Safety

`lib/aipify/assistant-identity/safety.ts` blocks emotionally manipulative or unsafe phrases before render. Warm tone never bypasses approvals or Emergency Stop.
