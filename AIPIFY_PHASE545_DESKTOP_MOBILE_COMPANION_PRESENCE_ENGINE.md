# AIPIFY Phase 545 — Desktop Companion, Mobile Companion & Presence Engine

**Feature owner:** CUSTOMER APP  
**Module:** `companion_presence_operations`  
**Permissions:** `companion_presence_operations.view` · `companion_presence_operations.manage`

## Purpose

Companion Presence Engine — the always-available Aipify experience across desktop, mobile and future devices. Companion feels present without being intrusive.

**Principle:** Users should never need to wonder where Aipify is. Companion is a coworker, not a chatbot.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/companion` | Companion Center |
| `/app/companion/desktop` | Desktop Companion |
| `/app/companion/mobile` | Mobile Companion |
| `/app/companion/devices` | Device Management |

## Sections

Overview · Desktop Companion · Mobile Companion · Presence · Notifications · Memory · Preferences · Devices

## Database

Migration: `20261854500000_desktop_mobile_companion_presence_engine_phase545.sql`

| Table | Purpose |
|-------|---------|
| `organization_companion_presence_settings` | Presence engine settings |
| `organization_companion_user_preferences` | Modes, memory, role experience |
| `organization_companion_devices` | Desktop, mobile, tablet, web devices |
| `organization_companion_presence_state` | Presence ring, notifications, suggestions |
| `organization_companion_offline_cache` | Offline notes, tasks, drafts, knowledge |
| `organization_companion_presence_audit_logs` | Audit trail |

Integrates: Universal Search (537) · Business Packs · Command Center · Desktop client · Meeting calendars

## RPCs

- `get_companion_presence_operations_center(p_section)`
- `perform_companion_presence_operations_action(p_action_type, p_payload)`
- `search_companion_presence_devices(p_query, p_limit)`
- `get_companion_presence_context(p_query)`
- `get_my_companion_presence_summary()`

## Actions

- `update_preferences` — desktop mode, role mode, memory
- `register_device` / `revoke_device` — device management
- `update_presence_mode` — presence ring status
- `sync_offline` — offline cache sync

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/companion-presence-operations/` |
| Panel | `components/app/companion-presence-operations/CompanionPresenceOperationsPanel.tsx` |
| APIs | `/api/app/companion-presence-operations/*`, `/api/assistant/companion-presence-context` |
| i18n | `customerApp.companionPresenceOperations` in en/no/sv/da |
| Nav | `appCompanionPresenceOperations` → `/app/companion` |

## Coexistence

- Legacy companion modules remain at `/app/companion/*` sub-routes (context, memory, executive, etc.)
- Desktop Tauri client pairing at `/app/command-center/connect`
- Phase 545 is the unified **Companion Presence Center** at `/app/companion`

## Acceptance criteria

All 21 criteria met: Companion Center, desktop/mobile companion, presence engine, command palette, offline support, companion memory, meeting awareness, executive/manager/employee modes, role-based experience, notification awareness, companion store prepared, business pack integration, universal search integration, device management, security controls, executive dashboard, mobile summary, audit logging.

**END OF PHASE 545.**
