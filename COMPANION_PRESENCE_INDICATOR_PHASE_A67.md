# Companion Presence Indicator & Online Status Engine — Phase A.67

**Feature owner:** Customer App

Floating Aipify companion indicator for Customer App routes — system presence and operational summaries only. **Not employee surveillance.** **Distinct from Proactive Companion Engine (A.79)** — A.67 is the floating orb and heartbeat; A.79 manages proactive assistance categories and nudges.

## Extends

- Command Center & Notification Engine (A.26)
- Desktop Presence Foundation (A.25)
- Admin Assistant Engine (A.6) — since-last-login summaries
- Personal Productivity Engine (A.70) — orb integration counts

## Routes

- Floating indicator: all `/app/*` routes via `DashboardShell`
- Settings: `/app/settings/companion-presence`
- API: `GET/POST/PATCH /api/presence/heartbeat`

## Tables

- `companion_presence` — per org/user/device heartbeat and derived state
- `companion_presence_settings` — org-level indicator configuration
- `companion_presence_user_preferences` — user quiet mode and collapse preferences
- `companion_presence_audit_logs` — critical alert ack, quiet mode, org settings only

## States

`idle` · `working` · `attention_needed` · `critical_alert` · `disconnected` · `quiet_mode`

## Permissions

`companion.view` · `companion.manage`

## RPCs

- `get_companion_presence_bundle()`
- `record_companion_heartbeat()`
- `update_companion_presence_state()`

## Code

- `lib/presence/companion-presence.ts` — types, state styles, device id helper
- `lib/core/companion-presence.ts` — RPC client helpers
- `lib/aipify/companion-presence-engine/` — parse utilities
- `components/app/companion-presence/CompanionPresenceIndicator.tsx`
- Migration: `supabase/migrations/20260911500000_companion_presence_indicator_phase_a67.sql`

## Privacy

Metadata only — no keystrokes, screens, or colleague monitoring. Companion reflects Aipify system status and user-scoped operational counts.

## Accessibility

`aria-label` on indicator and panel; `prefers-reduced-motion` disables orb animations.
