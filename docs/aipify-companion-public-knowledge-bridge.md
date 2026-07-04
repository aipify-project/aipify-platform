# PUBLIC.KOMPIS.FAQ.01A.PRODUCT.SPEC — APP-owned public FAQ for Website Kompis

**Status:** Product spec (docs-only)  
**Classification:** B — tenant-owned knowledge exists; public-safe bridge missing  
**Layer:** Customer App (APP) owns content · Install Engine owns public read path (future gates)  
**Date:** 2026-07-05

---

## 1. Purpose

**Website Kompis FAQ** (NO: *Website Kompis FAQ* / *Offentlig FAQ* · EN: *Website Kompis FAQ* / *Public FAQ*) is a **public-safe knowledge source** for anonymous visitors on a customer's public website.

It exists so that:

- The **APP owner/admin** explicitly chooses what website visitors may see.
- **Public/front Kompis** answers from **only** this approved source — never from internal APP knowledge, org intelligence, or private operational data.
- **APP Kompis** and **Website Kompis** remain **isolated surfaces** with no shared private conversation state.

This spec defines the product gate **before** any database migration, RPC, APP UI, or public ask route is built.

---

## 2. Owner

| Role | Can create / edit | Can publish to website | Can archive |
|------|-------------------|------------------------|-------------|
| **APP owner** | Yes | Yes | Yes |
| **APP admin** | Yes | Yes | Yes |
| Support, staff, read_only | No | No | No |

**Feature owner:** Customer App (`/app/*`)  
**Future public read owner:** Install Engine (`/api/install/*`, `/api/embed/*`) — not Platform Admin, not APP private RPCs.

Publishing is an **explicit human decision**. Nothing in internal Knowledge Center, Business DNA, or Employee Knowledge is auto-exposed to Website Kompis.

---

## 3. Content types (v1)

First version supports **structured, admin-authored entries** — not scraped page content.

| Type | Description | Example |
|------|-------------|---------|
| **FAQ Q&A** | Question + short answer | “Hvor lang er leveringstiden?” |
| **Opening hours / response times** | Plain text block | “Man–fre 09:00–16:00. Svar innen 24 timer.” |
| **Holiday / vacation message** | Temporary public notice | “Vi er stengt 24.–26. des. E-post besvares etter nyttår.” |
| **Contact information** | Phone, email, form link, chat hours | “Kontakt oss: hei@firma.no” |
| **Public policy / rules** | Customer-visible rules only | “Returpolicy: 30 dager …” |
| **Important links** | Label + URL to public pages | “Se priser → /priser” |

All fields are **short text or URLs** — no HTML blobs, no file attachments, no PII from member records.

Optional v1 metadata per entry:

- `locale` (en, no, sv, da, pl, uk — core locales)
- `sort_order`
- `category` (faq · hours · holiday · contact · policy · link)

---

## 4. Visibility and publish model

Every entry has an explicit lifecycle:

| Status | Meaning | Website Kompis may read |
|--------|---------|-------------------------|
| **draft** | Work in progress; APP-only | No |
| **published** | Approved for anonymous visitors | Yes |
| **archived** | Retired; kept for audit/history | No |

Additional rules:

- **Public-safe** is implicit for entries in this module — they are created *for* website visitors only.
- Public/front Kompis may read **only** when **all** are true:
  1. `status = published`
  2. Entry belongs to **correct tenant**
  3. Request is bound to **correct installation / verified domain** (future embed gate)
  4. Request locale matches entry locale (with English fallback)

There is **no** “customer-only” or “internal” visibility inside this module — those concepts stay in Knowledge Center Engine and other APP systems.

---

## 5. Security rules (hard boundaries)

### Website Kompis MUST NEVER read

- Internal or customer-only Knowledge Center content (`visibility = internal | customer` on org KCE tables)
- Business DNA `support_knowledge_items` / email templates
- Employee Knowledge Engine (EKE) items
- Support cases, triage, ASO drafts
- Member directory, verification, statistics (`member.search`, org intelligence)
- Bookings, appointments, availability internals
- Finance, orders, payment, subscription details
- Employee/HR data, schedules, absence internals
- Private APP Kompis chat / conversation state
- PAME, LifeOS, RSI personal content
- Platform Admin or cross-tenant aggregates
- Raw DOM / full-page scrape blobs

