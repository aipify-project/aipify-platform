# AIPIFY.KOMPIS.CORE.SUPPORT.APP.FALLBACK.07 — RESULT

Status: **PARTIAL / LIVE**

## Verdict

APP reserve field `supportContactUrl` is shipped end-to-end in Core: jsonb allowlist (SQL + TS), APP Domains panel save/clear, HTTPS same-host validation, resolver priority **configured → discovered → none**, launcher metadata wiring. Frozen UI sizes unchanged (`OPEN_WIDTH = 450`, closed `72×72`).

PARTIAL because Preview could not prove two isolated tenants with a configured reserve without mutating a real customer install config (only one active install-config row; discovery returned `publicContactUrl: null` on that DOMENE — reserve path covered by unit + SQL roundtrip).

## Source of truth

| Layer | Path |
| --- | --- |
| Persistence | `tenant_public_companion_install_config.config` jsonb |
| SQL allowlist | `_wpkf_sanitize_install_config_patch` / `_wpkf_normalize_install_config_json` |
| Migration | `supabase/migrations/20261938000000_website_kompis_support_contact_url_v1.sql` (applied on Aipify Core) |
| TS contract | `lib/marketing/website-kompis-install-config.ts` |
| APP API | `app/api/app/domains/website-kompis/route.ts` |
| APP UI | `components/app/domain-license/WebsiteKompisDomainSettingsCard.tsx` |
| Validation | `validateWebsiteKompisConfiguredSupportContactUrl` in `website-kompis-public-contact.ts` |
| Resolver | `resolveWebsiteKompisPublicContactUrl` / `discoverWebsiteKompisPublicContactUrl` in `website-kompis-public-contact-server.ts` |
| Public metadata | `app/api/embed/companion/launcher-icon/route.ts` → `publicContactUrl` |
| i18n | `locales/{en,no,sv,da,pl,uk}/customer-app/settings.json` (`domainLicense.websiteKompis.*`) |

## Resolver priority (deterministic)

1. Valid APP-configured `supportContactUrl` (owner authoritative; HTTPS + verified host + public path)
2. Else strong auto-discovered FAQ / site-index contact URL
3. Else no CTA (`publicContactUrl: null`) + APP panel shows missing status

## Role / tenant / URL / audit

- Save gated by existing `canManageWebsiteKompisDomainSettings` + licensed availability (owner/admin only).
- Tenant scope via existing APP portal context + install binding (no cross-tenant read/write).
- Invalid scheme / credentials / external host / private paths rejected with `invalid_support_contact_url` (400).
- Empty/null clears override; discovery remains normal path.
- Audit: existing install-config update RPC path (no parallel table).

## Evidence

| Check | Result |
| --- | --- |
| Unit: validation (https/host/credentials/private) | PASS |
| Unit: install-config parse/clear | PASS |
| Unit: domain-settings `contactSource` configured/discovered/none | PASS |
| Unit: embed freeze 450 / 474×824 / 72 | PASS |
| Core SQL sanitize/normalize roundtrip | PASS (`supportContactUrl` preserved; unknown keys dropped) |
| Preview head `60338cf8` / `dpl_4T6R8omML7sgFHcbNzToCv5je14t` READY | PASS |
| Preview loader `OPEN_WIDTH = 450`, closed 72 | PASS |
| Preview launcher metadata includes `publicContactUrl` field | PASS (`null` — discovery miss; reserve not set on live customer) |
| Two-tenant Preview with configured reserve | BLOCKED (no isolated testtenant; did not mutate real customer config) |
| SQL `202619379` answer-feedback | NOT APPLIED |
| Votes gated / reuse OFF / FAQ data / answer engine | Untouched |

## PR / merge / Production

| Item | Value |
| --- | --- |
| PR | https://github.com/aipify-project/aipify-platform/pull/116 |
| Feature head | `60338cf8` |
| Merge commit (main) | `fbb968a7` |
| Preview deployment | `dpl_4T6R8omML7sgFHcbNzToCv5je14t` READY |
| Production deployment | `dpl_6ShjQvnxTppXJLqn831VXHWB4r1b` READY |
| Production source SHA | `fbb968a7acd9a1072426722abf36fa0171894dba` |
| Production aliases | `app.aipify.ai`, `aipify-platform.vercel.app` |
| LIVE loader | `OPEN_WIDTH = 450`, closed `72` confirmed on production deployment URL |

## Frozen UI contract

- Desktop panel **450×800** — unchanged
- Outer iframe with 12 px outset ≈ **474×824** — unchanged
- Closed widget **72×72** — unchanged

## Explicit non-goals (confirmed)

- No Host / UnoNight changes
- No FAQ data / ask / retrieval / provider changes
- No thumbs / `202619379` apply
- No real-customer config mutation for QA

## Next job (separate)

Thumbs / answer-feedback migration with explicit SQL approval — not started here.

END OF RESULT.
