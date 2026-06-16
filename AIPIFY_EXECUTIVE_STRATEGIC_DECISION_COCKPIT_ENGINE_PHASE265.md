# Executive Strategic Decision Cockpit Engine — Phase 265

## Purpose

Provide leaders with a real-time overview of critical decisions, organizational health, strategic execution, and emerging risks — without searching through multiple modules.

**Feature owner:** Customer App (`/app/executive/strategic-decision-cockpit`)

## Executive Strategic Decision Cockpit

Integrated with Action Center (Impact, Approvals, Execution, Portfolio) via shared `aipify_actions` and audit logs.

## Features

1. **Executive overview dashboard** — initiatives on/off track, critical decisions, opportunities, escalations, health, action queue
2. **Decision queue** — Critical → Informational with owner, approvers, impact, risk, deadline, next step
3. **Organization health summary** — 7 indicators with Excellent → Critical statuses
4. **Executive alerts** — delays, compliance, risks, approvals, opportunities, capacity
5. **Strategic opportunity center** — revenue, cost, partnership, process, expansion, innovation
6. **Executive decision briefings** — situation, context, recommendation, benefits, risks, alternatives, confidence, urgency
7. **Executive meeting mode** — topics, approvals, blockers, achievements, risks, agenda, follow-ups
8. **Cross-organizational insights** — departments, initiatives, trends, emerging issues
9. **Decision history** — immutable audit from `aipify_action_logs`
10. **Learning engine** — accuracy, bottlenecks, intervention effectiveness, success patterns
11. **Knowledge Center FAQ**
12. **i18n** — en, no, sv, da, es, pl, uk

## Architecture

```
supabase/migrations/20261453000000_executive_strategic_decision_cockpit_phase265.sql
lib/executive-strategic-decision-cockpit/
app/api/executive/strategic-decision-cockpit/route.ts
app/api/executive/strategic-decision-cockpit/briefing/[id]/route.ts
components/app/executive/StrategicDecisionCockpitPanel.tsx
app/app/executive/strategic-decision-cockpit/page.tsx
```

## Principle

Aipify supports executives. Executives remain accountable for organizational decisions.
