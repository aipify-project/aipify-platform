# Live presence heartbeat — Agent 1 / Agent 2 integration contract V1

**Owner:** Agent 4 (contract + Staging Core apply)  
**Mount owners:** Agent 1 (APP shell) · Agent 2 (SELLER / Growth Partner shell)  
**Do not edit Agent 1/2 worktrees from Agent 4.**

## Shared artifacts (already in repo on PR #534)

| Piece | Path |
|---|---|
| Client helper | `lib/platform-portal/live-presence/client-heartbeat.ts` |
| Constants / TTL | `lib/platform-portal/live-presence/constants.ts` (`TTL=300s`, min interval `60s`) |
| API | `POST /api/live-presence/heartbeat` |
| Staging Core | Applied on `auedugihkduoaikfusqe` as migration `platform_admin_global_live_status_presence_snapshot_v1` |
| Production Core | **Not applied** — API/RPC must fail closed |

## Mount rules (APP / SALE)

1. Call `sendLivePresenceHeartbeat({ portal, clientInstanceId })` from **one** shell-level poller (not per page).
2. Portal claim:
   - APP → `app_customer`
   - SALE/Growth Partner → `seller`
3. Persist `createLivePresenceClientInstanceId()` per browser tab/session (dedupe tabs server-side by `auth_user_id + portal + client_instance_id`).
4. Interval ≥ `PLATFORM_LIVE_PRESENCE_HEARTBEAT_MIN_INTERVAL_MS` (60s). Pause when `document.hidden`; resume on focus.
5. On logout / session loss: stop polling; no further writes.
6. On network / 503 `not_measured`: backoff quietly — do not invent presence.
7. **Production:** if heartbeat returns 503/forbidden, remain fail-closed (no retries storm). Staging-only activation is OK until Production SQL + owner writer activation.

## Server guarantees (already)

- Portal claim verified server-side (no spoofing)
- Aggregates only in admin snapshot (no PII)
- Signed-in = distinct union across portals (never sum)
- Table revoked from `anon`/`authenticated` direct access; RLS on

## Out of scope for Agents 1/2

- Platform Admin topbar / traffic-status API (Agent 4)
- GA4 visitors (Agent 3)
- Production SQL apply / new retention deletes
