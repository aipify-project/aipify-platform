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
| **01B** | DB / read model spec — table DDL, RLS, indexes, publish audit, `search_tenant_public_visitor_knowledge` contract |
| **01C** | APP FAQ UI — `/app/website-kompis/faq`, i18n, thin client → Core RPCs |
| **01D** | Public-safe RPC — install/domain validation, anon grant, rate limits |
| **01E** | Embed / public ask route — `POST /api/embed/website-kompis/ask` (or install-scoped equivalent), no Supabase user session |
| **01F** | Smoke + security tests — anon cannot hit org RPCs; published-only; wrong domain rejected; no member.search / org intelligence |

Sequence is strict: **01A (this doc) → 01B → 01D before 01E → 01C in parallel with 01B where safe → 01F before production embed.**

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
