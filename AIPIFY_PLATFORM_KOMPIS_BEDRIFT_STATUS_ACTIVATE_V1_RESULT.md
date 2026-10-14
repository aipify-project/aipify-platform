# AIPIFY — Platform Kompis Bedrift Status / Activate V1

**Date:** 2026-10-14  
**Repo:** `aipify-project/aipify-platform`  
**Branch:** `feat/platform-kompis-bedrift-status-activate-api-ui-v1`  
**Verdict:** see delivery footer after merge/deploy

## Scope delivered

- Core-backed Platform READ of `kompis_bedrift` via `get_platform_portal_customer_kompis_bedrift_status`
- Secure Platform admin API route under `/api/platform-portal/customers/[id]/kompis-bedrift`
- Customer detail panel wired with `PlatformPortalKompisBedriftStatusPanel`
- Production ACTIVATE remains fail-closed: empty `KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST`; UI activate control permanently disabled; POST returns `owner_activation_authorization_required` without calling Core write RPC
- Locales: `en`, `no`, `sv`, `da`, `pl`, `uk`, `es`

## Explicit non-goals (honored)

- No SQL apply / no new customers / no real license grants
- No paid AI calls
- No Website Kompis frozen-chain edits
- No UnoNight Bedrift conversion (Web-only reference preserved)
- Spanish Translation RESULT file kept out of this delivery

## Safety

| Gate | Result |
| --- | --- |
| Owner allowlist empty | PASS |
| Panel issues no POST | PASS |
| Frozen Website Kompis 46/46 hashes | PASS |
| Step B stash `step-b-wip-blocked-not-for-merge` preserved | PASS |

## Tests run

- `npx tsx lib/platform-portal/kompis-bedrift-activation.test.ts`
- `npx tsx lib/platform-portal/website-kompis-activation.test.ts`
- `npx tsx lib/platform-portal/status-provisioning-consistency.test.ts`
- `npx tsx lib/core/access-control-plane/access-control-plane-62.test.ts`
- `npm run test:platform-mfa-boundary`
- `npm run typecheck`
- `npm run build` (see footer)

## Files

See PR file list. Unrelated: `AIPIFY_SPANISH_TRANSLATION_COMPLETION_SHARED_LOCALES_V1_2026_10_14_RESULT.md` excluded.
