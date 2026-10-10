# Website Kompis Public Site Index — Multi-batch & Auto-refresh Design (PR #96)

Task: `AIPIFY.PR96.UNIVERSAL.PUBLIC.SITE.INDEX.MULTIBATCH.AND.REFRESH.V1`  
Classification: **code-only** — no Production writes, scheduler activation, SQL, merge, or deploy.

## Product model

One reusable Aipify Core engine for every consented, verified customer HTTPS domain. Customers do not supply DB credentials or hand-seed FAQ for public pages. Discovery uses robots.txt + nested sitemaps. UnoNight is a validation fixture only.

## Multi-batch continuation

| Concern | Design |
|---|---|
| Per-request ceiling | `maxPages` ≤ `WEBSITE_KOMPIS_PUBLIC_SITE_INDEX_MAX_PAGES` (80); operator default 30 |
| Site coverage | Successive batches via `nextCursor` until `complete=true` |
| Discovery | `discoverPublicSiteIndexUrls` — robots fail-closed, `Sitemap:` directives, nested sitemapindex depth ≤ 3, deterministic URL sort, fingerprint SHA-256 |
| Cursor | base64url JSON bound to `tenantId` + `installId` + `verifiedHost` + `discoveryFingerprint` + `offset` + digest; TTL 24h; rediscovery must match fingerprint |
| Incomplete honesty | `complete=false`, `remaining>0`, `runStatus=in_progress` when more batches remain; never claim complete after one batch |
| Discovery ceiling | 5 000 URLs; `discoveryTruncated` when hit |

Existing Core tables (`tenant_public_site_index_*`, including `crawl_runs.metadata` jsonb) are sufficient for a future persist ledger. **No new SQL in this task.**

## Auto-refresh (default OFF)

| Concern | Design |
|---|---|
| Planner | `planPublicSiteIndexRefresh` — process new/changed/stale-by-age; mark removed URLs stale **only** after complete discovery |
| Stale window | 7 days (`stale_after` aligned) |
| Partial failure | Never mass-stale/delete on incomplete crawl or transient errors |
| Scheduler | `registerPublicSiteIndexAutoRefreshScheduler` always returns `registered:false`; **no cron route shipped** |
| Env gates | `AIPIFY_PUBLIC_SITE_INDEX_AUTO_REFRESH_ENABLED` requires persist gate too |

## Persist write gate (default OFF)

Persist requires **all** of:

1. Operator trust (platform RPC)  
2. `dryRun=false`  
3. `confirmation=true`  
4. `AIPIFY_PUBLIC_SITE_INDEX_WRITES_ENABLED=true` (unset → denied)

Confirmation alone after deploy cannot write. Dry-run never constructs a service-role write path when gate denies.

## Security invariants (unchanged)

Verified host HTTPS · SSRF/DNS · same-host redirects · robots/noindex/private paths · no cookies/auth · 2 MiB decoded body cap · tenant isolation · no member/private crawl.

## Explicit non-goals (this task)

- Production ingest / index rows / crawl_run writes  
- `sources.publicSiteIndex` enablement  
- Production cron activation  
- New SQL migration  
- Live 213-page Production crawl  
- Merge / deploy / UnoNight changes  

## Next owner approval (separate)

Scoped persistent Production ingest for one consented verified customer after gates — not granted here.
