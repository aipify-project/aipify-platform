# Platform Analytics metrics enrichment SQL V2

| Field | Value |
|-------|--------|
| File | `docs/platform/sql-candidates/platform_analytics_metrics_enrichment_v2.sql` |
| Status | **PREPARED_ONLY** |
| Purpose | Expose `subscriptions.active` / `trialing` / `cancelled` on `get_platform_metrics` so Analytics can stop marking paid subscription headcount unavailable |
| Dependencies | Existing `subscriptions`, `customers`, `installations`, `invoices`, `usage_statistics`, `is_platform_admin()` |
| Side effects | Replaces function body only; additive JSON keys; no data mutation |

## Staging approval point

> **APPROVE STAGING APPLY**  
> File: `docs/platform/sql-candidates/platform_analytics_metrics_enrichment_v2.sql`  
> SHA256: 7df1665d3564bde38ffc80f10767c6cdcf1a7bbb6ba6fea4033fcd3c54bd83be  
> Project: `auedugihkduoaikfusqe` only  
> Production requires a separate exact approval.
