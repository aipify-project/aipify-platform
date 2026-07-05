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

---

# PUBLIC.KOMPIS.FAQ.01C.APP.UI.SPEC — APP management UI for Website Kompis FAQ

**Status:** APP UI spec (docs-only)
**Builds on:** 01A product spec · 01B DB/read model (`tenant_public_companion_faq_items`, `search_tenant_public_visitor_knowledge`)
**Layer:** Customer App (`/app/*`) — thin client; Core RPCs in gates 01D/01E
**Date:** 2026-07-05

This section specifies the **APP management UI** for Website Kompis public FAQ. **No UI components, migrations, RPCs, or API routes are created in this gate.**

---

## 1. Route

### Preferred route (canonical)

**`/app/website-kompis/faq`**

### Alternative considered

**`/app/companion/website-faq`**

### Decision

Use **`/app/website-kompis/faq`**.

| Factor | `/app/website-kompis/faq` | `/app/companion/website-faq` |
|--------|---------------------------|------------------------------|
| Product clarity | Names the **Website Kompis** surface explicitly | Buried under authenticated Companion namespace |
| Layer separation | Content for **anonymous visitors** — distinct from APP Companion runtime | Implies same product area as `/app/companion/*` engines |
| Nav placement | Settings / Install / Website area — public embed configuration | Companion sidebar — suggests private assistant tooling |
| 01A/01B alignment | Already proposed | Would require re-documentation |

`/app/companion/*` routes in `lib/app/nav-config.ts` serve **authenticated APP Companion engines** (memory, identity, executive, etc.). Website Kompis FAQ is **published visitor knowledge**, not companion runtime. Keeping it under `website-kompis` avoids conflating public-safe content management with private APP chat.

### Related routes (future, not 01C)

| Route | Purpose |
|-------|---------|
| `/app/website-kompis/faq` | FAQ CRUD (this spec) |
| `/app/website-kompis` | Optional overview hub (embed status, domain, preview link) — later gate |
| `/app/settings/developer` | Install tokens — existing; not FAQ editor |

### Nav proposal

Add under **Settings** or **Website / Install** group (exact nav id TBD at build):

- Label key: `customerApp.websiteKompisFaq.navTitle`
- Icon: public/globe or shield-check (Light Enterprise — no neon)
- Visible to: owner, admin only (V1)

---

## 2. Access control

### V1 roles

| Role | View list | Create/edit draft | Publish / unpublish | Archive | Restore archived |
|------|-----------|-------------------|---------------------|---------|------------------|
| **owner** | Yes | Yes | Yes | Yes | Yes |
| **admin** | Yes | Yes | Yes | Yes | Yes |
| support, staff, read_only | No | No | No | No | No |

Employees **cannot** access this page in V1. A future permission may allow read-only draft preview for delegated content roles — **not in V1**.

### Permission concept

**Primary (V1):** enforce via existing tenant role check — `owner` or `admin` only.

**Future (optional):** dedicated permission key:

```text
website_kompis_faq.manage
```

Scope: create, edit, publish, unpublish, archive rows in `tenant_public_companion_faq_items` for the authenticated tenant.

Implementation should align with nearest existing patterns (e.g. Business DNA admin, module settings) — `_bde_require_admin()`-style RPC guard on all CRUD/publish RPCs in gate 01E.

### Hard rules

- **No anonymous access** — page requires authenticated APP session.
- **No public read from this UI** — the page never exposes anon embed URLs that bypass RPC filters; preview uses authenticated preview RPC or local render of draft/published fields only.
- **Publishing requires explicit confirmation** — see §4D and §7.
- **Tenant scope** — all queries scoped by session `company_id`; never accept `tenant_id` from client without session validation.

---

## 3. Page purpose

### Primary message (header)

**NO:** *Website Kompis FAQ* — *Innhold besøkende kan få svar på fra nettsiden din.*

**EN:** *Website Kompis FAQ* — *Content that visitors on your public website may receive from Website Kompis.*

### Explanatory copy (subtitle / intro)

> This content can be shown to visitors on your public website by Website Kompis.

### Persistent warning banner

**EN:**

> Do not publish private customer, member, employee, booking, support-case, finance, or internal operations information.

