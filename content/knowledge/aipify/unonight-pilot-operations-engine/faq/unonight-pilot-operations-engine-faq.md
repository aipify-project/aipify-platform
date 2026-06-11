# Unonight Pilot Operations Engine — FAQ

## What is the Unonight Pilot Operations Engine?

A tenant-scoped pilot dashboard that validates Support AI, Admin Assistant, Knowledge Center, approval workflows, audit logging, and integration stability with Unonight as the first pilot customer.

## Is Unonight the owner of Aipify?

No. Unonight is a pilot **customer**. Aipify Group AS remains the independent SaaS platform owner. Improvements ship centrally.

## What data does the pilot store?

Counts and metadata only — support case totals, response times, recommendation acceptance rates, milestone status, and feedback summaries (max 500 characters). No raw email, chat, or order content.

## How is pilot health calculated?

Health score aggregates open support cases, failed integrations, pending approvals, open quality checks, milestone progress, and Unonight integration connectivity.

## Which modules are enabled for Unonight?

Admin Assistant, Support AI, Knowledge Center, Audit Log, Operations Dashboard, Governance (approvals), Quality Guardian, and Integration Engine — on the `internal` subscription plan.

## Who can provision the pilot?

Platform administrators or organization owners/administrators with `pilot.configure` permission via `POST /api/pilot/provision`.

## How does this integrate with other A-phase engines?

The dashboard aggregates metadata from A.5–A.13 tables (support cases, admin tasks, knowledge articles, AI actions, integrations, quality checks, self-support, and onboarding) without duplicating business logic.

## Are pilot actions audited?

Yes. Provisioning, module activation, feedback submission, metric recording, milestone updates, and recommendation outcomes extend `_ala_should_audit`.

## Can Platform Admin see customer operational data?

Platform Admin receives aggregates only via `get_platform_unonight_pilot_overview()` with an explicit `privacy_note` — no cross-tenant operational content.
