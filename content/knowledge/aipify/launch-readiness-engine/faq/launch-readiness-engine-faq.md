# Launch Readiness Engine — FAQ

## What is this engine?

Launch Readiness Engine is a Customer App engine (Phase A.25) with dashboard at `/app/launch-readiness-engine`. Business logic lives in Supabase RPCs.

## Who can access it?

Owners and administrators have full access. Managers and support agents have view access where configured. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (_lre_* helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata only — no PII, email content, chat, or payment data. Audit events via _mta_create_audit_log dual-write.

## How does it integrate with other engines?

Integrates Unonight Pilot (A.15) via unonight_pilot_outcomes checklist item.
