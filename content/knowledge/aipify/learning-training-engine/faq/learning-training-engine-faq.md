# Learning & Training Engine — FAQ

## What is this engine?

Learning & Training Engine is a Customer App engine (Phase A.36) with dashboard at `/app/learning-training-engine`. It provides self-paced education paths for Aipify module adoption — role-specific training, knowledge checks, and completion tracking.

## How is this different from the Learning Engine?

Phase 29 Learning Engine (`/app/learning`) stores `customer_learning_memory` so Aipify learns WITH the customer. Phase A.36 is **user education only** — it trains people on how to use Aipify modules. It does not store AI learning memory or operational patterns.

## Who can access it?

All roles can view assigned paths (`learning_training.view`). Owners and administrators can assign, manage paths, and review team readiness. Managers can view and review aggregates. Server-side RPCs enforce permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (`_lte_*` helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata and Knowledge Center article references only — no PII, email content, chat, or payment data. Team readiness shows aggregate counts and completion rates. Audit events via `_mta_create_audit_log` for assignments, completions, assessment outcomes, and path updates.