**NO:**

> Ikke publiser privat kunde-, medlem-, ansatt-, booking-, support-, økonomi- eller intern driftsinformasjon.

Banner is **always visible** on list and editor — not dismissible in V1.

### What the page is not

- Not internal Knowledge Center (KCE)
- Not Business DNA or Employee Knowledge
- Not APP Companion chat configuration
- Not a public FAQ widget (embed is gate 01F)

---

## 4. Main UI sections

### A. Overview / list

Primary workspace at `/app/website-kompis/faq`.

**Columns (default table or card list):**

| Column | Source field | Notes |
|--------|--------------|-------|
| Title / question | `title`, `question` | Show `question` as secondary line if present |
| Category | `category` | Nullable; filterable |
| Locale | `locale` | Badge per core locale |
| Content type | `content_type` | Icon + translated label |
| Status | `status` | `draft` · `published` · `archived` — use `AipifyStatusBadge` |
| Public safe | `public_safe` | Icon + text; required for publish |
| Priority | `priority` | Lower number = higher sort in public retrieval |
| Last reviewed | `last_reviewed_at` | Relative date; highlight if stale |
| Published at | `published_at` | Empty for draft |
| Updated at | `updated_at` | Sort default descending |

**Row actions:**

| Action | Allowed when |
|--------|--------------|
| Edit | owner/admin; not archived (or edit opens read-only for archived with restore path) |
| Publish | `status = draft`, validation passes |
| Unpublish | `status = published` → draft |
| Archive | `status = published` or draft |
| Duplicate | any non-archived; creates new draft |
| Preview | any row with non-empty answer |

**Bulk actions (V1 optional):** defer bulk publish/archive to post-V1 unless trivial.

### B. Editor

Side panel or dedicated sub-route: `/app/website-kompis/faq/[id]` and `/app/website-kompis/faq/new`.

**Fields:**

| Field | Control | Required | Notes |
|-------|---------|----------|-------|
| Title | text input | Yes | Short label for admin list and public grounding |
| Question | text input | No | Visitor phrasing; helps semantic match |
| Answer | textarea | Yes (to publish) | Plain text; no HTML blobs in V1 |
| Category | text or select | No | Free text or preset list |
| Locale | select | Yes | Core locales: en, no, sv, da, pl, uk |
| Content type | select | Yes | See §5 |
| Tags | tag input (`text[]`) | No | Comma-separated; aids retrieval |
| Source URL | url input | No | Public page link for grounding citation |
| Valid from | datetime | No | For holiday_notice, timed policies |
| Valid until | datetime | No | Expiry; row excluded from public read when past |
| Priority | number | Yes (default 100) | Admin sort hint |
| Public safe | checkbox | Yes to publish | Must be checked + confirmed |
| Status | read-only badge + action buttons | — | Changed via publish controls §4D |

**Install/domain scope (V1):**

- Optional `install_id` / `domain` on row — if null, applies tenant-wide for all verified installs (01B model)
- Advanced scope UI may defer to 01D/01E if complex; show read-only tenant name always

**Validation before save:**

- Title not empty
- Answer not empty for publish (draft may save with empty answer with warning)
- Locale and content_type present
- `valid_until >= valid_from` when both set

### C. Preview

Panel or modal: **“Dette kan Website Kompis svare med”** / **“This is what Website Kompis may answer with”**.

**Preview shows:**

1. **Visitor-facing answer** — rendered plain text as anon would see (no admin metadata)
2. **Grounding preview** — title, content_type, locale, source_url if set
3. **Simulated visitor question** — optional input: “Test question” runs preview search against **published-filter logic** when RPC exists (gate 01E); in 01C spec only, local client preview of current row text

**Warnings in preview:**

- If `public_safe = false` → banner: *Not publishable until marked public-safe*
- If draft → *Visitors will not see this until published*
- If expired (`valid_until < now()`) → *Expired — not publicly readable*
- Risky keyword scan (§7) → non-blocking warning list

Preview **must not** call APP org knowledge, member search, or authenticated companion RPCs.

### D. Publish controls

Toolbar on editor and row actions on list.

