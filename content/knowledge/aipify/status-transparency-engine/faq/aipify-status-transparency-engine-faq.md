# Status & Transparency Engine — FAQ

## What is this engine?

Status & Transparency Engine is a Customer App engine (Phase A.27) with dashboard at `/app/status-transparency-engine`. It provides public and internal status communication — distinct from technical observability (A.19).

## Who can access it?

Owners and administrators can manage settings. Managers can publish incidents. All roles can view status where configured. Server-side RPCs enforce permissions (`status.view`, `status.manage`, `incidents.publish`, `maintenance.manage`).

## Where does business logic live?

All business logic is in Supabase RPCs (`_ste_*` helpers). API routes at `/api/status/*` and dashboard panels are thin clients.

## Is customer data stored?

Incident titles and status metadata only — no PII, email content, chat, or payment data. Public status is available at `/api/status/public`.

## How does it integrate with other engines?

Complements Observability & Platform Health Engine (A.19). Optional auto-publish from observability is configurable. Critical status may bypass quiet hours when enabled.
