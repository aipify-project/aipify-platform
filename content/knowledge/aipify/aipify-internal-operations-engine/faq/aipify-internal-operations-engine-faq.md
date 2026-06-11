# Aipify Internal Operations Engine — FAQ

## What is this engine?

Aipify Internal Operations Engine is a Customer App engine (Phase A.24) with dashboard at `/app/aipify-internal-operations-engine`. Business logic lives in Supabase RPCs.

## Who can access it?

Owners and administrators have full access. Managers and support agents have view access where configured. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (_aio_* helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata only — no PII, email content, chat, or payment data. Audit events via _mta_create_audit_log dual-write.

## How does it integrate with other engines?

Provisions Aipify Group AS (companies.is_platform = true). Dogfoods A.6–A.20 modules. Distinct from Platform Admin UI.
