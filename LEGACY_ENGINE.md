# Legacy Engine (ABOS)

**Feature owner:** Customer App

Preserve, celebrate, and pass forward organizational wisdom — storytelling, milestone recognition, and authentic reflection.

## Philosophy

Organizations are stories — lessons, challenges, innovations, and support form legacy.

## Mission

Protect organizational wisdom for future employees, customers, and leaders.

## ABOS principle

Remembering why progress mattered.

## Vision

We built something meaningful.

## Distinctions

- **NOT** Organizational Memory A.34 (`/app/organizational-memory-engine`) — decision register, capture hooks
- **NOT** OME Phase 50 (`/app/memory`) — institutional memory timeline
- **NOT** Impact Engine A.85 (`/app/impact-engine`) — outcome measurement (integrates)
- **ABOS Legacy Engine** — storytelling, milestone recognition, wisdom preservation

## Route

`/app/legacy-engine` — nav id `legacyEngine`

## Module

`legacy_engine`

## Tables

- `organization_legacy_engine_settings` — enabled, celebrate_milestones, preserve_stories, metadata
- `organization_legacy_stories` — dimension, title, summary, timeline_ref, metadata
- `organization_legacy_milestones` — milestone_key, summary, achieved_at, celebrated, metadata

## Permissions

`legacy_engine.view` · `legacy_engine.manage` · `legacy_engine.export` · `legacy_engine.milestones.acknowledge`

## RPCs

`get_legacy_engine_card` · `get_legacy_engine_dashboard` · `update_legacy_engine_settings` · `acknowledge_legacy_milestone` · `export_legacy_engine_report`

## Legacy dimensions

Knowledge · People · Customer · Innovation

## Integrations

Impact Engine A.85 · Organizational Memory A.34 · OME Phase 50 · Purpose & Values · Growth & Evolution

Metadata only — truthful, authentic reflection; no exaggeration or raw PII.
