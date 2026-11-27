# Support Core all-channels V3 — result

**Job:** `AIPIFY_SUPPORT_CORE_ALL_CHANNELS_COMPLETE_V3_20261127`  
**Repo:** aipify-project/aipify-platform  
**Worktree:** `/Users/veltrix/Development/aipify-support-core-all-channels-complete-v3-20261127`  
**Branch:** `feat/support-core-all-channels-complete-v3-20261127`  
**Base:** `origin/main` @ `047449242` (#425)

## Channel matrix

| Channel | Status | Why |
|---------|--------|-----|
| APP create / list / reply | **CODE_LIVE** (Production Core) | Existing `create_app_portal_support_request` + APP APIs; no regression intended |
| Platform Admin Support | **CODE_LIVE** when URL-bound | Read/write RPCs present Staging+Production; channel filter added in UI |
| CSP Kontakt create | **CORE_PENDING** | Real RPCs in V3 SQL candidate; code wired; gates `false` |
| CSP ticket list | **CORE_PENDING** | `list_partner_support_requests` in V3; API route fail-closed |
| Public `/contact/support` | **CORE_PENDING** | Web create RPC service_role-only; bot protection; gates `false` |
| Email SEND | **OFF** | Separate owner gate |

## SQL ledger

| File | SHA-256 | Staging | Production |
|------|---------|---------|------------|
| A read RPCs | `63ed974a…` | APPLIED | APPLIED |
| B Support batch | `96991c0c…` | APPLIED | APPLIED |
| **V3 intake (this job)** | `24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46` | **NOT_APPLIED** | **NOT_APPLIED** |
| Placeholder e987d820… | n/a | not DDL | not DDL |

## CODE delivered

- Executable intake SQL V3 (web + partner + list/get/reply + channel/columns + anon revoke)
- `submitSupportIntake` live RPC path behind gates
- CSP route resolves `partner_id` via `resolveCspPartnerScope` (never client IDs)
- Web route uses service_role only when gates open; otherwise honest 503
- Partner list API `/api/certified-sales-partner/support-requests`
- Platform Support channel filter (web/partner labels)
- APP create: honest attachments note
- Tests pin V3 SHA + no anon grant on web create

## Next exact owner action

See `docs/platform/SUPPORT_CORE_ALL_CHANNELS_COMPLETE_V3_OWNER_GATE.md` — Staging APPLY YES for V3 only.