| Action | Effect | Confirmation |
|--------|--------|--------------|
| **Save draft** | `status = draft`; persist fields | None |
| **Publish** | `status = published`, set `public_safe = true`, `published_at`, `published_by` | **Required** — modal |
| **Unpublish** | `status = draft`; clear `published_at` optional | Confirm — *Visitors will no longer see this* |
| **Archive** | `status = archived`, `archived_at`, `archived_by` | Confirm |
| **Restore** | `archived` → `draft` only | owner/admin; confirm |

**Publish confirmation modal must include:**

- Checkbox: *I confirm this content is safe for anonymous website visitors*
- Repeat of private-data warning (§3)
- Summary: locale, content_type, title
- Primary: Publish · Secondary: Cancel

**Unpublish / archive:** lighter confirm dialog with consequence text.

---

## 5. Content types

UI must support all `content_type` values from 01B. Each type defines editor hints and how Website Kompis may use the row.

| content_type | Editor should ask for | Website Kompis may use it to |
|--------------|----------------------|------------------------------|
| **faq** | Question (recommended), answer, category, tags | Answer general visitor questions; combine with other FAQ rows; synonym-tolerant match on question/title/answer |
| **opening_hours** | Answer (hours text), optional valid_from/until for seasonal hours | Answer “What are your opening hours?” and “Are you open today?” when no conflicting holiday_notice |
| **holiday_notice** | Answer (closure message), **valid_from** and **valid_until** required | Answer “Are you closed?” / vacation questions for date range only |
| **contact** | Answer (email, phone, form URL), source_url | Suggest public contact route when other answers insufficient; never dial or send on user's behalf |
| **policy** | Answer (short policy text), source_url to full policy page | Summarize published policy; link to source_url when present |
| **product_info** | Title, answer, tags, source_url | Answer public product questions from approved text only |
| **service_info** | Title, answer, tags, source_url | Answer public service questions from approved text only |
| **link** | Title (label), answer (one-line description), source_url **required** | Point visitors to public pages; never fetch private pages |

**UI type selector:** show description per type below the select control (i18n keys under `customerApp.websiteKompisFaq.contentTypes.*`).

---

## 6. Human answer model

### Principle

**FAQ is not a script. FAQ is approved grounding.**

Administrators write and approve rows. Website Kompis **retrieves and composes** from those rows at ask time (gate 01E/01F) — it does not freestyle from private APP data.

### Website Kompis may

- Understand synonyms and natural phrasing (semantic retrieval after hard filters — 01B §9)
- Answer naturally in the visitor's locale
- Combine multiple **published public-safe** rows into one coherent reply
- Summarize long approved text briefly
- Suggest a **published contact** row when information is insufficient

### Website Kompis must not

- Guess facts not present in published rows
- Invent opening hours or holiday status
- Read private APP knowledge (KCE internal, BDE, EKE, org intelligence)
- Reveal internal operational status (support queue, staff availability, bookings)
- Expose member, customer, employee, invoice, or case data
- Call `member.search`, org RPCs, or APP Companion enqueue

### UI responsibility

The management UI makes the **human approval boundary** visible: preview, warnings, and publish confirmation reinforce that published rows become visitor grounding.

---

## 7. Safety checks in UI

### V1 required checks

| Check | When | Behavior |
|-------|------|----------|
| **public_safe checkbox** | Before publish | Must be `true`; disabled until user checks box in publish modal |
| **Publish confirmation modal** | Publish action | Cannot publish without explicit confirm (§4D) |
| **Private-data warning** | Always on page | Persistent banner (§3) |
| **Keyword warnings** | On save / preview | Non-blocking scan of title + question + answer |

### Keyword warning list (V1 heuristic)

Scan case-insensitive for tokens including:

`internal`, `member id`, `customer id`, `phone list`, `booking`, `invoice`, `employee`, `support case`, `password`, `api key`, `salary`, `medlem`, `faktura`, `ansatt`, `supportssak`

If matched → show amber callout:

> This text may contain information that should not be public. Review before publishing.

**Does not block save draft.** Blocks publish only if combined with failed `public_safe` confirm.

### Explicit non-goals in UI (V1)

- **No automatic publishing** from AI-generated content
- **No “Generate with Aipify”** button on this page in V1
- **No import from internal KCE** without explicit copy flow and re-review (future gate)

