# AIPIFY PLATFORM — PR #233 VISUAL QA + SUPPORT SOURCE-OF-TRUTH CONTRACT V1 — RESULT

**Date:** 2026-10-15  
**Feature owner:** PLATFORM ADMIN  
**Worktree:** `aipify-platform-support-4-channels-ticket-i18n-ro-audit-and-customer-success-filter-ux-v1`  
**Branch tip (docs):** this RESULT appended after Step 1/2  
**Website Kompis Public Chain:** **46/46 frozen preserved** (no chain files touched)  
**Step B stash:** **preserved** (untouched)  
**UnoNight / Bedrift rights:** untouched  

---

## (A) PR #233 — QA / merge / deploy

| Gate | Status | Evidence |
|------|--------|----------|
| PR open | **PASS** | https://github.com/aipify-project/aipify-platform/pull/233 |
| Reported head matches actual | **PASS** | Head `afbc9cb4f366bd488f93e17adaf463d736185114` (= reported `afbc9cb4`) |
| Diff scope vs report | **PASS** | Only 3 files vs `origin/main`: `PlatformCustomerSuccessOverviewPanel.tsx` + 2 RESULT md files. No unrelated code. |
| Unit tests | **PASS** | `npx tsx lib/platform-portal/customer-success.test.ts` |
| Vercel Preview CI | **PASS** | Vercel – aipify / aipify-platform / aipify-platform-iz5z all **SUCCESS**; Preview Comments SUCCESS |
| Preview deploy READY | **PASS** | `dpl_7gJBhgTrLwjM3hC7o2TYuQzhF5Xb` @ sha `afbc9cb4` (aipify-platform) |
| Authenticated visual QA (desktop + mobile) | **BLOCKED** | Preview opens login only: `…/login?next=%2Fplatform%2Fcustomer-success`. No Platform Admin session available in this agent. Search/filters/chevrons/overflow **not** observed live. |
| Merge to main | **NOT RUN** | Held — visual QA required by owner brief |
| Production LIVE / deploy-ID | **NOT RUN** | No merge → no Production deploy claimed |
| Production READY verification | **NOT RUN** | — |

### Preview URL (Vercel protection bypassed; APP auth still required)

`https://aipify-platform-c54lhsdcp-unonight-platform-s-projects.vercel.app/platform/customer-success`  
Share link used for attempt (expires ~23h): generated via Vercel MCP `get_access_to_vercel_url`.

### Layout note (static code review — not a substitute for visual QA)

Customer Success layout already uses full width (`app/platform/customer-success/layout.tsx`: `w-full max-w-none`). Filter change narrows search (`lg:max-w-[14rem]`) and gives selects `min-w-[10rem] … pr-8` — consistent with registry-style filter presentation. **Not** verified in browser at runtime.

### (A) Verdict

**BLOCKED** — do **not** merge or call LIVE until an authenticated operator completes visual QA on `/platform/customer-success` (desktop + mobile) and confirms filters/chevrons/overflow.

---

## (B) Support Source-of-Truth — READ-ONLY contract / plan

**Mode:** Plan only. **No** new support endpoints, migrations, writes, or support PRs in this job.

### (B) Verdict

**PASS** (contract/plan delivered). Live Core metadata query: **NOT RUN**.

### Declared SoT

| Purpose | Authoritative store | Today Platform-readable? |
|---------|---------------------|--------------------------|
| Customer-submitted tickets (APP / Control Center) | `app_portal_support_requests` + `app_portal_support_request_audit_logs` | **No** — APP RPCs only (`company_id` scoped) |
| Legacy Platform queue UI | `list_platform_support_queue` → pre-ASO `support_cases` shape | Yes for admins — **wrong SoT / schema drift** |
| Platform “resolved” KPIs | `usage_statistics.support_requests_handled` sum | Yes — **lifetime aggregate**, not tickets, not since-login |
| ASO triage pipeline | `support_cases` (`tenant_id`) | Aggregates via `get_platform_support_operations_overview` |
| Org Support AI pipeline | `organization_support_cases` | Org-scoped; not Platform 4-channel SoT |
| Public aipify.ai contact | Marketing `/contact` mailto/cards | **No ticket write** |
| Selgere / Partners | Growth Partner link to `/app/support`; no partner ticket table found | **No Platform ticket write** |

**Owner goal alignment:** One Platform support command center with channel markers for (1) public site, (2) Kompis Web, (3) Kompis Bedrift/APP, (4) Selgere — **first** a server-only aggregated/list read API over APP SoT (+ future adapters), **then** UI in a separate job.

### Exact APP SoT contract (existing)

**Migrations:** `20261540000000_app_portal_support_request_center_phase271.sql`, `20261862700000_phase620_app_support_history.sql`, `20261863300000_phase620_app_customer_route_access_repair.sql`

**Columns present:** `company_id`, `title`, `description`, `category`, `priority`, `status`, `created_by`, `assigned_support_owner_id`, `related_module`, `attachments`, `internal_notes`, timestamps, **`channel`** (`app_portal` \| `email` \| `chat` \| `phone` \| `assistant`), **`resolved_at`**

**Columns ABSENT (do not invent):** `source_locale`, `language`, `locale`, product marker (`website_kompis` vs `kompis_bedrift`), public-site vs partner channel enums beyond existing `channel` values