### Isolation principle

```text
APP owner fills Website Kompis FAQ
  → marks published
  → public-safe read model (future RPC) returns ONLY those rows
  → embed/public ask route (future) serves anonymous visitors
  → NO path to search_organization_knowledge, retrieve_knowledge_for_ai,
    orchestrateCompanionSearch, or APP enqueue for visitors
```

APP Kompis and Website Kompis **do not share** conversation IDs, queue jobs, or memory.

---

## 6. Recommended technical model (A vs B)

### Option A — Reuse `knowledge_faq_items` with `visibility = 'public'`

**Pros**

- Table and visibility enum already exist (`internal` · `customer` · `public`)
- KCE admin patterns partially reusable
- Fewer new tables

**Cons**

- Same table holds internal/customer/public — higher risk of operator error (“public” vs “customer” confusion)
- APP UX must filter KCE vs Website FAQ; easy to expose wrong RPC to anon
- `search_organization_knowledge` today has **no anon grant** but APP companion calls it **without visibility filter** — reusing table increases coupling to unsafe paths
- Holiday/hours/contact are not first-class types in FAQ schema

### Option B — Dedicated table (recommended for v1)

Example name: `tenant_public_companion_faq_items` (final name in 01B DB spec)

**Pros**

- **Explicit product boundary** — only Website Kompis content lives here
- Smallest blast radius; anon RPC allowlist is one table
- Clear audit: “published to website” is the only purpose
- Draft/published/archived without overloading KCE workflows
- Supports content types (hours, holiday, contact, link) without stretching FAQ schema

**Cons**

- New migration + APP CRUD RPCs (gate 01B/01C)
- Some duplication vs KCE public FAQs (mitigated: optional “copy from KCE” later, not v1)

### Recommendation for first safe implementation

**Choose Option B** — dedicated APP-owned public FAQ store.

Regardless of A or B, the **public read path** must be:

1. **Dedicated security-definer RPC** e.g. `search_tenant_public_visitor_knowledge(p_installation_token, p_domain, p_query, p_locale)`
2. **Hard filters:** `status = 'published'`, tenant match, domain/install validation
3. **Hard allowlist:** only the public FAQ table (and future explicit public status snippets if added)
4. **`GRANT EXECUTE … TO anon`** only on this RPC — **never** on `search_organization_knowledge`, `retrieve_knowledge_for_ai`, org intelligence, or APP companion RPCs
5. **Separate API route** from `/api/marketing/companion/ask` (Aipify marketing) and `/api/aipify/companion/chat/enqueue` (authenticated APP)

Marketing site Kompis (`WebsiteCompanionAssistant` on aipify.ai) **remains unchanged** until a distinct tenant embed product ships.

---

## 7. APP UX (proposed)

**Route (canonical proposal):** `/app/website-kompis/faq`  
(Align with `lib/app/nav-config.ts` patterns when implementing 01C.)

### Screen sections

1. **Header**
   - Title: Website Kompis FAQ / Offentlig FAQ
   - Subtitle: Information visitors may receive on your public website through Website Kompis.

2. **Warning banner (persistent)**
   - NO: *Dette innholdet kan vises for anonyme besøkende på nettsiden din.*
   - EN: *This content may be shown to anonymous visitors on your public website.*

3. **Entry list**
   - Columns: type, title/question, locale, status (draft / published / archived), updated
   - Actions: edit, publish, unpublish (→ draft), archive, duplicate

4. **Editor**
   - Type selector (FAQ, hours, holiday, contact, policy, link)
   - Locale
   - Title / question
   - Answer / body (length-limited, plain text)
   - Optional link URL (for link type)
   - Save draft · Publish · Archive

5. **Preview panel**
   - Label: *Dette kan nettside-Kompis svare med*
   - Shows rendered plain-text answer as visitor would see (no APP nav, no internal sources)

6. **Empty state**
   - Explain purpose + CTA to create first public FAQ entry

### i18n

