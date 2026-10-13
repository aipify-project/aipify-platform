# AIPIFY BEDRIFT MULTILINGUAL FAQ + KNOWLEDGE ARTICLES — 2026-10-13 RESULT

## Status: **PARTIAL**

Multilingual one-article / many-language-block persistence, empty-answer drafts, language tabs, and controlled per-locale publish **are blocked** on missing Core schema/RPCs. No SQL/migration shipped. No fake client-only storage. Safe desktop-first Ansattkunnskap workspace redesign shipped on existing EKE APIs.

## Baseline / release

| Field | Value |
|-------|-------|
| **origin/main before work** | `755e0804` (invoice receiver RESULT IDs #173) |
| **Branch** | `feature/bedrift-multilingual-faq-knowledge-2026-10-13` |
| **Feature HEAD / PR / merge / APP deploy** | _(filled after LIVE)_ |
| **Canonical domain** | `https://app.aipify.ai` |
| **Frozen Website Kompis protected files touched** | **0** |
| **New SQL / schema / RLS** | **NONE** |
| **Paid provider / AI Translator** | **NOT ACTIVATED** |

## Feature owner

**CUSTOMER APP** — Kompis Bedrift / Ansattkunnskap (`/app/kompis-bedrift/knowledge`, `/app/settings/employee-knowledge`).  
Not Website Kompis public FAQ. Not Platform Admin.

## Authoritative data sources (unchanged)

| Concern | Source |
|---------|--------|
| Center bundle | `GET /api/employee-knowledge` → `get_customer_employee_knowledge_center` |
| Create | `POST` `create_item` → `create_employee_knowledge_item` |
| Approve | `POST` `approve_item` → `approve_employee_knowledge_item` (`_bde_require_admin`) |
| Ask / search | `answer_employee_question` / `search_employee_knowledge` |
| Table | `employee_knowledge_items` (Phase 41) — `title`, `content` **NOT NULL**, `approved` boolean only |
| Locales (APP UI) | `customerApp.employeeKnowledge.*` in `locales/{en,no,sv,da,pl,uk}/customer-app/core.json` |
| Knowledge-content locale IDs | **Not stored on EKE items** |

## What shipped (safe PARTIAL)

1. **Desktop-first Ansattkunnskap workspace** on `/app/settings/employee-knowledge` inside `AppHubShell` — section cards: Create FAQ, Knowledge articles, Awaiting approval, Knowledge gaps, Test/Search, Settings.
2. **Create FAQ** using existing create RPC: question + answer + category chips; **Save draft** / **Send for approval** both create `approved=false` pending items when admin approval is required (never invents publish).
3. **Honest empty-answer gate** — empty answer cannot save (matches Core `content NOT NULL`); shows localized blocked message (test case 1 requirement respected without fake persistence).
4. **Knowledge articles** list from live center data; status chips Approved (green) / Awaiting approval (orange); newest first; filters; empty state.
5. **Create surface shows max 4 recent** items + link to full articles section; older items remain in full list.
6. **Kompis Bedrift knowledge hub** shows four work-area cards + public FAQ separation + multilingual gap notice.
7. **Explicit multilingual gap banner** — no “+ Add language”, no language tabs, no localStorage simulation.
8. **pl/uk** gained missing `employeeKnowledge` baseline + workspace keys (parity with core locales).

## STOPPED — requires separate owner authorization (SQL/RPC)

Exact Core gaps (contract-tested against Phase 41 migration):

1. `employee_knowledge_items` has **no `locale` / language** column.
2. **No parent `article_id`** (or equivalent) linking multiple language versions of one logical FAQ.
3. **`content NOT NULL`** — incomplete language drafts with empty answer cannot persist.
4. **No `update_employee_knowledge_item`** RPC — cannot reopen and edit language blocks safely.
5. Status is **`approved` boolean only** — no Draft / In review / Published / Rejected machine per language version.
6. Ask/search are **not locale-filtered**.

**Not reused:** Website Kompis `tenant_public_companion_faq_items` (public chain / different product). Using it for Bedrift would mix surfaces and risk frozen-chain touch.

**Requested authorization (separate task):** additive migration + RPCs for logical FAQ article + per-locale versions (allow incomplete draft rows), update + submit-for-review + publish gates, locale-aware list/ask — without touching Website Kompis Public Chain.

## Filescope

- `app/app/settings/employee-knowledge/page.tsx`
- `app/app/kompis-bedrift/knowledge/page.tsx`
- `components/app/settings/EmployeeKnowledgeAdminPanel.tsx`
- `lib/employee-knowledge-engine/{labels,workspace-model,workspace-model.test,index}.ts`
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json`
- This RESULT

## QA matrix

| Case | Result |
|------|--------|
| 1 Empty answer → draft save | **PASS (honest block)** — cannot persist; UI explains Core gap (not published) |
| 2 NO answer + save → appears in articles | **PASS** (existing create RPC; status pending/approved per settings) |
| 3 + Add English language block / language tabs | **BLOCKED** — Core gap; UI withheld |
| 4 Edit EN without changing NO | **BLOCKED** — no update RPC / no locale relation |
| 5 Duplicate locale / wrong role / tenant / unconfirmed publish | **PARTIAL** — existing approve admin gate retained; duplicate-locale N/A until schema |
| 6 Review/publish complete language only | **PARTIAL** — approve boolean only; no per-locale publish |
| 7 Five articles → create shows 4; all in articles | **PASS** (unit: `recentKnowledgeItems`) |
| 8 Frozen WK protected diff | **0** |
| Locale parity new workspace keys (6) | **PASS** |
| `workspace-model.test.ts` | **PASS** |
| Frozen visual system test | **PASS** |
| Authenticated Safari / browser UI | **NOT RUN** |
| Production writes / seed FORMDEMO | **NOT RUN** (forbidden; none) |

## Flags

- **APP CREATES INVOICES** = N/A (out of scope)
- **MULTILINGUAL FAQ PERSISTENCE** = **NO** (blocked on Core)
- **EMPTY DRAFT PERSISTENCE** = **NO** (blocked on Core)
- **FAKE CLIENT STORAGE** = **NO**
- **FROZEN WEBSITE KOMPIS DIFF** = **0**
- **NEW SQL** = **NO**
- **OWNER VISUAL ACCEPTANCE** = **PENDING**
- **SAFE TO FREEZE APP DESIGN** = **NO**
- **BUILD COMPLETE** = **NO** (PARTIAL — main multilingual function incomplete by design until authorization)

## Stop

Stop after this RESULT and authorized LIVE of the safe PARTIAL. **Do not start** Kompis Web phase 67, AI Translator, or other jobs.
