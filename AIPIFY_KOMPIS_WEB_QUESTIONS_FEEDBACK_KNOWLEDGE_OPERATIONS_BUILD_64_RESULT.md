# AIPIFY – KOMPIS WEB QUESTIONS, FEEDBACK & KNOWLEDGE OPERATIONS BUILD 64 — RESULT

**Branch:** `feature/kompis-web-questions-feedback-knowledge-ops-64`  
**Feature commit:** _(filled after commit)_  
**PR:** _(filled after open)_  
**Merge SHA:** _(filled after merge)_  
**APP project:** `aipify-platform` (`prj_tPgcqwgUAAkGvBy802arVXVYf1fv`)  
**Deployment ID:** _(filled after deploy)_  
**Canonical domain:** `app.aipify.ai`

| Gate | Result |
|------|--------|
| `READY FOR OWNER APP FUNCTION TEST` | **YES** (after LIVE; authenticated list QA may be BLOCKED) |
| `SAFE TO FREEZE KOMPIS WEB OPERATIONS` | **NO** |
| `MIGRATION CREATED/APPLIED` | **NO** |
| Auth preserved | **YES** |
| `/app/kompis` preserved | **YES** |
| Old APP Companion absent | **YES** |
| Frozen Website Kompis files/hashes/runtime diff | **0** |

---

## What shipped (within existing schema)

Canonical route remains **`/app/website-kompis/feedback`** (`kompisWebQa`).

1. **Operations workspace** — filters (vote/comment/query/locale/page) with URL state, review queue for not-helpful, detail drawer, job-63 card styling, honest scope notes.
2. **Dashboard KPIs** — Web hub loads the same overview totals + quick actions (review negative, FAQ, connection).
3. **FAQ suggest deep link** — `?suggestQuestion=&suggestLocale=&fromFeedback=1` opens FAQ draft with warning (no auto-publish; answer not prefilled as truth).
4. **Presentation/privacy model** — `lib/website-kompis-feedback/operations-model.ts` field matrix + unsupported list.
5. **i18n** — expanded `customerApp.websiteKompisFeedback.*` in en/no/sv/da/pl/uk.

No frozen Website Kompis runtime edits. No SQL/migration.

---

## Data / privacy matrix (APP-visible today)

| Field | Source | Owner visible | Notes |
|-------|--------|---------------|-------|
| Feedback id | `website_kompis_answer_feedback.id` | Yes | Overview RPC |
| Vote | helpful / not_helpful | Yes | |
| Comment | free text (optional) | Yes | No structured reason codes |
| Question/answer preview | receipt left(180/220) | Yes | Full text needs detail RPC |
| Page path / locale / time | receipt | Yes | |
| Sources / citations | receipt.sources jsonb | **No** | Stored but not returned by overview |
| visitor_key_hash | feedback | **No** | Never exposed |
| System prompt / provider payload | n/a | **No** | Not on receipts |

Tenant gate: `get_website_kompis_answer_feedback_overview` → `_wpkf_auth_tenant_id()` + owner/admin.

---

## Gaps requiring migration (not created)

Minimal plan for a future approved migration (do not apply in job 64):

1. **`get_website_kompis_answer_receipt_detail(p_answer_id)`** — full question/answer, safe sources (title/route), domain; tenant+role checks; no visitor hash.
2. **Extend overview** — return `answer_id`, optional cursor (`created_at,id`), server filters (vote, locale, domain, pathname, q).
3. **`list_website_kompis_answer_receipts`** — all receipts (not only rows with feedback), newest first, cursor pagination.
4. **Optional `reason_code`** on feedback — structured negative reasons; public write path must stay outside frozen chain or use additive non-frozen API only with separate approval.
5. **Owner review state** — `review_status` / `reviewed_at` / `review_disposition` on feedback (evidence only; never auto-edit FAQ).
6. **Ask outcome telemetry** (separate from receipts) — unanswered / security_reject / technical_error with explicit status enum so security rejects never mix into knowledge gaps.

`MIGRATION CREATED/APPLIED = NO`

---

## Definitions (current data)

| Concept | Current support |
|---------|-----------------|
| Answered with feedback | Yes — overview recent |
| Helpful / not helpful | Yes — vote |
| Unanswered | **Not listed** — receipts only when an answer was stored |
| Security reject | **Not in this dataset** — explicitly not treated as knowledge gap |
| Technical error | **Not in this dataset** |
| Knowledge gap queue | Approximation: not_helpful (+ comment prioritized) |

---

## Changed files

- `lib/website-kompis-feedback/operations-model.ts` (new)
- `lib/website-kompis-feedback/operations-model-64.test.ts` (new)
- `lib/website-kompis-feedback/labels.ts`
- `components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx`
- `components/app/website-kompis/WebsiteKompisFaqAdminPanel.tsx`
- `app/app/website-kompis/feedback/page.tsx`
- `app/app/website-kompis/faq/page.tsx`
- `app/app/website-kompis/page.tsx`
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json`

---

## Gates

| Check | Result |
|-------|--------|
| operations-model-64 + labels tests | PASS |
| Jobs 57 / 61 / 63 contracts | PASS |
| `tsc --noEmit` | PASS |
| `npm run build` | PASS |
| Frozen WK SHA256 | MATCH |
| Authenticated browser QA | **BLOCKED** |

---

**SAFE TO FREEZE KOMPIS WEB OPERATIONS = NO**