All UI strings in core locales: `en`, `no`, `sv`, `da`, `pl`, `uk` — keys under `customerApp.websiteKompisFaq.*` when built (gate 01C).

### Permissions

Gate on APP owner/admin only; enforce server-side in RPCs, not UI alone.

---

## 8. Future gates (after this spec)

| Gate | Deliverable |
|------|-------------|
| **01A** | Product spec — APP-owned public FAQ purpose, security, Option B decision ✅ |
| **01B** | DB / read model spec — table fields, RLS model, RPC contract, retrieval order ✅ |
| **01C** | APP UI spec/build — `/app/website-kompis/faq`, i18n, thin client → Core RPCs |
| **01D** | DB migration + RLS + audit table |
| **01E** | Public-safe RPC implementation |
| **01F** | Public embed/ask route bridge |
| **01G** | Security smoke tests |
| **01H** | Answer quality tests for non-exact FAQ questions |
| **01I** | Unonight pilot content setup |
| **01J** | Production verification |

Sequence is strict: **01A → 01B → 01D → 01E → 01F → 01G before production embed → 01C in parallel with 01D where safe → 01H–01J for pilot and launch.**

---

## 9. Non-goals (v1)

- Shared chat history between APP Kompis and Website Kompis
- Access to private APP data or org intelligence
- AI over support cases, tickets, or member search
- Employee or HR data
- Payment, billing, or booking flows
- Automatic scraping or indexing of the entire customer website
- Replacing Knowledge Center Engine or Business DNA
- Platform-wide public FAQ (that remains marketing corpus on aipify.ai)
- Multilingual auto-translation without human publish per locale

---

## 10. Relationship to existing analysis

Prior inspection (**PUBLIC.KOMPIS.FAQ.SNIPER.01**) confirmed:

- Public marketing Kompis today uses **empty tenant context** + **platform/marketing corpus only** — safe but not tenant-aware.
- Tenant KCE FAQ exists with `visibility = public` but **no anon read bridge**.
- APP Kompis uses authenticated orchestration including org knowledge — **must not** be reused for visitors.

This product spec is the **explicit gate** so implementation teams do not shortcut by wiring public ask to `search_organization_knowledge` or APP companion enqueue.

---

## 11. Success criteria (for later gates)

- APP owner can publish a FAQ entry and see it in preview.
- Anonymous embed request with valid install/domain returns **only** published Website Kompis FAQ rows for that tenant.
- Same request **cannot** retrieve internal KCE rows, BDE items, members, or support cases.
- APP Kompis behavior unchanged for authenticated users.
- Audit log records publish/unpublish/archive with actor and timestamp.

---

## 12. Glossary

| Term | Meaning |
|------|---------|
| **Website Kompis** | Public/front Companion on customer’s public website (anonymous visitor) |
| **APP Kompis** | Authenticated Companion in Customer App (`/app/*`, drawer/panel) |
| **Marketing Kompis** | Public popup on aipify.ai marketing site (Aipify product story — not tenant FAQ) |
| **Public-safe** | Explicitly published for anonymous visitors via this module only |

---

*End of PUBLIC.KOMPIS.FAQ.01A.PRODUCT.SPEC*

---

# PUBLIC.KOMPIS.FAQ.01B.DB.READ.MODEL.SPEC — DB/read model for public Website Kompis knowledge

**Status:** DB/read model spec (docs-only)
**Builds on:** 01A — Option B dedicated table (`tenant_public_companion_faq_items`)
**Layer:** Aipify Core (Supabase) · Install Engine owns anon read RPC · Customer App owns CRUD
**Date:** 2026-07-05

This section specifies the **database shape, RLS principles, public RPC contract, and retrieval order** for Website Kompis public FAQ. **No migration, RPC, or code is created in this gate.**

---

## 1. Dedicated table proposal

### Table name (recommended)

```text
tenant_public_companion_faq_items
```

### Purpose

APP-owned, **public-safe** knowledge source for **Website Kompis** — anonymous visitors on the customer's public website.

### What this table is NOT

| Not | Reason |
|-----|--------|
| Internal Knowledge Center | KCE uses `knowledge_articles` / `knowledge_faq_items` with internal/customer visibility |
| Customer/member knowledge | No CRM, member directory, or authenticated portal content |
| APP Companion private runtime | No chat payloads, queue jobs, or conversation state |
| Business DNA / EKE / support cases | Separate systems with different trust boundaries |

