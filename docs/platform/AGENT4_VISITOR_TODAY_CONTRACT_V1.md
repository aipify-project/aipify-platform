# Agent 4 — visitor-today contract (Agent 3 owned)

**Owner (contract + adapter):** Agent 3  
**Owner (top-bar / presence UI):** Agent 4  
**Code:** `lib/platform-portal/visitor-today-contract.ts` · `visitor-today-ga4-adapter.ts`  
**Consumer:** `loadPlatformTrafficStatus` → `PlatformTrafficStatus.visitorsToday`

## Metric

| Field | Value |
|---|---|
| Metric | `unique_visitors_today` |
| Not this metric | sessions, events, pageviews alone |
| Day zone | Platform authoritative TZ (`resolveAuthoritativeTimeZone`, typically Europe/Oslo) |
| Day bounds | Calendar day start inclusive → end exclusive |
| asOf | Snapshot assembly time (ISO) |
| Freshness | `fresh` · `delayed` · `stale` · `unavailable` — GA4 is **not** realtime by default |
| 0 vs unavailable | `value: 0` = measured empty day; `unavailable` = not configured / failed / gated |

## Fail-closed rules

1. Missing property ID or credentials → `not_measured` (never invent 0).
2. Credentials present but live Data API fetch not approved → `source_unavailable` + note “gated”.
3. No PII, no raw analytics payloads in top-bar.
4. Platform/Super pages must not be GA4-tracked (existing taxonomy).
5. No new client tracking tags without separate YES.

## Approval for live GA4 Data API

```text
YES WIRE GA4 Data API unique_visitors_today for Platform status bar
using property verified in env (no secret in PR), Staging verify first,
then Production. Delayed reporting allowed; never label as realtime.
```

## Fixtures

Unit: `lib/platform-portal/visitor-today-contract.test.ts`  
- empty env → unavailable  
- credentials + property without YES → gated unavailable  
- `fixtureUniqueVisitors: 12` → measured value (tests only)
