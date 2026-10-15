# AIPIFY PLATFORM — SUPPORT 4 CHANNELS / EXISTING TICKET SYSTEM — READ-ONLY AUDIT V1 — RESULT

**Feature owner:** PLATFORM ADMIN  
**Worktree base:** `origin/main` @ `d161610b`  
**Mode:** Read-only code/migration inventory (no Core writes, no ticket mutations, no email sends)  
**Live Production Core SQL:** **NOT RUN** (no authorized RO session used in this job)  
**Website Kompis Public Chain:** untouched (46/46)  
**UnoNight / Bedrift rights:** untouched  
**Step B stash:** untouched

## Verdict

**PARTIAL — inventory complete; no unified Platform ticket inbox exists.**

Aipify already has **multiple parallel support models**. Platform `/platform/support` is a **legacy queue + aggregate KPI surface**, not a working four-channel ticket center. Customer-submitted tickets of record live in **APP** (`app_portal_support_requests`). Do **not** build a new ticket database until an owner chooses an integration contract over the models below.

---

## 1. Evidence inventory (what exists)

| Layer | Surface | Code / RPC | Storage | Status |
|-------|---------|------------|---------|--------|
| Platform | `/platform/support` | `PlatformSupportPanel.tsx` → `list_platform_support_queue`, `get_platform_dashboard_snapshot`, `get_support_ai_performance` | Legacy-shaped `support_cases` + `usage_statistics` | **PARTIAL / BLOCKED** (schema drift) |
| Platform | Since-last-login strip on support | `GET /api/platform/since-last-login?scope=support` → `get_since_last_login_engine` | Platform: `SUM(usage_statistics.support_requests_handled)` | **PARTIAL** (label ≠ time window) |
| Platform | Trust → Support ops | `get_platform_support_operations_overview` | ASO aggregates only | **PASS** (aggregates) |
| Platform | Customer Success open support count | `get_platform_portal_customer_success_overview` | `support_cases.tenant_id` | **PASS** (read counts) |
| APP | `/app/support/requests` | `/api/aipify/support-requests` | `app_portal_support_requests` (+ audit logs) | **PASS** (coherent ticket stack) |
| APP | `/app/support/history` | `/api/aipify/support-history` | Same | **PASS** |
| APP | Support ops / triage | `/api/support/triage`, `/api/support-operations/*` | ASO `support_cases` (`tenant_id`) | **PASS** (tenant) |
| APP | Support AI pipeline | `/api/support/cases/*` | `organization_support_cases` (+ messages / understanding / knowledge / proposals) | **PASS** (parallel pipeline) |
| APP | Self-support Q&A | `/api/self-support/ask` | `self_support_*` | **PASS** (Q&A ≠ ticket by default) |
| APP | BDE email drafts | `/api/support/email/*` | `business_email_drafts` | **PASS** (tenant) |
| Partner / Selgere | Growth Partner support section | Link to `/app/support` only | None | **PARTIAL** (no partner queue) |
| Public aipify.ai | `/contact` | `mailto:` / path cards — **no form POST** | None | **PARTIAL** (no ticket create) |
| Web (Kompis) | Public ask / FAQ | Frozen Website Kompis public chain | Site FAQ / index | **PASS** (not Platform tickets) |

### Critical schema drift

- `list_platform_support_queue` (migration `20260610230000_platform_admin_operations.sql`) still selects **`support_cases.customer_id`**, `opened_at`, `ai_escalation_reason`.
- ASO Phase 40 (`20260612800000_autonomous_support_phase40.sql`) remodelled cases around **`tenant_id`** and different statuses.
- Customer Success overview correctly counts via **`tenant_id`**.
- **APP tickets never feed** `list_platform_support_queue`.

---

## 2. Platform `/platform/support` — “47” and empty state

| UI string | Source | Meaning |
|-----------|--------|---------|
| “N support requests resolved” (since-last-login) | `get_since_last_login_engine` builds English `summary_text` from **`SUM(usage_statistics.support_requests_handled)`** for platform scopes — **not** filtered by `previous_login_at` | Cumulative AI-handled counter aggregate, **not** cases resolved since last login, **not** APP tickets |
| Counter cards “Resolved by Aipify” | `get_platform_dashboard_snapshot.support_resolved` | Same `usage_statistics` family |
| “Ingen supportsaker ennå.” / `platform.support.empty` | `cases.length === 0` after `list_platform_support_queue` | **No rows** from legacy queue RPC (empty, error, or schema mismatch). **Not** “no APP tickets”. |
| Support AI performance | `get_support_ai_performance` | Mixed stats; **`satisfaction_score` hardcoded 94** in migration evidence |

**Do not replace these with invented numbers.** Fix requires a separate Core/UI contract job.

---

## 3. Four-channel matrix (current vs needed)

