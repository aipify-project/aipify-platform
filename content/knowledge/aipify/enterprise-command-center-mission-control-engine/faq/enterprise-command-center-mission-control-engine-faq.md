# Enterprise Command Center & Mission Control — FAQ

## What is Command Center?

Command Center at `/app/command-center` is Aipify's unified operational cockpit and mission control system. It provides real-time visibility across executive command, operations, workforce, revenue, customers, risks, opportunities, and companion activity — without opening twenty different systems.

Phase 418 Mission Control extends Phase 26 presence and notifications with business operations visibility, health scores, attention center, and executive briefing panels.

## How are health scores calculated?

Health scores are tracked in `enterprise_mission_control_health_scores` across seven domains:

- Operational · Financial · Customer · Workforce · Governance · Knowledge · Strategic

The Organization Status Engine aggregates domain scores into organization health and command health scores in `enterprise_mission_control_settings`. Refresh via `refresh_health_scores` action — scores update based on command module status and operational signals.

## How are risks surfaced?

Risks appear in the Risk Command module and mission control feed. Open risks are counted in the command center overview. Escalate risks via `escalate_risk` action — this creates an action-required feed event and audit log entry.

Risk Command cross-links to Strategic Intelligence at `/app/intelligence/strategy#risks`.

## How are opportunities identified?

Opportunities are tracked in the Opportunity Command module with revenue, market, expansion, automation, partner, and strategic categories. Overview metrics show identified and pursuing counts. Companion command advisor signals recommend when strategic opportunities are available.

Opportunity Command cross-links to `/app/intelligence/strategy#opportunities`.

## How do executive briefings work?

Executive briefings in `enterprise_mission_control_briefings` support today, week, month, and quarter periods. Generate via `generate_briefing` action — each briefing includes executive summary, key changes, major risks, major opportunities, and recommended actions.

Distinct from Strategic Intelligence briefings at `/app/intelligence/strategy` — mission control briefings aggregate cross-system operational visibility.

## How does Mission Control operate?

Mission Control provides:

- **Command modules** — eight command surfaces (Executive, Operations, Workforce, Revenue, Customer, Risk, Opportunity, Companion)
- **Mission control feed** — live events, alerts, recommendations, approvals, tasks, incidents, achievements, milestones
- **Attention center** — items requiring action, approval, escalation, or review
- **Companion command advisor** — Aipify recommendations with observation, impact, and next steps

Data is tenant-isolated per organization with permissions `enterprise_command_center_mission_control.view` and `.manage`. Full audit trail in `enterprise_mission_control_audit_logs`.

## Boardroom Dashboard

Organization performance, growth, risk exposure, customer outcomes, workforce utilization, and future outlook — accessible from the mission control overview and boardroom dashboard block in the center RPC.

## What happened? What matters? What should we do next?

The Command Center answers these three questions every morning — Aipify prepares context; executives and operators decide.
