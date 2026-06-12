# Purpose & Values Engine — Phase A.82

**Feature owner:** Customer App

Organizational ABOS engine for tenant purpose, stated values, alignment signals, and values-aware reflection prompts.

## Distinctions

- **NOT** Brand Identity & Personhood Standard — Aipify product naming/self-reference
- **NOT** Business DNA Engine (`/app/settings/business-dna`) — products, templates, tone, support knowledge
- **NOT** Strategic Alignment Engine A.55 — strategic initiative alignment snapshots
- **NOT** AI Ethics & Responsible Use Engine — platform ethics governance
- **A.82 Purpose & Values** — tenant **organizational** purpose/values for decision alignment and culture support

## Route

`/app/purpose-values-engine` — nav id `purposeValuesEngine`

## Module

`purpose_values_engine`

## Tables

- `organization_purpose_values_settings` — enabled, purpose_statement, purpose_questions, celebrate_value_aligned_wins, reflection_enabled, metadata
- `organization_stated_values` — value_key, label, description, operational_hints, sort_order, active
- `organization_values_alignment_signals` — value_key, signal_type, summary, alignment_score, metadata
- `organization_values_reflections` — prompt, context_summary, suggested_considerations, status (pending/dismissed/acknowledged)

## Permissions

`purpose_values.view` · `purpose_values.manage` · `purpose_values.values.edit` · `purpose_values.export`

## RPCs

`get_purpose_values_engine_card` · `get_purpose_values_engine_dashboard` · `list_organization_stated_values` · `upsert_organization_stated_value` · `update_purpose_values_settings` · `acknowledge_values_reflection` · `export_purpose_values_report`

## Integrations

Organizational Decision Support (A.54) · Strategic Alignment (A.55) · Trust & Reputation (A.72) · Organizational Health (A.57) · Change Management (A.47) · Goals & OKR (A.65) · [Growth & Evolution (A.81)](./GROWTH_EVOLUTION_ENGINE_PHASE_A81.md)

ABOS **Identity/Culture** pillar. Metadata only. Self Love (A.76 planned) monitors alignment overload.
