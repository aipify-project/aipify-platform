# Platform Admin — Visitors today (GA4) integration contract V1

**Owner coordination:** Agent 3 (analytics) · **Consumer:** Agent 4 status bar  
**Status:** APPROVAL CANDIDATE — no credentials, tracking, or env changes in this job.

## Current product policy

From `lib/platform-analytics/definitions.ts` (visits KPI):

> Anonymous consented traffic stays in Google Analytics. Platform Admin does not import GA4 report rows without a separate Data API credential.

Therefore the global status bar shows **not_measured** for Visitors today until approval lands.

## Required integration (when approved)

| Item | Contract |
|---|---|
| Property | Same GA4 property as public consented measurement |
| Metric | Unique users (`activeUsers`) — **not** sessions or pageviews |
| Window | Calendar day in authoritative Platform timezone (same as new customers/sellers) |
| Delay | Surface GA4 reporting lag in tooltip; never call delayed data “exact realtime” |
| Consent | Respect existing public consent; no new tracking or duplicate events |
| Secrets | Server-only Data API credential; never client / `NEXT_PUBLIC_` |
| API shape | Prefer a Core/server aggregate RPC returning `{ state:"value", value:n }` or unavailable |

## Status bar behavior until then

- `visitorsToday: { state: "unavailable", reason: "not_measured" }`
- Tooltip cites GA4 Data API pending (Agent 3)
- Real `0` only after a complete approved aggregate returns zero

## Explicitly not authorized here

New measurement IDs · credential rotation · client-side GA4 report calls · invented visitor counts
