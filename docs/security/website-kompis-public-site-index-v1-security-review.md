# Website Kompis Public Site Index V1 — Security Review (proposed)

Task: `AIPIFY.CORE.WEBSITE.KOMPIS.REAL.KNOWLEDGE.AND.MEMBER.RUNTIME.AIPIFY.ONLY.V2`  
Migration: `supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql`  
Status: **NOT APPLIED** — requires separate owner approval before SQL apply / data ingest / Production enablement.

## Threat model

| Threat | Mitigation |
|---|---|
| SSRF / DNS rebinding | `assertPublicHostnameAllowed` + exact verified host match; private/reserved IP block |
| Cross-host redirect | Manual redirects; same-host only |
| Private/member path indexing | Locale-aware private prefix denylist + robots disallow |
| Visitor-supplied crawl URL | Ingest only from verified host + seed/sitemap discovery; ask path never fetches |
| Cross-tenant leak | Visitor search via `_wpkf_resolve_visitor_context`; rows scoped by `tenant_id` |
| Prompt injection from page HTML | Indexed text treated as untrusted evidence; neutralization strip; extractive answers only |
| Anon write | `replace_*` / `mark_*_stale` require `auth.role() = service_role` |
| Oversize fetch | 8s timeout, 256KB body cap, max 80 pages |
| Auth cookies / secrets | `credentials: omit`; no cookie forwarding; token/email redaction in extract |

## Fail-closed

- Missing/invalid install or unverified domain → empty search
- Stale documents (`stale_after` / status) excluded
- `sources.publicSiteIndex` defaults **false**; admin UI still forces off until separately enabled after ingest proof
- Empty/low-score hits → ask falls through to FAQ / safe fallback

## Rollback

1. Keep `sources.publicSiteIndex = false` (default).
2. Drop functions/tables from migration 202619376 if needed (service-role only; no customer data dependency for other modules).
3. Loader/UI resize is independent of schema and can remain.

## Explicit non-goals of this PR

- No Production SQL apply
- No Production index data write
- No UnoNight source/PR/deploy changes
- No enablement of `publicSiteIndex` in live install config without approved ingest
