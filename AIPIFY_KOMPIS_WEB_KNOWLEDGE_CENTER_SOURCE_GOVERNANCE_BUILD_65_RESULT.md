# AIPIFY – KOMPIS WEB KNOWLEDGE CENTER & SOURCE GOVERNANCE BUILD 65 — RESULT

**Branch:** `feature/kompis-web-knowledge-center-source-governance-65`  
**Feature commit:** `3e36d6c10e63850bb90febd9fb7a890926c49160`  
**PR:** [#159](https://github.com/aipify-project/aipify-platform/pull/159)  
**Merge SHA:** `1f64743dfffbb6a59114d091e86aefab494b3c21`  
**APP project:** `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`)  
**Deployment ID:** `dpl_GxQG439xjb92QYHMm6gQYo84zazt` — **READY**  
**Canonical domain:** `app.aipify.ai` (aliased)

| Gate | Result |
|------|--------|
| `READY FOR OWNER APP FUNCTION TEST` | **YES** |
| `SAFE TO FREEZE KOMPIS WEB KNOWLEDGE CENTER` | **NO** |
| `MIGRATION CREATED/APPLIED` | **NO** |
| Auth preserved | **YES** |
| `/app/kompis` preserved | **YES** |
| Old APP Companion absent | **YES** |
| Frozen Website Kompis files/hashes/runtime diff | **0** |

---

## What shipped

Canonical menu entry remains **`/app/website-kompis/faq`** (`kompisWebFaq`) — no new sidebar items.

1. **Knowledge Center hub** — section cards for FAQ, Website pages, Documents, Needs follow-up (`?section=`).
2. **FAQ workspace** — existing draft/publish/unpublish/archive admin embedded; `?create=1`, feedback suggest deep links preserved.
3. **Pages / Documents** — honest unavailable states (no fake crawl list or Bedrift upload).
4. **Follow-up** — FAQ draft count + not-helpful feedback count from existing RPCs only.
5. **Dashboard** — live knowledge KPIs + quick actions (create FAQ, review drafts, pages section).
6. **Source inventory contract** — `lib/website-kompis-knowledge/source-inventory.ts` + summary loader.
7. **i18n** — `customerApp.websiteKompisKnowledge.*` in en/no/sv/da/pl/uk.

No frozen Website Kompis runtime edits. No SQL/migration.

---

## Source inventory / truth matrix

| Source | Authoritative | APP capability | Frozen runtime |
|--------|---------------|----------------|----------------|
| FAQ | `tenant_public_companion_faq_items` + list/upsert/publish/archive RPCs | Full read/write | Yes (published) |
| Public pages | `tenant_public_site_index_*` (service_role / platform ingest) | Unavailable — needs APP list RPC | Yes (ask-time search) |
| Public documents | None for WK product | Unavailable — not in product | No |
| Answer feedback | overview RPC (job 64) | Read signals only | No |
| Domain connection | existing domain/WK settings APIs | Existing mutate paths | Yes (gates) |

---

## Canonical routes

| Surface | Route |
|---------|-------|
| Knowledge Center (FAQ menu) | `/app/website-kompis/faq` |
| Pages section | `/app/website-kompis/faq?section=pages` |
| Documents section | `/app/website-kompis/faq?section=documents` |
| Follow-up | `/app/website-kompis/faq?section=followUp` |
| Create FAQ | `/app/website-kompis/faq?create=1` |
| Feedback → FAQ draft | `/app/website-kompis/faq?suggestQuestion=…&fromFeedback=1` |
| Q&A / feedback | `/app/website-kompis/feedback` |
| Web hub | `/app/website-kompis` |

---

## Gaps requiring migration (not created)

1. `list_tenant_public_site_index_pages_for_app` — tenant/role-gated page inventory (title, path, domain, locale, status, last crawled).
2. `app_visible_crawl_run_status` — safe crawl/index status without embeddings/chunks.
3. `website_kompis_public_document_upload_pipeline` — only if product adds public docs (never Bedrift private files).
4. `feedback_to_faq_draft_link_table` — durable link when draft created from feedback.
5. `unanswered_question_inbox` — separate from security rejects / technical errors.

`MIGRATION CREATED/APPLIED = NO`

---

## Tests / gates

| Check | Result |
|-------|--------|
| `npx tsx lib/website-kompis-knowledge/knowledge-center-65.test.ts` | PASS |
| `npm run typecheck` | PASS |
| Frozen `protectedRuntimeFiles` SHA256 | **0 diffs / 46 files** |
| `npm run build` | PASS |
| SQL/migration diff | None |

---

## Changed files

- `app/app/website-kompis/faq/page.tsx`
- `app/app/website-kompis/page.tsx`
- `components/app/website-kompis/WebsiteKompisKnowledgeCenterPanel.tsx`
- `components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx`
- `lib/website-kompis-knowledge/*`
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json`
- `locales/{en,no,sv,da,pl,uk}/customer-app/portalStructure.json`

---

## Owner test after LIVE

1. FAQ / pages / documents clearly separated.
2. Easy to see what Kompis can use today (FAQ live; pages/docs honest unavailable).
3. Draft / published / archived + follow-up signals clear.
4. Job 64 feedback can deep-link into FAQ draft.
5. Nothing auto-publishes.
6. Bedrift documents never shown.
7. No embeddings/chunks/provider details exposed.
8. Public Website Kompis answers unchanged (frozen chain).
9. Design follows APP job 63 direction.

Stop after LIVE report and owner test. Do not freeze automatically.