**RPCs (APP only):** `list_app_portal_support_requests`, `get_app_portal_support_request`, `create_app_portal_support_request`, `update_app_portal_support_request`, `get_app_portal_support_history`, `reopen_app_portal_support_request` — all gated by `_apsf260_require_app_access()` / company isolation. **Platform admins do not bypass.**

**APIs:** `/api/aipify/support-requests`, `/api/aipify/support-history` (+ reopen)

**Platform cross-tenant list/get of APP tickets:** **NOT FOUND**

### Misleading legacy (must not mix into new counts)

| Surface | What it actually is | Correct treatment when new view ships |
|---------|---------------------|----------------------------------------|
| Since-last-login “N support requests resolved” | Lifetime `SUM(usage_statistics.support_requests_handled)` for platform scopes | Relabel as cumulative AI-handled usage **or remove** from Support command center |
| Empty “Ingen supportsaker ennå” | Empty `list_platform_support_queue` | Replace with empty state of **APP SoT** (and other adapters separately) |
| Dashboard `support_resolved` / “Resolved by Aipify” | Same usage_statistics family | Do not present as ticket volume |

**Invariant:** Never sum APP tickets + ASO cases + usage_statistics into one “open tickets” number.

### Four-channel adapter plan (future Core — owner job)

| Channel | Intake today | Adapter plan |
|---------|--------------|--------------|
| 1. Public aipify.ai | Mailto / static contact | New intake → create ticket with channel value TBD (`email` or new enum) + consent/retention — **separate job** |
| 2. Kompis Web | Public ask/FAQ (frozen chain); not tickets | Optional “request human” → ticket with Web product marker — **never** imply Bedrift; preserve WK freeze |
| 3. Kompis Bedrift / APP | `app_portal_support_requests` (`channel=app_portal` default) | **Primary SoT read** for Platform |
| 4. Selgere | No ticket path | Partner escalation RPC → ticket with partner attribution only (partners never own customers) |

**Product separation:** Resolve `company_id` → entitlements; surface Web vs Bedrift from **verified Core entitlements**, never from membership alone. UnoNight remains Web-only — no `kompis_bedrift` grant from this workstream.

### Recommended Phase 1 Core RPC (not built now)

1. `list_platform_app_portal_support_requests(...)` — `security definer`, `is_platform_admin()` or `_ppsf258_require_platform_access()`; filters: status, channel, company_id, date range; return **metadata** suitable for operators (prefer truncating bodies in list; full body on get with audit).
2. `get_platform_app_portal_support_request(p_id)` — same gate; include audit timeline; **do not** leak other tenants.
3. Optional Phase 1b: aggregate counts RPC only (precedent: `get_platform_support_operations_overview` privacy note).
4. **Writes / replies / migration of legacy KPIs / UI inbox:** later jobs after owner approval.

**Role note:** Prefer both `super_admin` and `platform_support` for **read**; reserve high-risk writes for `super_admin` + confirmation (existing platform high-risk patterns).

### International case handling (plan only — no AI calls now)

| Requirement | Current | Future contract |
|-------------|---------|-----------------|
| Store original language | **ABSENT** on APP tickets | Add `source_locale` (and keep original `title`/`description` immutable for customer text) |
| Operator UI locale | Central `locales/{en,no,sv,da,pl,uk,es}` | UI chrome only |
| Machine translation suggestion | Not wired for tickets | Dual-view: Original + “Maskinoversatt forslag” labeled; human approve before any customer-visible reply |
| Auto-translate / auto-send / paid providers | Forbidden in this job | Remain forbidden until named owner job |

### Risks

| Risk | Mitigation |
|------|------------|
| Building UI on legacy queue | Ban `list_platform_support_queue` as APP SoT |
| Cross-tenant body leak | List metadata-first; RLS still revoke-all; only security definer + platform gate |
| Mixing Web + Bedrift | Entitlement-derived product badge; fail-closed |
| KPI confusion | Separate widgets per source; never one summed “cases” |
| Channel enum too narrow for public/partner | Additive migration for new channel values — do not overload silently |
| Locale missing | Block dual-view shipping until `source_locale` (or equivalent) exists |

### Test matrix (for the **next** Core job — not run here)

| Test | Expect |
|------|--------|
| Non-admin cannot call Platform list RPC | 403 / exception |
| Platform admin lists only requested filters; never other-tenant rows without filter intent (all tenants OK for platform, but IDs must match DB) | PASS |
| APP user still only sees own `company_id` via APP RPCs | PASS |
| Empty APP SoT ≠ empty usage_statistics | Distinct empty copy |
| Web-only company never shows Bedrift product badge | PASS |
| No plaintext secrets / no email send in read RPC | PASS |
| Frozen WK chain file hashes unchanged | 46/46 |

### Authorization needs for next job

- Explicit owner approval for **new Core migration** adding Platform read RPCs (+ optional `source_locale` / channel enum extension).
- Separate approval for any write/reply/email path.
- No Production data writes during contract implementation dry-runs.

---

## NESTE ENKELTJOBB (forslag — ikke startet)

**`AIPIFY_PLATFORM_SUPPORT_APP_SOT_PLATFORM_READ_RPC_V1`**

One Core migration + thin Platform API: `list`/`get` of `app_portal_support_requests` for `is_platform_admin()`, metadata-safe, with tests proving APP tenant isolation unchanged and legacy queue **not** used. No inbox UI, no translation runtime, no public/partner intake yet.

**Do not start until owner sends that job.** PR #233 remains open until visual QA unblocks merge.