---

## 8. Localization

### UI chrome (management page)

All labels, buttons, warnings, empty states, and modals use i18n keys:

```text
customerApp.websiteKompisFaq.*
```

**Core locales (mandatory at build):** `en`, `no`, `sv`, `da`, `pl`, `uk`

V1 spec may be authored in EN/NO first during implementation, but **page redesign gate** requires all six before lock (see `page-redesign-localization-gate.mdc`).

### FAQ row locale

Each row has a single `locale` field. One row = one language variant.

### Duplicate / translate flow (post-V1)

- **Duplicate row** → creates draft copy; admin changes locale and translates manually
- Future: “Translate from…” action — not in 01C build scope

### Public fallback (from 01B)

When visitor locale has no published rows:

1. Try exact locale match
2. Fall back to tenant default locale (company setting) if configured
3. Fall back to `en` if published English rows exist
4. Otherwise honest gap — no cross-locale guess from private sources

UI should show badge: *No published items for this locale* when filtering list by locale with zero published rows.

---

## 9. Empty state

When tenant has **no published** FAQ rows (draft-only or empty table):

**Title (EN):** *You have not published any Website Kompis FAQ yet.*

**Title (NO):** *Du har ikke publisert noen Website Kompis FAQ ennå.*

**Body:**

> Website Kompis will only answer from content you publish here and safe page context.

**NO:**

> Website Kompis svarer kun ut fra innhold du publiserer her og trygg sidekontekst.

**Primary CTA:** *Create first public FAQ item* / *Opprett første offentlige FAQ*

**Secondary (optional):** Link to docs / embed setup (gate 01F) — disabled or “Coming soon” until embed ships.

Use `PlatformEmptyState` pattern — never blank white page.

---

## 10. Audit display

### On editor / detail view (read-only metadata)

| Field | Display |
|-------|---------|
| Created by | `created_by` → user display name |
| Updated by | `updated_by` + `updated_at` |
| Published by | `published_by` + `published_at` |
| Archived by | `archived_by` + `archived_at` |
| Last reviewed | `last_reviewed_at` with “Mark as reviewed” action (sets timestamp + current user) |

### Future audit timeline (gate 01D+)

Pull from `tenant_public_companion_faq_audit_events`:

- action: `publish` · `unpublish` · `archive` · `restore` · `review`
- old_status → new_status
- actor, timestamp, locale, install/domain scope

V1 UI: **field-level metadata** on item detail. Full event timeline when audit table and list RPC exist (01E).

---

## 11. Status lifecycle

```text
draft ──publish──► published ──unpublish──► draft
                      │
                      └──archive──► archived ──restore (owner/admin)──► draft
```

### Allowed transitions

| From | To | Who | Notes |
|------|-----|-----|-------|
| draft | published | owner/admin | Requires validation §11 |
| published | draft | owner/admin | Unpublish |
| published | archived | owner/admin | Removes from public read |
| draft | archived | owner/admin | Never was public |
| archived | draft | owner/admin only | Restore for re-edit; does not auto-publish |

**Forbidden:** archived → published directly (must restore to draft, review, publish again).

### Publish requirements

All must pass:

- `public_safe = true` (via confirmation)
- `answer` not empty (trimmed)
- `locale` present
- `content_type` present
- Tenant scope resolved from session
- Not past `valid_until` (warn if expired — block publish or force fix)
- For `holiday_notice`: recommend `valid_from` and `valid_until` — warn if missing

### Draft and archived visibility

- **Public RPC:** never returns draft or archived (01B hard filter)
- **UI list:** default filter may hide archived; toggle “Show archived”

---

## 12. Search and filter (UI)

### Filters (toolbar)

| Filter | Values |
|--------|--------|
| Status | all · draft · published · archived |
| Locale | all · en · no · sv · da · pl · uk |
| Category | all · (distinct from rows) |
| Content type | all · faq · opening_hours · … |
| Public safe | all · yes · no |
| Needs review | yes — `last_reviewed_at` null or older than configured period (default 90 days) |
| Text search | title, question, answer, tags (client or RPC) |

### Sort

Default: `updated_at` descending. Optional: priority ascending, published_at descending.