| Channel | Today’s entry | Creates Platform-visible ticket? | Isolation | Gap |
|---------|---------------|----------------------------------|-----------|-----|
| **1. Public aipify.ai** | Marketing `/contact` (mailto / cards) | **No** | Public | No intake → Core ticket |
| **2. Kompis Web (site owners / visitors)** | Website Kompis ask/FAQ (frozen); APP support if tenant has APP | Ask = **not** ticket; APP tickets company-scoped | Install / company | No Platform Web-channel inbox; do not mix customer FAQ with Aipify internal case material |
| **3. Kompis Bedrift APP users** | `/app/support/requests` → `app_portal_support_requests` | **Yes (APP only)** | `company_id` + RBAC | Invisible to Platform queue; no Bedrift-specific routing metadata required beyond product entitlement checks (fail-closed) |
| **4. Selgere / Partners** | Growth Partner UI links to `/app/support` | **No dedicated partner ticket** | Partner APP context | No partner escalation RPC / queue |

**AI chat / FAQ vs ticket**

| Kind | Storage | Ticket? |
|------|---------|---------|
| Website Kompis public ask | Frozen public chain | No |
| Self-support conversation | `self_support_*` | Optional human escalation path — **not** APP request table |
| Support Assistant KC search | Knowledge search API | No (can pre-fill APP form) |
| APP Support Request | `app_portal_support_requests` | **Yes** |
| ASO / org Support AI case | `support_cases` / `organization_support_cases` | Operator/AI case rows — parallel models |

---

## 4. Privacy / isolation notes

| Field / concern | APP tickets (`app_portal_support_requests`) | Platform queue | ASO / org cases |
|-----------------|---------------------------------------------|----------------|-----------------|
| Tenant key | `company_id` | Intended customer join (legacy `customer_id`) | `tenant_id` / organization |
| Customer-visible body | title, description (RPC truncates description to 500 in list row) | subject-oriented Phase 7 queue | Case bodies in ASO |
| Internal notes | `internal_notes` (truncated in row helper) | — | Operator notes / audit |
| Attachments | `attachments` jsonb | — | Pipeline-specific |
| Locale / original language | **No column** on Phase 271 table | N/A | Not a unified support-locale contract |
| Cross-tenant | RLS revoke + security definer company checks | `is_platform_admin()` | Tenant helpers |
| Platform operator view of APP tickets | **NOT FOUND** | Legacy queue only | Aggregates only on Trust |

---

## 5. i18n / translation plan (proposal only — not built)

**UI locales already active:** `en`, `no`, `sv`, `da`, `pl`, `uk`, `es` via `locales/*/platform.json` and APP dictionaries.

**Ticket content language today:** Phase 271 **does not store** `source_locale` / original language on `app_portal_support_requests`. Platform Support AI performance and since-last-login summary strings include **hardcoded English** from SQL.

**Recommended future dual-view (owner approval required before any AI/provider work):**

1. Persist `source_locale` (and optional `ui_locale`) at ticket create time from requester preference.
2. Operator UI: **Original** always visible; **Translation** pane clearly labelled “AI-assisted translation — verify before send”.
3. Human gate required before any customer-visible reply that used machine translation.
4. Reuse Translate / Multilingual Workforce Engine (Phase 238) **scaffolds** only after an explicit product decision — **no auto-send**, no paid provider calls in audit follow-ups without approval.
5. Separate customer private Kompis knowledge from Aipify internal support articles when linking FAQ/manuals to tickets.

---

## 6. Proposed future Platform Support Center UI (design only)

**Do not implement in this job.** Suggested shape for owner approval:

- Single Platform inbox with **tabs/filters**: Public · Kompis Web · Kompis Bedrift · Selgere/Partner
- Secondary filters: status, priority, assignee, language, translation state, customer/product, SLA, attachments
- Detail: dual-view original + translation; internal notes vs customer reply; linked knowledge (Aipify-owned only by default)
- Intake adapters (separate jobs): public contact form → Core; APP request sync; partner escalation RPC; Web ask “request human” → ticket (never silent)

**Reuse preference:** Prefer integrating **`app_portal_support_requests`** (+ channel metadata) over inventing a fifth ticket table. Repair or replace **`list_platform_support_queue`** rather than painting over aggregates.

---

## 7. Smallest safe next jobs (prioritized)

| Priority | Job | Why |
|----------|-----|-----|
| **P0** | Owner decision: which table is Platform SoT for human tickets | Avoid another parallel model |
| **P1** | Core contract: Platform read of `app_portal_support_requests` (or unified view) with channel + product + locale fields | Unblocks real inbox without guessing |
| **P1** | Repair or retire `list_platform_support_queue` / misleading “resolved” KPIs | Stops false operational confidence |
| **P2** | Public contact → ticket intake (explicit consent, retention) | Channel 1 |
| **P2** | Partner escalation RPC (attribution only — partners never own customers) | Channel 4 |
| **P3** | Dual-view translation UX + human gate (no auto-send) | i18n for operators |
| **Later** | Four-channel Platform UI | Only after P0–P1 |

---

## 8. Explicit non-deliverables (this job)

- No 4-channel inbox implementation  
- No AI translation runtime / outbound replies  
- No ticket migration / webhooks / SQL  
- No Production data writes  

**Related code deliverable in same workstream:** Customer Success filter-row presentation fix — see `AIPIFY_PLATFORM_CUSTOMER_SUCCESS_FILTER_UX_V1_RESULT.md`.