This table exists **only** for content the APP owner/admin explicitly publishes for **public website visitors**.

### Tenant scoping

- `tenant_id` references the customer tenant (align with existing `customers.id` / org mapping used by Install Engine).
- Rows are always tenant-scoped; cross-tenant reads are forbidden.

---

## 2. Recommended fields

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `tenant_id` | `uuid` | NO | — | FK to customer/tenant; required on every row |
| `install_id` | `uuid` | YES | — | Optional scope: limit row to one installation; NULL = all verified installs for tenant |
| `domain` | `text` | YES | — | Optional scope: single allowed domain; NULL = any verified domain for tenant/install |
| `locale` | `text` | NO | — | Core locale code (`en`, `no`, `sv`, `da`, `pl`, `uk`) |
| `title` | `text` | NO | — | Display title; max length enforced in APP/RPC (e.g. 200) |
| `question` | `text` | YES | — | FAQ question; required when `content_type = faq` |
| `answer` | `text` | NO | — | Public-safe body; plain text; max length (e.g. 2000) |
| `category` | `text` | YES | — | Free-form grouping label for APP UI (e.g. `shipping`, `support`) |
| `content_type` | `text` | NO | — | See enum below |
| `status` | `text` | NO | `'draft'` | `draft` · `published` · `archived` |
| `public_safe` | `boolean` | NO | `false` | Must be `true` before publish; RPC hard-filters `true` |
| `surface` | `text` | NO | `'website_kompis'` | V1: only `website_kompis`; future surfaces require new RPC |
| `priority` | `integer` | NO | `100` | Lower = higher priority in retrieval tie-break |
| `tags` | `text[]` | NO | `'{}'` | Semantic retrieval hints; no PII |
| `source_url` | `text` | YES | — | Optional public link (https only; validated server-side) |
| `valid_from` | `timestamptz` | YES | — | Optional start (holiday notice, seasonal hours) |
| `valid_until` | `timestamptz` | YES | — | Optional end; expired rows excluded from public read |
| `last_reviewed_at` | `timestamptz` | YES | — | APP admin review marker |
| `published_at` | `timestamptz` | YES | — | Set on publish |
| `published_by` | `uuid` | YES | — | APP user who published |
| `created_by` | `uuid` | NO | — | APP user who created |
| `updated_by` | `uuid` | YES | — | Last editor |
| `archived_at` | `timestamptz` | YES | — | Set on archive |
| `archived_by` | `uuid` | YES | — | APP user who archived |
| `created_at` | `timestamptz` | NO | `now()` | |
| `updated_at` | `timestamptz` | NO | `now()` | |

### `content_type` enum (check constraint)

| Value | Use |
|-------|-----|
| `faq` | Standard Q&A |
| `opening_hours` | Regular hours / response-time text |
| `holiday_notice` | Temporary closure or holiday message |
| `contact` | Public contact channels |
| `policy` | Return, privacy, terms snippets meant for visitors |
| `product_info` | Public product description (non-internal) |
| `service_info` | Public service description |
| `link` | Label + `source_url` to important public page |

### Indexes (recommended in 01D migration)

- `(tenant_id, status, surface, locale)` — APP list + public filter
- `(tenant_id, content_type, status)` — status/hours lookup
- `(tenant_id, valid_from, valid_until)` — time-bounded notices
- GIN on `tags` — optional tag search
- Full-text or trigram on `(title, question, answer)` — semantic retrieval within filtered set (implementation in 01E)

### Field length limits (application layer)

| Field | Max (recommended) |
|-------|-------------------|
| `title` | 200 |
| `question` | 500 |
| `answer` | 2000 |
| `source_url` | 500 |
| `domain` | 253 |
| `tags` | 20 tags × 50 chars |

---

## 3. Hard read filter

Public/front Kompis **must not read the table directly**. The dedicated RPC applies **all** of the following before any search or ranking:

