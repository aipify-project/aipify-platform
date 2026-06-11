# Executive Insights Engine — FAQ

## What is this engine?

Executive Insights Engine is a Customer App engine (Phase A.35) with dashboard at `/app/executive-insights-engine`. It provides tenant-aware executive reporting — organization health, risks, opportunities, and action-oriented summaries aggregated from operational modules.

## Who can access it?

Owners and administrators have full view, export, and schedule access. Managers can view and export reports. Viewers and support agents have read-only view access. Server-side RPCs enforce `executive.view`, `executive.export`, and `executive.schedule` permissions.

## Where does business logic live?

All business logic is in Supabase RPCs (`_eie_*` helpers). API routes and dashboard panels are thin clients.

## Is customer data stored?

Metadata and summary scores only — no PII, email content, chat, orders, or payment data. Reports store aggregated highlights, risk/opportunity metadata, and recommended actions with rationale and urgency.

## How does it integrate with other engines?

Aggregates metadata from Analytics (A.16), Operations Dashboard (A.9), Operations Center (A.32), Customer Success (A.26), Strategic Intelligence (A.31), Quality Guardian (A.13), Governance (A.14), Security & Trust (A.18), and Support AI (A.7). Distinct from Platform Admin `/platform/executive` and the legacy `/app/executive` dashboard.
