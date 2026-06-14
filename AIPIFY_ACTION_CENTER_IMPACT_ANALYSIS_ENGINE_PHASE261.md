# Action Center Impact Analysis Engine — Phase 261

## Purpose

Transform the Action Center into a trusted enterprise decision environment. Every important action performed through Aipify should be understandable, reviewable, and safe.

**Feature owner:** Customer App (`/app/action-center`)

## Core principle

No important action should feel mysterious. Aipify should explain itself.

## Questions answered

1. What is about to happen?
2. Why is Aipify recommending this?
3. What systems are affected?
4. What is the business impact?
5. Can this be reversed?

## Supported action types

Support · Automation · Billing · Installation · Governance · Customer · Growth Partner · Workflow Recovery

## Action detail experience

When opening an action, users see:

- **Action summary** — title, status, recommended by, priority
- **Business impact analysis** — expected benefits, time savings, affected teams, customer impact
- **Risk analysis** — risk level, side effects, mitigation
- **Confidence score** — percentage with reasoning
- **Rollback capability** — availability, recovery time, steps
- **Affected systems** — visual relationship list
- **Approval chain** — requested by, approver, escalation path
- **Audit preview** — records that will be created
- **Related actions** — similar actions and success rate
- **Execution timeline** — Review → Approve → Execute → Verify → Monitor → Close
- **Post-execution review** — result, time, unexpected events, business outcome (when completed)

## Architecture

```
supabase/migrations/20261448000000_action_center_impact_analysis_phase261.sql
  get_action_center_impact_analysis(p_action_id)

lib/action-center-impact/
  types.ts · parse.ts · labels.ts

components/shared/action-center-impact/
  ActionImpactAnalysisView.tsx

app/api/aipify/actions/[id]/impact/route.ts
components/app/action-center/ActionCenterPanel.tsx  — wired to impact view
```

## Copywriting

Use business language, not technical jargon:

- ✅ "Customer onboarding process improved"
- ❌ "Database update initiated"

## Empty state

> No actions require review. Aipify continues monitoring the platform.

## i18n

`customerApp.actionCenter.impactAnalysis.*` in en/no/sv/da

## Final principle

Aipify should never ask users to trust blindly. Trust grows through transparency.
