# AIPIFY.KOMPIS.CORE.ANSWER.FEEDBACK.COPY.V1 — RESULT

## Status summary

| Gate | Status |
| --- | --- |
| COPY LIVE | Ready in Core UI (clipboard path); deploy with PR merge |
| FEEDBACK PERSISTENCE VERIFIED | Not verified in Production — migration proposed, SQL APPLY not authorized |
| CUSTOMER OVERVIEW VERIFIED | Code + APP route ready; live data requires applied schema |
| Answer reuse | **OFF** (application-enforced) |

## Scope

Core-only Website Kompis answer actions: thumbs up/down + copy under each finished assistant answer, tenant-bound feedback storage (proposal), Customer APP overview at `/app/website-kompis/feedback`.

No Host/UnoNight changes. No Social Media Pack. No retrieval rewrite. No SQL APPLY.

## Storage model

- Tables: `website_kompis_answer_receipts`, `website_kompis_answer_feedback`
- RPCs: `create_website_kompis_answer_receipt`, `record_website_kompis_answer_feedback`, `get_website_kompis_answer_feedback_overview`
- Trust: `_wpkf_resolve_visitor_context(install, domain)` — client cannot choose arbitrary tenant
- Visitor binding: sessionStorage visitor key → SHA-256 hash server-side
- Idempotent per `(answer_id, visitor_key_hash)`; vote update/clear supported
- Rate limit: 40 feedback mutations / visitor hash / hour
- RLS deny-all; service_role for public writes; authenticated owner/admin for overview

## Migration (proposal only — not applied)

- File: `supabase/migrations/20261937900000_website_kompis_answer_feedback_v1.sql`
- SHA256: `81f347c1aa2dd7a0cc7c94275fb26ebe0e924cd81498bb6f3667d5655a3d9490`

## Fail-closed behavior (schema unapplied)

- Ask may return `feedbackPersistenceReady: false` / no `answerId`
- Vote buttons are **hidden** until an `answerId` is present
- Copy remains available independently
- Overview shows honest “storage not ready” state; never fake “saved”

## Reuse / quality gates

- `websiteKompisAnswerReuseEnabled()` → `false`
- `websiteKompisFeedbackAffectsAnswerReadPath()` → `false`
- `helpfulVoteIsCanonicalTruth()` → `false`
- `evaluateWebsiteKompisReuseCandidate()` always rejects; requires same tenant/install/locale/topic, published sources, matching versions, freshness, and still refuses helpful-vote-alone

Next step after SQL APPLY: wire candidate status only; keep automatic reuse OFF until source-control + freshness gates are product-approved.

## Key files

- `lib/marketing/website-kompis-answer-feedback.ts`
- `lib/marketing/website-kompis-answer-feedback-server.ts`
- `lib/marketing/website-kompis-answer-feedback-attach.ts`
- `lib/marketing/website-kompis-visitor-key.ts`
- `app/api/marketing/companion/ask/route.ts`
- `app/api/marketing/companion/answer-feedback/route.ts`
- `app/api/website-kompis/feedback/route.ts`
- `components/embed/WebsiteKompisAnswerActions.tsx`
- `components/embed/WebsiteKompisEmbedWidget.tsx`
- `app/app/website-kompis/feedback/page.tsx`
- `components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel.tsx`
- `locales/{en,no,sv,da,pl,uk}/customer-app/core.json` (`websiteKompisFeedback`)

## Tests run

- `npx tsx lib/marketing/website-kompis-answer-feedback.test.ts`
- `npx tsx lib/marketing/website-kompis-visitor-tone.test.ts`
- `npx tsx lib/website-kompis-faq/labels.test.ts`
- `npx tsx lib/website-kompis-feedback/labels.test.ts`
- `npx tsc --noEmit -p tsconfig.json`

## Host confirmation

No Host repository changes in this job.

## Remaining gate

Authorize and APPLY `20261937900000_website_kompis_answer_feedback_v1.sql`, then verify:

1. Ask returns `answerId`
2. 👍 / 👎 persist and appear in `/app/website-kompis/feedback`
3. Duplicate vote does not create a second row
4. Tenant A cannot read Tenant B feedback
