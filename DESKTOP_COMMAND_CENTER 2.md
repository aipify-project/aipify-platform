# Aipify Command Center — Desktop Application

**Phase 27 · Version 0.1 · High priority**

Native desktop client (Tauri, macOS Phase 1) that consumes **Aipify Core** via Presence events. The desktop app is another interface — not a separate product.

**Prerequisites:** [COMMAND_CENTER.md](./COMMAND_CENTER.md) (Phase 26) · [DESKTOP_PRESENCE_FOUNDATION.md](./DESKTOP_PRESENCE_FOUNDATION.md) (Phase 25)

**Code:** `apps/command-center/` (Tauri client) · `lib/desktop/` · APIs: `/api/desktop/*` · Pairing: `/app/command-center/connect`

---

## Layer ownership

| Surface | Layer | Responsibility |
|---------|-------|----------------|
| Desktop shell (tray, window) | **Desktop client** | `apps/command-center/` — UI only, no business logic |
| Session pairing UI | **Customer App** | `/app/command-center/connect` |
| Desktop session RPCs | **Shared** | `presence_desktop_sessions`, hashed tokens |
| Command Center bundle | **Shared** | `desktop_get_command_center()` delegates to Core |
| Quick actions | **Shared** | `desktop_perform_quick_action()` |

---

## 1. Architecture

```
Aipify Core
    ↓
Presence Engine
    ↓
Notification Engine
    ↓
Executive Engine
    ↓
Command Feed
    ↓
Desktop Client (Tauri)
```

Business logic stays in Core. The desktop client polls or fetches the bundle and renders presence state.

---

## 2. Phase 1 features (macOS)

- Menu bar / tray presence with status indicator (green · orange · red · grey)
- Executive feed
- Notification center summary
- Pending approvals
- Recent activity / activity timeline
- Quick actions (approve, dismiss, escalate, open dashboard, mark reviewed, pause notifications)
- Morning briefing
- Open web dashboard
- Quiet hours respected server-side

---

## 3. Authentication & security

1. User pairs from web at `/app/command-center/connect` (Business+ plan)
2. `create_desktop_client_session` returns a one-time session token
3. Token is hashed server-side; raw token never stored
4. Desktop client sends `Authorization: Bearer <token>` to `/api/desktop/*`
5. `validate_desktop_session` on each request; remote revoke via `/api/desktop/sessions/revoke`
6. **Never** store installation secrets locally

---

## 4. APIs

| Method | Route | Purpose |
|--------|-------|---------|
| POST | `/api/desktop/sessions` | Create pairing session (web, authenticated) |
| POST | `/api/desktop/sessions/revoke` | Revoke session (web or desktop) |
| GET | `/api/desktop/command-center` | Fetch bundle for desktop client |
| POST | `/api/desktop/quick-action` | Perform quick action |

Web bundle remains at `GET /api/presence/command-center`.

---

## 5. Plan packaging

| Plan | Desktop |
|------|---------|
| Starter | Web only |
| Growth | Executive summaries (web) |
| Business | Desktop Command Center + presence notifications + approvals |
| Enterprise | Desktop + future mobile + advanced notification policies |

Enforced in `get_command_center_bundle_for_tenant()` via `capabilities.desktop_client`.

---

## 6. Development

### Web app (pairing + APIs)

```bash
npm run dev
# Open http://localhost:3001/app/command-center/connect
```

### Desktop client

Requires [Rust](https://rustup.rs/) and macOS (Phase 1).

```bash
cd apps/command-center
npm install
npm run tauri:dev
```

Set API base URL in the desktop app settings (default `http://localhost:3001`).

---

## 7. Roadmap

| Phase | Target |
|-------|--------|
| **27 (this)** | macOS Tauri foundation, pairing, bundle consumption |
| 28+ | Windows, Linux, native notifications, auto-update |
| Future | Mobile companion (Enterprise) |

---

## 8. Unonight pilot

Validate usefulness, noise levels, notification quality, approval completion rates, and executive feed effectiveness via existing `/platform/presence-pilot` metrics plus desktop session engagement.

---

## 9. Principle

> Aipify should quietly work in the background. When something important happens, Aipify should already know. And when the user needs to know, Aipify should be there.