```sql
-- Conceptual filter (implemented inside SECURITY DEFINER RPC only)
WHERE tenant_id = :resolved_tenant_id
  AND status = 'published'
  AND public_safe = true
  AND surface = 'website_kompis'
  AND (install_id IS NULL OR install_id = :resolved_install_id)
  AND (domain IS NULL OR domain = :verified_domain)
  AND (locale = :request_locale OR (:fallback_locale = 'en' AND locale = 'en'))
  AND (valid_from IS NULL OR valid_from <= now())
  AND (valid_until IS NULL OR valid_until >= now())
```

### Rules

| Rule | Behavior |
|------|----------|
| `status = draft` | **Never** returned to anon/public RPC |
| `status = archived` | **Never** returned to anon/public RPC |
| `public_safe = false` | **Never** returned, even if status is published |
| Wrong tenant/install/domain | **Zero rows** — no fallback |
| Expired `valid_until` | Excluded |
| Future `valid_from` | Excluded until active |

Locale fallback order: requested locale → `en` → no row (honest gap).

---

## 4. RLS model (spec only)

### Principle

**The table must not be directly readable by `anon`.**

### Expected access matrix

| Actor | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| **APP owner/admin** | Own tenant rows | Yes | Yes | Soft via archive |
| **APP staff/support/read_only** | No (V1) | No | No | No |
| **authenticated (generic)** | Deny direct table access | — | — | — |
| **anon** | **Deny** | **Deny** | **Deny** | **Deny** |
| **Public RPC (SECURITY DEFINER)** | Filtered subset only | No | No | No |

### Implementation notes (for gate 01D)

- `ENABLE ROW LEVEL SECURITY` on table.
- `REVOKE ALL ON tenant_public_companion_faq_items FROM anon, authenticated`.
- APP CRUD via **security definer RPCs** that verify owner/admin + `tenant_id` match (same pattern as Business DNA / KCE admin RPCs).
- Public read **only** via `search_tenant_public_visitor_knowledge` — never `SELECT` grant on table to anon.

### Publish invariant

On publish RPC (future):

1. Set `status = 'published'`
2. Set `public_safe = true` (explicit; cannot publish with `false`)
3. Set `published_at`, `published_by`
4. Write audit event

Unpublish returns to `draft` and sets `public_safe = false` (or leaves archived path separate).

---

## 5. Dedicated public RPC contract

### RPC name (recommended)

```text
search_tenant_public_visitor_knowledge
```

### Purpose

Single entry point for **anonymous Website Kompis** retrieval on customer websites. No Supabase user session required.

### Input parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `p_install_id` | `uuid` or verified install token text | Yes* | Installation identifier from embed (prefer token hash lookup server-side) |
| `p_domain` | `text` | Yes | Request origin domain; must match installation allowlist |
| `p_locale` | `text` | Yes | Visitor locale |
| `p_query` | `text` | Yes | Visitor question (trimmed, length-limited e.g. 1000) |
| `p_pathname` | `text` | No | Page context only; not used to bypass filters |
| `p_limit` | `integer` | No | Default `5`, max `10` |

\*If embed uses installation token instead of raw UUID, API route resolves token → `install_id` before RPC call; browser never sends raw `tenant_id`.

### Output shape (per row)

| Field | Type | Description |
|-------|------|-------------|
| `item_id` | `uuid` | Public FAQ row id |
| `title` | `text` | |
| `answer` | `text` | Grounding text only |
| `category` | `text` | Nullable |
| `content_type` | `text` | |
| `locale` | `text` | |
| `source_url` | `text` | Nullable |
| `score` | `numeric` | Relevance 0–1 |
| `matched_reason` | `text` | Nullable; e.g. `tag_match`, `fts_rank`, `content_type_opening_hours` |

RPC returns `jsonb` array of rows or structured `{ items: [], resolved_tenant_id, locale_used, match_count }` — exact wire format fixed in 01E.

### Security grants

```text
GRANT EXECUTE ON FUNCTION search_tenant_public_visitor_knowledge(...) TO anon;
-- NO grant on:
--   search_organization_knowledge
--   retrieve_knowledge_for_ai
--   APP companion chat RPCs
--   org intelligence / member RPCs
```

### RPC internal allowlist

The function body may **only** read from:

