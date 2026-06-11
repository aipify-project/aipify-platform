# Organizational Memory Engine — FAQ

## What is this engine?

Organizational Memory Engine is a Customer App engine (Phase A.34) with dashboard at `/app/organizational-memory-engine`. It preserves operational wisdom — decisions, incidents, support learnings, and process improvements — as metadata summaries with human-governed retention.

## How is this different from PAME and the Learning Engine?

**PAME** (`/app/assistant/memory`) stores personal assistant memories for individual users. **Learning Engine** (`/app/learning`) improves how Aipify behaves. Organizational Memory stores **tenant-level** operational knowledge with visibility controls and scheduled reviews. None store raw chat or email content.

## Who can access it?

Owners and administrators have full create, edit, archive, and review access. Managers can view, create, edit, and schedule reviews. Support agents can view and create. Viewers have read-only access. Server-side RPCs enforce `memory.*` permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (`_ome_*` helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata summaries only (max 500 characters per summary). `detailed_context` is structured JSONB — never raw PII, email content, or chat transcripts. Audit events via `_mta_create_audit_log` for creation, updates, archival, visibility changes, and reviews.
