# Curiosity & Discovery Engine (ABOS)

**Feature owner:** Customer App

Inspire exploration, learning, and innovation — stay curious when successful.

## Philosophy

The future belongs to curious organizations — questions matter more than immediate answers.

## Mission

Discover better ways of working, learning, and creating value.

## ABOS principle

Answers solve today; curiosity creates tomorrow.

## Vision

What if?

## Distinctions

- **NOT** Learning Engine (`/app/learning`) — customer learning memory
- **NOT** Innovation & Impact A.28 (`/app/innovation-impact-engine`) — case studies/baselines
- **NOT** Innovation Experimentation phases — formal experiments governance
- **NOT** Growth & Evolution A.81 (`/app/growth-evolution-engine`) — growth orchestration (integrates)
- **ABOS Curiosity & Discovery Engine** — exploration prompts, discovery categories, question-led culture

## Route

`/app/curiosity-discovery-engine` — nav id `curiosityDiscoveryEngine`

## Module

`curiosity_discovery_engine`

## Tables

- `organization_curiosity_discovery_engine_settings` — enabled, encourage_experimentation, prompt_cadence, metadata
- `organization_discovery_prompts` — category, prompt, context_summary, status, metadata
- `organization_discovery_signals` — category, summary, confidence, metadata

## Permissions

`curiosity_discovery.view` · `curiosity_discovery.manage` · `curiosity_discovery.export` · `curiosity_discovery.prompts.explore`

## RPCs

`get_curiosity_discovery_engine_card` · `get_curiosity_discovery_engine_dashboard` · `update_curiosity_discovery_engine_settings` · `explore_discovery_prompt` · `dismiss_discovery_prompt` · `export_curiosity_discovery_engine_report`

## Discovery categories

Operational · Customer · Knowledge · Innovation · Human

## Integrations

Learning Engine · Innovation & Impact A.28 · Growth & Evolution A.81 · Continuous Improvement · Legacy Engine A.86

Metadata only — questions welcomed; mistakes become lessons; no raw PII.