- `tenant_public_companion_faq_items` (filtered)
- Install/domain validation helpers (`installations`, verified domains — read-only metadata)
- Optional rate-limit / audit stub tables (future)

It must **never** join to KCE, BDE, EKE, support, members, or companion chat tables.

### Response field prohibition

Never return: `created_by`, `published_by`, internal notes, draft content, tenant_id to client (optional opaque install ref only), or fields from other tables.

---

## 6. Install/domain validation

### Trust model

**Public requests must not be trusted based on client-supplied `tenant_id` alone.**

```text
Browser/embed
  → sends install_id (or installation token) + domain + locale + query
  → API route (Install Engine)
  → validates token/domain against installations record
  → resolves tenant_id server-side only
  → calls search_tenant_public_visitor_knowledge(resolved_install, verified_domain, ...)
```

### Validation steps (ordered)

1. **Resolve installation** — token or `install_id` maps to exactly one active installation.
2. **Verify domain** — `p_domain` matches registered/verified domain for that installation (reuse Install Engine domain checks; same pattern as heartbeat/embed validation).
3. **Resolve tenant** — `installation.customer_id` / `company_id` → `tenant_id` for FAQ filter.
4. **License gate (optional V1)** — paused/cancelled tenant returns empty public knowledge set, not private fallback.
5. **Apply hard filters** — section 3.
6. **Semantic search** — section 8, only within filtered rows.

### Mismatch behavior

| Condition | Result |
|-----------|--------|
| Unknown install | Empty items + safe error code; **no** private fallback |
| Domain not on allowlist | Empty items; **no** private fallback |
| Install/tenant suspended | Empty items or maintenance message from public-safe row only |
| Token expired/revoked | Empty items |

Optional future: `tenant_public_companion_security_events` audit table for repeated mismatch (not in 01B migration).

### Pathname

`p_pathname` is **context only** (e.g. boost `link` rows matching path). It must not widen tenant scope or skip domain validation.

---

## 7. Publish audit

Every **publish**, **unpublish** (→ draft), and **archive** must append an audit record.

### Recommended audit table (future — gate 01D)

```text
tenant_public_companion_faq_audit_events
```

| Column | Purpose |
|--------|---------|
| `id` | uuid PK |
| `tenant_id` | Tenant scope |
| `item_id` | FK to FAQ item |
| `action` | `publish` · `unpublish` · `archive` · `create` · `update` |
| `old_status` | Previous status |
| `new_status` | New status |
| `actor_user_id` | APP user |
| `created_at` | Timestamp |
| `locale` | Item locale at time of action |
| `install_id` | Nullable scope snapshot |
| `domain` | Nullable scope snapshot |
| `metadata` | jsonb — optional diff summary (no full answer body in audit if policy restricts) |

Audit writes occur in **APP admin RPCs** (publish/unpublish/archive), not in public search RPC.

---

## 8. Semantic retrieval model

Public FAQ must **not** be exact-string match only.

### Requirements

- Search across `title`, `question`, `answer`, `tags`, `category`
- Synonym tolerant (e.g. “åpningstider” / “opening hours” via locale + FTS/trigram)
- Locale-aware ranking (prefer request locale, then `en`)
- Top-K results (`p_limit`, default 5)
- Answers **grounded** only in returned public-safe rows
- If no row matches: honest gap — *not enough public information*
- May suggest **published** `content_type = contact` row if present

### Mandatory order of operations

```text
1. Resolve install/domain → tenant_id (server-side)
2. Hard filter public-safe rows (section 3)
3. Semantic search ONLY within filtered candidate set
4. Return ranked rows to answer layer (embed route or thin generator)
5. Generate visitor answer from returned rows ONLY — no external corpus
```

### V1 retrieval implementation options (01E decision)

| Approach | Notes |
|----------|-------|
| Postgres `tsvector` + `plainto_tsquery` | Simple; no new infra; good for 01E |
| Trigram (`pg_trgm`) | Fuzzy match for typos |
| Embeddings/vector | **Non-goal for 01B/01D** — defer to later gate if needed |

Semantic step runs **after** hard filters — never before.

---

## 9. Answer safety rules

### Website Kompis MAY

