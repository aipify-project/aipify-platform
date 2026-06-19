# AIPIFY Phase 539 — Companion Command Center & Organizational Operating Hub

**Feature owner:** CUSTOMER APP  
**Module:** `companion_command_center`  
**Permissions:** `companion_command_center.view` · `companion_command_center.manage`

## Purpose

Central Companion workspace — the operational brain of the organization. Not a chatbot, not a support widget, not a passive dashboard.

**Principle:** Users should not open Aipify and wonder where to begin. Aipify should already know.

## Routes

| Route | Purpose |
|-------|---------|
| `/app/command-center` | Companion Command Center (default landing experience) |
| `/app/command-center/actions` | Action Center — tasks, approvals, reviews, meetings, workflows |
| `/app/command-center/connect` | Desktop Companion pairing (unchanged) |

## Command Center Layout

1. Organization Health  
2. Since Last Login  
3. Recommended Actions  
4. Approvals Waiting  
5. Critical Alerts  
6. Companion Recommendations  
7. Business Pack Highlights  
8. Personal Priorities  

## View Modes

- **Executive** — organization health, briefing, risks, strategic priorities  
- **Manager** — team activity, approvals, workload, operational alerts  
- **Employee** — personal workspace, tasks, meetings, approvals  

Role-based personalization via `organization_users.role`.

## Database

Migration: `supabase/migrations/20261853900000_companion_command_center_organizational_operating_hub_phase539.sql`

| Table | Purpose |
|-------|---------|
| `organization_companion_command_center_settings` | Hub settings and view defaults |
| `organization_companion_command_center_recommendations` | Companion recommendation engine |
| `organization_companion_command_center_alerts` | Critical alert center |
| `organization_companion_command_center_actions` | Action center items |
| `organization_companion_command_center_memory` | Companion memory layer |
| `organization_companion_command_center_pack_intel` | Business Pack intelligence |
| `organization_companion_command_center_audit_logs` | Audit trail |

## RPCs

- `get_companion_command_center(p_view_mode, p_section)`
- `perform_companion_command_center_action(p_action_type, p_payload)`
- `get_companion_command_center_context(p_query, p_view_mode)`
- `get_my_companion_command_center_summary()`

## Code

| Layer | Path |
|-------|------|
| Lib | `lib/companion-command-center/` |
| Panel | `components/app/companion-command-center/CompanionCommandCenterPanel.tsx` |
| APIs | `/api/app/companion-command-center/*`, `/api/assistant/companion-command-center-context` |
| i18n | `customerApp.companionCommandCenter` in en/no/sv/da |
| Nav | `appCompanionCommandCenter` in `lib/app/nav-config.ts` |

## Integrations

- **Phase 538 Activity** — since last login via `_aact538_build_since_last_login`
- **Phase 537 Search** — Cmd+K and search bar link to `/app/search`
- **Phase 535 Intelligence** — executive briefing route `/app/intelligence/briefing`
- **Approvals** — `/app/approvals`
- **Notifications** — `/app/notifications`
- **Desktop** — `/app/command-center/connect`

## Acceptance criteria

- Companion Command Center at `/app/command-center`
- Organization Health Engine with status levels (🟢 ⚠️ 🚨)
- Executive Briefing, Recommendation Engine, Action Center
- Approval widget, Critical Alert Center, Personal Workspace
- Companion Memory Layer, Business Pack Intelligence
- Search integration, Companion Conversation panel, Decision Support
- Meeting Intelligence, Notifications Hub, Mobile summary RPC
- Executive / Manager / Employee modes with audit logging

**END OF PHASE 539.**
