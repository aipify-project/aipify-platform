# CSP Messages & Materials — APP LIVE Report

**Status:** `CSP_MESSAGES_MATERIALS_APP_LIVE_VERIFIED`  
**PR:** [#362](https://github.com/aipify-project/aipify-platform/pull/362) (merged)  
**Merge SHA:** `1d23f9640d99c6f843655b8f7ce5eda5e0473965`  
**Core:** Production V3 already applied (`qbcqoixhrvhnuwphefvw`) — no new SQL in this delivery  
**Parallel:** PR #361 (APP customer catalog) — zero file overlap

## Production deploys

| Host | Project | Deploy ID | State |
|------|---------|-----------|-------|
| `app.aipify.ai` | `aipify-platform` | `dpl_HdSudvYDHN6Y3T1YMtWP4XGT5bWc` | READY |
| `aipify.ai` | `aipify-platform-iz5z` | `dpl_8fL3cwXEpKWGM6mY2FwxRakKgMgs` | READY |

## API / UI

| Surface | Behavior |
|---------|----------|
| Partner messages | List/reply/read via Core; partner id from session; spoof rejected |
| Partner materials | Published-only Core list; empty library = empty state (no fictional catalog) |
| Platform messages | Admin list + send; suspended targets blocked server-side |
| Platform materials | Upsert draft + publish/withdraw |
| Avatar | Storage + metadata + best-effort `csp_set_partner_avatar_url` |

## Access control verified

- Unauthenticated API → 401 (app routes)
- Suspended partner → Core/`partner_not_active` / portal gate
- Cross-partner spoof on reply → `forbidden`
- Unpublished materials not visible to sellers
- No mass send path

## Remaining real limitations

1. No Core-published materials until an admin registers + publishes real asset paths.
2. Admin message compose uses partner UUID (from profile deep-link `?partner=`).
3. No mass messaging by design.
4. Avatar Core sync is best-effort after Storage success.
