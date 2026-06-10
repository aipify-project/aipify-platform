# Aipify Command Center & Notification Engine

**Phase 26 · Version 1.0 · High priority**

Unified Command Center consuming **one** Aipify Core event infrastructure. Web, Desktop, and Mobile are interfaces — not separate products.

**Prerequisites:** [DESKTOP_PRESENCE_FOUNDATION.md](./DESKTOP_PRESENCE_FOUNDATION.md) (Phase 25) · Phase 13 Presence System

**Code:** `lib/notification/` · `lib/presence/` · Customer: `/app/command-center` · APIs: `/api/presence/command-center`, `/api/presence/quick-action`

**Desktop (Phase 27):** [DESKTOP_COMMAND_CENTER.md](./DESKTOP_COMMAND_CENTER.md) · `apps/command-center/` · `/api/desktop/*` · `/app/command-center/connect`

---

## Layer ownership

| Surface | Layer | Responsibility |
|---------|-------|----------------|
| Command Center UI | **Customer App** | `/app/command-center` |
| Notification Engine | **Shared** | `lib/notification/` — distributes Core events |
| Presence Engine | **Shared** | `lib/presence/` — states, preferences, personality |
| Delivery APIs | **Shared** | `/api/presence/*` |
| Unonight validation | **Platform Admin** | `/platform/presence-pilot` |

---

## 1. One Aipify Core

Business logic never duplicates. `get_command_center_bundle()` aggregates from existing engines (license limits, installations, skills, patterns, notifications).

Stack: Install → SkillOS → Intelligence → Action → Presence → Update → Trust → License → Executive → **Notification Engine**

---

## 2. Command Center sections

Executive Feed · Recent Activity · Health Overview · Pending Approvals · Recommendations · Presence Timeline · Skill Status · System Notifications · Quick Actions

---

## 3. Executive Feed

Continuous operational awareness timeline (`presence_executive_feed`). Professional tone — no spam.

---

## 4. Quick actions

Approve recommendation · Review escalation · Open executive summary · View installation health · Dismiss · Pause notifications · Open web dashboard · Mark as reviewed

`POST /api/presence/quick-action`

---

## 5. Quiet hours

Includes **Do Not Disturb** (blocks all except critical). Modes: standard · working_hours_only · minimal · vacation · do_not_disturb

---

## 6. Plan packaging

| Plan | Presence capabilities |
|------|----------------------|
| Starter | Web only |
| Growth | Enhanced presence + Executive Feed |
| Business | Desktop presence + Command Center + actionable approvals |
| Enterprise | Mobile presence + dedicated notification policies |

Source: `lib/notification/packaging.ts` · enforced in `get_command_center_bundle()`

---

## 7. Engagement tracking

`presence_engagement_events` records actions and quick actions to prevent alert fatigue.

---

## 8. Development phases

1. **Phase 26** — infrastructure, notification engine, executive feed, preferences
2. **Phase 27** — Tauri desktop client (macOS), session pairing, `/api/desktop/*`
3. Windows / Linux desktop clients
4. Mobile experiences

---

## 9. Principle

> Aipify should quietly watch over the business. When something truly matters, Aipify should speak up.
