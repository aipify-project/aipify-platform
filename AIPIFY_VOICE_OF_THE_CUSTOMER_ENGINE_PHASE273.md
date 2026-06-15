# Aipify — Voice of the Customer Engine (Phase 273)

**Feature owners:** Customer App · Platform Admin · Super Admin  
**Migration:** `20261460000000_voice_of_the_customer_engine_phase273.sql`  
**Module:** `lib/voice-of-the-customer/`

---

## Purpose

Non-intrusive feedback ecosystem capturing ideas, bugs, frustrations, feature requests, and opportunities directly from Aipify users.

**Founding principle:** The people using Aipify every day are one of our greatest sources of innovation. Listen carefully. Improve continuously. Build with customers, not just for customers.

---

## Surfaces

| Surface | Route | Purpose |
|---------|-------|---------|
| Customer Portal | Persistent Share Feedback widget | Submit feedback + view history |
| Platform Admin | `/platform/product/feedback-center` | Feedback operations center |
| Super Admin | `/super/global-insights` | Product intelligence dashboard |

---

## Customer experience

- Subtle lower-left **Share Feedback** entry (desktop and mobile)
- No popups, no forced surveys, no workflow interruption
- Feedback types: Bug · Improvement · Feature · Compliment · Usability · General
- Optional context: page URL, browser, device type
- Acknowledgement without ticket numbers
- **Your feedback history** with transparency statuses
- **Trust & Product Improvement** transparency note with link to `/app/license` — see [AIPIFY_TRUST_PRODUCT_IMPROVEMENT_STATEMENT.md](./AIPIFY_TRUST_PRODUCT_IMPROVEMENT_STATEMENT.md) and [AIPIFY_CUSTOMER_FEEDBACK_PRODUCT_IMPROVEMENT_POLICY.md](./AIPIFY_CUSTOMER_FEEDBACK_PRODUCT_IMPROVEMENT_POLICY.md)

---

## Platform Admin — Feedback Center

Overview: New · Bugs · Feature Requests · Improvements · Resolved · Awaiting Review

Table: Category · Title · Customer · Priority · Submitted · Status · Assigned To · Actions

Statuses: New · Under Review · Planned · In Development · Released · Closed

Actions: View · Assign · Merge · Update Status · Link Phase · Notify Customer

Trend analysis: Top 10 improvement requests, common bugs, frustrations

---

## Super Admin — Global Insights

- Product intelligence from aggregate feedback
- Convert feedback into product initiatives, roadmap items, Cursor phases
- Example recommendation when onboarding themes recur

---

## APIs

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/voice-of-the-customer/submit` | Customer submit |
| GET | `/api/voice-of-the-customer/history` | Customer history |
| GET | `/api/voice-of-the-customer/feedback-center` | Platform center |
| POST | `/api/voice-of-the-customer/feedback-actions` | Platform actions |
| GET/POST | `/api/voice-of-the-customer/global-insights` | Super Admin insights |

---

## Tables

`voc_feedback_submissions` · `voc_product_initiatives` · `voc_feedback_audit_logs`

---

## i18n

- `customerApp.voiceOfCustomer.*`
- `platform.voiceOfCustomer.*` · `platform.nav.feedbackCenter`
- `superAdmin.voiceOfCustomer.*` · `superAdmin.modules.globalInsights`

---

END OF PHASE.
