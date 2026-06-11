# Certification & Achievement Engine — FAQ

## What is this engine?

Certification & Achievement Engine is a Customer App engine (Phase A.37) extending Learning & Training (A.36). Dashboard at `/app/certification-achievement-engine`. It issues internal certifications, achievement badges, and team readiness summaries when training requirements are met.

## How does it relate to Learning & Training (A.36)?

Certification requirements link to A.36 learning paths and assessments. Users must complete required training before `issue_user_certification()` succeeds. Eligibility is checked server-side via `_cae_check_eligibility`.

## Who can access it?

All roles can view certifications and badges (`certifications.view`). Owners and administrators can issue, revoke, export, and manage definitions. Managers can issue and export. Server-side RPCs enforce permissions.

## How are certificate dates formatted?

All certificate surfaces use European format **DD.MM.YYYY** — enforced in SQL via `_cae_european_date()` and in the app via `formatEuropeanDate()` in `lib/core/date.ts`.

## Is customer data stored?

Certificate exports contain display name and certificate metadata only — no email content, chat, or payment data. Team readiness shows aggregate counts (e.g. Support 12/15 certified). Audit events via `_mta_create_audit_log` for issue, revoke, and export actions.

## How does PDF export work?

`export_user_certificate()` returns structured JSON with `template_text`, `html_scaffold`, and European-formatted dates. The dashboard download saves this payload for client-side PDF generation in a future phase.

## Is this the same as Partner Certification (Phase 91)?

No. Phase 91 is the external partner ecosystem. Phase A.37 is **internal team certification** for module readiness within a customer organization.
