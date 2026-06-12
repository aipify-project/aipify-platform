# Legacy Engine — FAQ

## What is the Legacy Engine?

The Legacy Engine (Phase A.86) preserves, celebrates, and passes forward organizational wisdom through storytelling and milestone recognition. It helps organizations remember why progress mattered.

## How is this different from Organizational Memory Engine (A.34)?

**Organizational Memory A.34** (`/app/organizational-memory-engine`) maintains a decision register and capture hooks. **Legacy Engine A.86** focuses on storytelling, milestone bells, and wisdom preservation — not operational capture workflows.

## How is this different from OME Phase 50?

**OME Phase 50** (`/app/memory`) provides an institutional memory timeline. **Legacy Engine A.86** celebrates meaningful milestones and preserves narrative context — why achievements mattered, not just that they happened.

## How is this different from Impact Engine (A.85)?

**Impact Engine A.85** measures what changed across five outcome dimensions. **Legacy Engine A.86** remembers why it mattered — impact = what changed; legacy = why it mattered. They integrate but serve different purposes.

## What are legacy dimensions?

Four dimensions: **Knowledge** (process evolution, KC origins), **People** (teams, leaders, collaboration), **Customer** (feedback improvements, relationships), **Innovation** (experiments that stuck, bold questions).

## What are legacy stories?

Metadata-only records with dimension, title, summary, and optional timeline_ref. No raw customer conversations, emails, or PII.

## What are legacy milestones?

Records with milestone_key, summary, achieved_at, and celebrated status. Acknowledge via `acknowledge_legacy_milestone(p_milestone_id)` when `legacy_engine.milestones.acknowledge` is granted.

## What are bell milestone examples?

Examples include one year of improvement, 10k interactions, knowledge doubled, and goal achieved — quiet bells for meaningful progress, not activity volume.

## What is Self Love connection?

Pause to recognize progress, challenges, lessons, and gratitude. Celebrating milestones honors human effort — not output-only pressure.

## Who can acknowledge milestones?

`legacy_engine.milestones.acknowledge` is required. Owners, administrators, and managers have this by default.

## What integrations does Legacy Engine use?

Impact Engine A.85, Organizational Memory A.34, OME Phase 50, Purpose & Values, and Growth & Evolution. See integration links on the dashboard.

## Is legacy content truthful?

Yes — legacy stories must be authentic reflection without exaggeration or manufactured nostalgia. Trust note is displayed on the dashboard.
