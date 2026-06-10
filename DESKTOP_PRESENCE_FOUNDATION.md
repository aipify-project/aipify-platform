# Aipify Desktop Presence Foundation

**Phase 25 · Version 1.0 · High priority**

Prepares notification infrastructure for future macOS, Windows, and Linux desktop apps. Native apps are **not** built in this phase.

**Prerequisites:** Phase 13 Presence System · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) §7

**Code:** `lib/presence/` · Customer: `/app/presence` · APIs: `/api/presence/*` · Pilot: `/platform/presence-pilot`

---

## Layer ownership

| Surface | Layer | Responsibility |
|---------|-------|----------------|
| Presence page, notification list, preferences UI | **Customer App** | `/app/presence` |
| Notification delivery APIs (desktop-ready) | **Shared / Presence** | `/api/presence/*` |
| Unonight pilot metrics | **Platform Admin** | `/platform/presence-pilot` |
| Existing Presence Center (topbar) | **Customer App** | `PresenceProvider` (Phase 13) |

---

## 1. Notification levels

`informational` → `important` → `action_required` → `critical`

Users control minimum levels per channel. Critical may bypass quiet hours.

---

## 2. Presence events

Support resolved · Executive briefing ready · Installation completed · Payment issue · Recommendation generated · Health warning · Update scheduled · Automation completed · Customer escalation

Templates in `lib/presence/personality.ts` — professional tone, no spam.

---

## 3. Actionable notifications

Actions: `view_details` · `approve_recommendation` · `open_dashboard` · `dismiss` · `escalate`

`POST /api/presence/notifications/[id]/action`

---

## 4. Quiet hours

Modes: `standard` · `working_hours_only` · `minimal` · `vacation`

Logic: `lib/presence/quiet-hours.ts` · `shouldDeliverNotification()`

---

## 5. Channels (infrastructure prepared)

- `in_app` — Customer App + Presence Center
- `desktop` — future native clients
- `email_digest` — digest delivery (not implemented)
- `mobile_push` — future mobile
- `future_integration` — extensibility

---

## 6. Desktop sidebar (future apps)

Sections: health status · recent activity · recommendations · executive summary · pending approvals · active skills

Bundle: `GET /api/presence/desktop-bundle` · RPC `get_desktop_presence_bundle()`

---

## 7. Database (Phase 25)

| Table | Purpose |
|-------|---------|
| `presence_notifications` | Structured notifications with levels and actions |
| `presence_notification_preferences` | Quiet hours + channel prefs |
| `presence_desktop_clients` | Future macOS/Windows/Linux registration |

---

## 8. Unonight pilot

`/platform/presence-pilot` tracks notifications sent, actions completed, dismiss rate, usefulness score (7-day window).

---

## 9. Principle

> Aipify should work quietly in the background and speak up only when it has something valuable to say.
