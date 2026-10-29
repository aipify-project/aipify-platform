# FROZEN — Verified apex↔www FAQ visitor domain eligibility

**Status:** FROZEN  
**Task:** `AIPIFY_KOMPIS_CORE_VERIFIED_APEX_WWW_FAQ_ELIGIBILITY_REPAIR_V1`  
**Migration:** `supabase/migrations/20261939600000_website_kompis_verified_apex_www_faq_eligibility_v1.sql`

## Contract

Visitor FAQ search (`search_tenant_public_visitor_knowledge`) may treat a FAQ row domain as eligible when:

1. FAQ `domain` is NULL, or visitor `resolved_domain` is NULL (legacy), or  
2. FAQ `domain` exactly equals visitor `resolved_domain`, or  
3. FAQ `domain` and visitor `resolved_domain` are an **exact one-label www ↔ apex pair**, **and** both hostnames are `verified` + `active` `customer_domains` with `installation_id` equal to the visitor’s **resolved installation** for that tenant.

This is **not** a general `www` strip. Unrelated subdomains, unverified/inactive aliases, and cross-tenant or cross-install hosts must never match.

## Helpers

- `_wpkf_is_exact_apex_www_pair(text, text)`
- `_wpkf_faq_domain_eligible_for_resolved_visitor(text, text, uuid, uuid)`

## Out of scope (unchanged)

- `_wpkf_resolve_visitor_context` semantics  
- Ranking / scoring / locale / `public_safe` / surface / install isolation  
- Frozen Public Chain TypeScript (`public-companion-ask.ts`, `public-companion-tenant-faq.ts`)  
- APP FAQ visibility diagnostic probe host (documented follow-up)

## Change control

Any future change to this predicate, verification checks, or related install isolation **requires explicit owner approval** and updated contract tests.

## Machine gate

```bash
npx --yes tsx lib/website-kompis-verified-apex-www-faq-eligibility/verified-apex-www-faq-eligibility.contract.test.ts
```

Static assertions always run. Docker Postgres matrix runs when Docker is available; when Docker is missing the suite must report `Docker NOT RUN` and must not claim local SQL PASS.
