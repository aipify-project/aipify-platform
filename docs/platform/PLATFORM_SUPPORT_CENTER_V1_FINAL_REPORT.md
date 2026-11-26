# Platform Support Center V1 — Final report

## Identity

| Field | Value |
|-------|-------|
| REPO | `aipify-project/aipify-platform` |
| WORKTREE | `/Users/veltrix/Development/aipify-platform-support-center-v1-20261126b` |
| BRANCH | `feat/platform-support-center-v1-20261126b` |
| BASE_SHA | `53a23a230486d740b198478ba55122e39f312f2b` (`origin/main`) |
| HEAD_SHA | `e19fa2ba2d5abcbd1702b65d18f09f3bd5256b9c` |
| PR | https://github.com/aipify-project/aipify-platform/pull/400 |
| MERGE_SHA | — |
| DEPLOY_SHA | — |
| READY | Phase A code in PR; Core/email not live |

**Path note:** Suggested path `…-20261126` already existed (clean, unused). Used unique suffix `b`.

## CANONICAL_TICKET_SOURCE_AND_EXISTING_SYSTEM_REUSE

- **Canonical SoT:** `public.app_portal_support_requests` (+ `app_portal_support_request_audit_logs`)
- **Platform read:** existing NOT_APPLIED RPCs + fail-closed adapter/API (`/api/platform-portal/support-requests*`)
- **UI:** new Support Center at `/platform/support` (deeplink preserved)
- **Separated:** CSP sales email CRM, seller messages, VoC feedback, ASO/`support_cases`, self-support engines

## WHY_47_SUPPORT_RESOLVED_APPEARED

Seeded `usage_statistics.support_requests_handled = 47` (phase7 pilot) surfaced via since-last-login / dashboard snapshot — **not** real tickets. Removed from Support Center surface.

## PLATFORM_SUPPORT_ROUTES_AND_TABS

- Route: `/platform/support` (unchanged path)
- Internal tabs via `?tab=`: `all` \| `mine` \| `templates` \| `signature` \| `channels`
- Ticket detail: `?ticket=<uuid>`
- Kunder hub consolidation deferred to avoid Drift/Kunder collision

## REAL_TICKET_STORAGE_STATUS_AND_SQL_CANDIDATE_HASH_IF_ANY

- Ticket rows: APP SoT table (production schema) — Platform read **not applied**
- New candidate (messages/signature/templates/audit):  
  `docs/platform/sql-candidates/platform_support_center_messages_signature_templates_v1.sql`  
  **SHA-256:** `247f4635e4f97a2b5a1f0080d7a795a66403aa9ef20db256a3f331a74f4bf192`  
  **Status:** PREPARED_ONLY — not applied

## SOURCE_CHANNEL_STATUS

| Channel | Status |
|---------|--------|
| web (aipify.ai) | not_activated |
| app / Kompis Bedrift | prepared_only (SoT exists; Platform RPC not applied) |
| partner | not_activated (CRM separate) |
| module | not_activated |
| Kompis handoff | not_activated |

## SIGNATURE_EDITOR_COMPANY_LOGO_PREVIEW_AND_EMAIL_GATES

- Editor + light/dark/text preview
- Logo: `https://aipify.ai/website-kompis/design-v1/brand/aipify-logo-light.png`
- Company: Aipify Group AS from `COMPANY_CONFIG`
- Persist gate: **off** (needs SQL apply)
- Email send: **off** / button disabled

## REPLY_TEMPLATE_EDITOR_STARTER_TEMPLATES_LOCALE_STATUS

- 10 Norwegian starter templates (code-backed)
- Safe `{{customer_name|ticket_number|product_name|agent_name}}` escaping
- Persist gate: **off**
- Locales: NO complete for admin; EN UI strings complete; sv/da/pl/uk/es marked EN fallback

## TENANT_ROLE_RLS_SECURITY_EVIDENCE

- Read roles remain `super_admin` \| `platform_support` via `_ppsf258_require_platform_access` (after apply)
- Candidate tables: RLS on + revoke from public/anon/authenticated
- No service-role ticket reads in adapter
- CSP CRM tables not referenced by executable SQL

## TESTS_GREEN / RELEVANT_FAILURES / UNRELATED_FAILURES

- GREEN: `support-center.test.ts`, `support-tickets-read-adapter.test.ts`, support assertions in cross-tenant contract test
- RELEVANT_FAILURES: none
- UNRELATED_FAILURES: Website Kompis frozen manifest 42/46 on `origin/main` (pre-existing; not touched)

## OWNER_APPROVALS_REQUIRED

1. Apply NOT_APPLIED cross-tenant read RPCs (Staging → Production)
2. Apply Support Center SQL candidate (messages/signature/templates)
3. Flip `RPC_CONNECTED` + `FEATURE_GATE`
4. Resend/DNS/secrets for outbound support email
5. Channel intake activations (web/partner/Kompis)

## OWNER_AUTH_VISUAL_QA_REQUIRED

Yes — Platform Admin NO locale, tabs, signature preview, template insert, blocked send state, empty/blocked queue.

## FINAL_STATUS

**PARTIAL_BLOCKED_BY_CORE_APPROVAL**
