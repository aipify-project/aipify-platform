# Module Marketplace Foundation Engine — FAQ

## What is this engine?

Module Marketplace Foundation Engine is a Customer App engine (Phase A.23) with dashboard at `/app/module-marketplace-foundation-engine`. Business logic lives in Supabase RPCs.

## Who can access it?

Owners and administrators have full access. Managers and support agents have view access where configured. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (_mmf_* helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata only — no PII, email content, chat, or payment data. Audit events via _mta_create_audit_log dual-write.

## How does it integrate with other engines?

Extends tenant_modules and commercial packages — syncs activation via _mmf_sync_tenant_module().
