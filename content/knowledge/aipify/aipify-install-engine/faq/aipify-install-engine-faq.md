# Aipify Install Engine — FAQ

## What is this engine?

Aipify Install Engine is a Customer App engine (Phase A.22) with dashboard at `/app/aipify-install-engine`. Business logic lives in Supabase RPCs.

## Who can access it?

Owners and administrators have full access. Managers and support agents have view access where configured. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (_ain_* helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata only — no PII, email content, chat, or payment data. Audit events via _mta_create_audit_log dual-write.

## How does it integrate with other engines?

Extends Install Engine (Phase 17) — lib/install/, /api/install/, /app/install. KC initialization on completion.
