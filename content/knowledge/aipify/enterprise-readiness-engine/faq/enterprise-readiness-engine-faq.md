# Enterprise Readiness Engine — FAQ

## What is this engine?

Enterprise Readiness Engine is a Customer App engine (Phase A.30) with dashboard at `/app/enterprise-readiness-engine`. It provides tenant-aware enterprise controls, governance, delegated administration, and deployment readiness hooks.

## Who can access it?

Owners and administrators have full manage and export access. Managers can view and export reports. Viewers have read-only access. Emergency approval overrides require `enterprise.override` (owners only). Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (`_ere_*` helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata and summary scores only — no PII, email content, chat, or payment data. Audit events via `_mta_create_audit_log` dual-write for delegated admin assignments, approval overrides, setting changes, and exports.

## How does it integrate with other engines?

Integrates Governance & Policy Engine (A.14), Deployment & Environment Management (A.20), and Enterprise Deployment Framework (Phase 92 at `/app/enterprise`). Level 4 critical actions remain prohibited for AI.