### Needs review configuration

V1: constant `REVIEW_STALE_DAYS = 90` in UI labels module. Future: tenant setting.

---

## 13. Review and maintenance

### last_reviewed_at

- Visible in list and detail
- **Mark as reviewed** button sets `last_reviewed_at = now()` and `updated_by`
- Filter “Needs review” highlights stale published rows

### Expired rows

When `valid_until < now()`:

- List badge: **Expired**
- Not publicly readable (01B filter)
- Publish action blocked or warns until dates fixed
- Unpublish recommended for holiday notices past season

### Maintenance copy (info callout)

> Review published content regularly. Expired holiday notices and outdated hours should be archived or updated.

---

## 14. Relationship to public route

This UI **does not expose public data directly**.

| This UI (01C build) | Public path (01E/01F) |
|---------------------|------------------------|
| Authenticated CRUD | Anon `search_tenant_public_visitor_knowledge` |
| Manages `tenant_public_companion_faq_items` | Reads only published + public_safe + filters |
| Preview simulates visitor answer | Embed `/api/.../companion/ask` or install route |
| Session + owner/admin | install_id + domain validation |

Data flow:

```text
Owner/admin edits in APP UI
  → CRUD RPC (01E) writes table
  → publish sets status + audit
  → public embed ask (01F)
  → search_tenant_public_visitor_knowledge (01E)
  → hard filters (01B)
  → semantic match + grounded answer
```

No direct table SELECT from browser. No anon access to this page.

---

## 14.1 Companion launcher icon (canonical brand asset)

The customer-site **Website Kompis launcher** uses the canonical **Aipify Companion presence icon**:

- purple connected-node Companion mark
- mint/green circular presence ring
- soft fade/pulse-ready ring in React surfaces

**Rule:** No customer implementation should replace this with a generic letter icon (for example “K”), plain text, a tenant logo, or a locally hosted launcher icon. **Aipify Core owns all launcher icon assets and approved variants.**

| Asset | Location |
|-------|----------|
| Public SVG (default) | `/aipify-companion-launcher-icon.svg` |
| Public SVG (light websites) | `/aipify-companion-launcher-icon-dark.svg` |
| Public SVG (dark websites) | `/aipify-companion-launcher-icon-light.svg` |
| Source SVGs | `assets/brand/aipify-companion-launcher-icon*.svg` |
| Variant registry | `lib/branding/companion-launcher-icons.ts` |
| React component | `components/branding/AipifyCompanionLauncherIcon.tsx` |
| Embed metadata API | `GET /api/embed/companion/launcher-icon` |

Customer embeds should consume the icon from Aipify Core — either the public SVG URL or the embed metadata endpoint — rather than hardcoding their own launcher artwork.

**Variant keys (Core-approved):**

| Key | Recommended surface | Purpose |
|-----|-------------------|---------|
| `companion-purple-default` | any | Backward-compatible canonical icon |
| `companion-purple-dark` | light / white websites | Stronger contrast on light backgrounds |
| `companion-purple-light` | dark / black websites | Brighter mark on dark backgrounds |

The metadata endpoint exposes `defaultVariant`, `selectedVariant`, and a `variants` array. Optional `?installId=` and `?domain=` selectors resolve Core-normalized install config when present; otherwise `selectedVariant` equals `defaultVariant`. Optional `?variant=` query param validates against the registry and falls back safely when no install selector is provided.

## 14.2 Website Kompis install config (Core contract)

**Aipify Core owns `WebsiteKompisInstallConfig`.** Customer widgets must not send config in ask requests. Core normalizes approved settings from install storage (future) or safe defaults today.

| Concern | Location |
|---------|----------|
| Config contract | `lib/marketing/website-kompis-install-config.ts` |
| Normalizer | `normalizeWebsiteKompisInstallConfig()` |
| Public reader | `getWebsiteKompisInstallConfigForPublicRequest()` |
| Public ask usage | `askPublicPlatformCompanion()` |
| Launcher metadata usage | `GET /api/embed/companion/launcher-icon` |

