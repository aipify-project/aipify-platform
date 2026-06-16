# Action Center Strategic Initiative Portfolio Engine — Phase 264

## Purpose

Create a strategic initiative portfolio layer connecting approved actions, execution progress, business priorities, and executive goals into one clear overview.

**Feature owner:** Customer App (`/app/action-center` — Strategic Portfolio tab)

## Strategic Initiative Portfolio

Fourth tab alongside Impact Analysis (261), Approvals & Delegation (262), and Execution Coordination (263).

## Features

1. **Initiative portfolio dashboard** — active, awaiting approval, in execution, blocked, completed, cancelled, executive priority
2. **Initiative categories** — 10 strategic categories
3. **Strategic alignment** — business goal, department, sponsor, alignment score, value, confidence
4. **Portfolio health** — on track, at risk, blocked, overdue, completed
5. **Executive priority view** — top strategic, highest risk/value, delayed, executive decisions
6. **Initiative details** — full detail with linked actions, approvals, risks, dependencies
7. **Portfolio risk analysis** — concentration, blockers, missing owners, unclear outcomes, low confidence
8. **Resource awareness** — teams, roles, workload, capacity concerns
9. **Decision support** — why it matters, success/failure/delay scenarios, stakeholders, decision needed
10. **Learning loop** — post-completion via `initiative_learning` events
11. **Knowledge Center FAQ**
12. **i18n** — en, no, sv, da, es, pl, uk

## Architecture

```
supabase/migrations/20261452000000_action_center_strategic_initiative_portfolio_phase264.sql
lib/action-center-portfolio/
app/api/aipify/action-center/portfolio/route.ts
app/api/aipify/actions/[id]/portfolio/route.ts
app/api/aipify/actions/[id]/portfolio/learning/route.ts
components/shared/action-center-portfolio/
```

## Principle

Aipify supports strategic decisions. Humans retain responsibility and authority.
