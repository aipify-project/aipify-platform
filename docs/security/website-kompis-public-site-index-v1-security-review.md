# Website Kompis Public Site Index V1 — Security Review (PR #96 repair)

Task: `AIPIFY.PR96.PUBLIC.SITE.INDEX.SECURITY.AND.FUNCTIONAL.PROOF.V1`  
Migration: `supabase/migrations/20261937600000_website_kompis_public_site_index_v1.sql`  
Status: **NOT APPLIED** — owner approval required before SQL apply / Production ingest / enablement.

## Ledger

Production `schema_migrations` at review time includes through `20261937500000` only. `20261937600000` does not collide with applied versions.

## RLS / grants

| Object | RLS | FORCE | anon/auth table grants | Notes |
|---|---|---|---|---|
| `tenant_public_site_index_documents` | ENABLE | FORCE | REVOKED | No policies → deny direct access |
| `tenant_public_site_index_chunks` | ENABLE | FORCE | REVOKED | Same |
| `tenant_public_site_index_crawl_runs` | ENABLE | FORCE | REVOKED | Same |

- Visitor read: only `search_tenant_public_site_index` (SECURITY DEFINER), gated by `_wpkf_resolve_visitor_context` + `_wpsi_assert_tenant_host_install` (verified domain + install + `website_kompis` module).
- Writes: `replace_*` / `mark_*_stale` require `auth.role() = service_role` and trust assert.
- Isolated Docker Postgres matrix: `lib/marketing/website-kompis-public-site-index/rls-matrix.test.ts`.

## Threat mitigations (repair)

| Threat | Mitigation |
|---|---|
| Missing RLS | ENABLE + FORCE on all three tables |
| SSRF / DNS rebinding | DNS/public-IP assert before every hop + after headers; HTTPS-only; same-host redirects |
| Robots ignore on fetch fail | Fail closed — ingest aborts if robots.txt unavailable/ambiguous |
| noindex pages | Meta robots + `X-Robots-Tag` rejected |
| Client-trusted tenant/host | Platform operator route resolves Core status RPC; dryRun default true |
| Raw chunk as answer | Question-token overlap + sentence selection; null on low overlap |
| Private paths | Locale-aware denylist includes marketplace/chat/discover/messages/… |

## Explicit non-goals / stops

- No Production SQL apply
- No Production index data write
- No `publicSiteIndex` Production enablement
- No UnoNight source/PR/deploy changes
- No merge/deploy in this task