**Rules:**
- Icon variants are selected by approved registry keys only — never arbitrary URLs.
- Source toggles are safety-bounded; boundary rules cannot be disabled from client input.
- `sources.publicSiteIndex` defaults to `false` until Public Site Index ships.
- APP settings UI remains a later task; storage RPCs are live in §14.3.

## 14.3 Website Kompis install config storage (Core RPC)

Persistent per-install settings live in `tenant_public_companion_install_config` (raw JSON only). Core normalizes on every read.

| Concern | Location |
|---------|----------|
| Storage table | `tenant_public_companion_install_config` |
| Public read RPC | `get_website_kompis_public_install_config(p_install_id, p_domain)` — anon-safe after visitor context resolution |
| Authenticated read RPC | `get_website_kompis_install_config(p_install_id)` — owner/admin/platform |
| Update RPC | `update_website_kompis_install_config(p_install_id, p_patch)` — owner/admin/platform only |
| Storage loader | `loadWebsiteKompisInstallConfigFromStorage()` |
| Public reader wiring | `getWebsiteKompisInstallConfigForPublicRequest()` |

**Rules:**
- DB stores raw JSON only; `normalizeWebsiteKompisInstallConfig()` remains the public contract.
- Customer widgets must not send config; patches go through authenticated update RPC only.
- Forbidden patch fields (`iconUrl`, `tenantId`, `customerId`, secrets) are stripped before write.
- Public metadata and ask routes read persisted config after install/domain resolution; missing rows return safe defaults.
- No tenant/customer IDs are exposed in public metadata or ask responses.

---

## 15. Non-goals for 01C

This gate does **not** deliver:

- Database migration (01D)
- RLS policies (01D)
- RPC or API implementation (01E)
- Public widget / embed integration (01F)
- Embeddings or vector search
- AI authoring or auto-generate FAQ
- Auto-scraping website content
- Customer/member lookup
- Support case integration
- Booking, finance, or employee directory integration
- Production content seeding (01I)

01C is **UI specification only** — implementation follows gate 01C-build (same section, code) after 01D/01E or in parallel where RPCs are mocked.

---

## 16. Next gates (after 01C spec)

| Gate | Deliverable |
|------|-------------|
| **01C-build** | Implement `/app/website-kompis/faq` — list, editor, preview, i18n, thin client |
| **01D** | DB migration — `tenant_public_companion_faq_items`, `tenant_public_companion_faq_audit_events`, RLS, indexes |
| **01E** | Admin CRUD RPCs + `search_tenant_public_visitor_knowledge` |
| **01F** | Public embed/ask route bridge — install token + domain → RPC |
| **01G** | Security smoke tests — anon isolation, domain mismatch |
| **01H** | Answer quality tests — non-exact FAQ, hours, holiday |
| **01I** | Unonight pilot content setup |
| **01J** | Production verification |

**Recommended order:** 01D → 01E in parallel with **01C-build** (mock RPC until 01E ready) → 01F → 01G before customer embed.

---

# PUBLIC.KOMPIS.FAQ.MIGRATION.VERSION.RECONCILE — Website Kompis FAQ migration filenames

**Status:** Reconciled (repo only — not applied to remote until controlled apply gate)

Remote Supabase Core already recorded unrelated migrations at version keys that collided with initial Website Kompis FAQ filenames:

| Remote version | Remote name | Website Kompis FAQ? |
|----------------|-------------|---------------------|
| `20261932100000` | `core_human_approval_foundation` | **No** — unrelated |
| `20261932200000` | `remote_reconciliation_emergency_stop_forward_fix` | **No** — unrelated |

**Canonical Website Kompis FAQ migration files (after reconcile):**

| Gate | Filename |
|------|----------|
| **01D** | `supabase/migrations/20261932300000_tenant_public_companion_faq.sql` |
| **01E** | `supabase/migrations/20261932400000_tenant_public_companion_faq_rpcs.sql` |

**Superseded local filenames (do not use for apply):**

- `20261932000000_tenant_public_companion_faq.sql`
- `20261932100000_tenant_public_companion_faq_rpcs.sql`

Apply order: **01D (`20261932300000`) → 01E (`20261932400000`)** via controlled migration apply gate only.

---

*End of PUBLIC.KOMPIS.FAQ.01C.APP.UI.SPEC*