- Summarize one or more published public FAQ rows
- Combine multiple public-safe rows (e.g. hours + contact)
- Explain opening hours from `content_type = opening_hours`
- Mention holiday notice from published `holiday_notice` within valid date range
- Suggest public contact option from published `contact` row
- Link to `source_url` when `content_type = link`

### Website Kompis MUST NOT

- Answer from internal/customer KCE, BDE, EKE, or support cases
- Infer private operations (staff availability, queue depth, member counts)
- Reveal members, customers, employees, or admin settings
- Reveal booking slots, finance, or order data
- Call `member.search`, org intelligence, or APP Companion RPCs
- Claim live open/closed status unless grounded in published `opening_hours` / `holiday_notice` rows
- Use APP conversation history or authenticated permissions

### Grounding rule

If retrieved rows do not support an answer, respond with **public-safe gap** + optional contact row — same pattern as marketing companion honest gap, but tenant-scoped.

---

## 10. Status / opening hours / vacation mode

V1 uses **the same table** — no separate hours engine for public visitors.

### Representation

| Visitor question | Grounding source |
|------------------|-----------------|
| “What are your opening hours?” | Published `opening_hours` row(s) |
| “Are you open today?” | Published `opening_hours` + active `holiday_notice` where `valid_from`/`valid_until` include today |
| “Are you closed for Easter?” | Published `holiday_notice` with matching date range |

### Examples

```text
content_type = opening_hours
title = "Opening hours"
answer = "Mon–Fri 09:00–16:00. Email answered within 24 hours."
valid_from = NULL
valid_until = NULL

content_type = holiday_notice
title = "Easter closure"
answer = "We are closed 17–21 April. Email will be answered after 22 April."
valid_from = 2026-04-17T00:00:00Z
valid_until = 2026-04-21T23:59:59Z
```

### No guess rule

If no published row applies to “open today?”:

- Do **not** infer from internal vacation engine, workforce scheduling, or user quiet hours
- Return honest gap
- If a published `contact` row exists, suggest that path

---

## 11. Relationship to APP Kompis

| Shared | Isolated |
|--------|----------|
| Aipify Core / platform product corpus (marketing vs authenticated policy TBD per surface) | Conversation history |
| **Published** `tenant_public_companion_faq_items` (APP may read via authenticated RPC for preview/consistency) | APP private org knowledge without visibility filter |
| Same tenant ownership | Authenticated permissions model |
| | Org intelligence, member.search, support cases |
| | APP enqueue / worker / turn runtime |

APP Kompis **may** surface richer answers by role from authenticated sources. Public Kompis **may only** use published public FAQ rows + platform corpus policy for embed (tenant product FAQ only from this table).

Public route **must not** call `/api/aipify/companion/chat/enqueue` or authenticated Supabase session RPCs.

---

## 12. Non-goals for 01B

This gate does **not** deliver:

- SQL migration files
- RLS policy DDL
- RPC implementation
- API routes or embed widget
- APP management UI
- Embeddings / vector columns
- Production seed data
- Unonight content

01B is **specification only** — implementation follows gates 01C–01J.

---

## 13. Next gates (recommended sequence)

| Gate | Deliverable |
|------|-------------|
| **01C** | APP UI spec/build — `/app/website-kompis/faq`, CRUD via admin RPCs, preview |
| **01D** | DB migration — `tenant_public_companion_faq_items`, audit table, RLS, indexes |
| **01E** | `search_tenant_public_visitor_knowledge` RPC + APP admin RPCs |
| **01F** | Public embed/ask route — install token + domain → RPC; no user session |
| **01G** | Security smoke — anon cannot read table; wrong domain empty; no org RPC leakage |
| **01H** | Answer quality — non-exact FAQ, hours, holiday, contact fallback |
| **01I** | Unonight pilot — seed published public FAQ content |
| **01J** | Production verification — end-to-end on verified customer domain |

**Critical path:** 01D → 01E → 01F → 01G before any customer-facing embed. 01C can proceed in parallel with 01D once field list is frozen (this spec).

---

*End of PUBLIC.KOMPIS.FAQ.01B.DB.READ.MODEL.SPEC*
