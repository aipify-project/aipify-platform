# Organizational Resilience Engine FAQ

## FAQ 1

**Question:** What is the Organizational Resilience Engine?

**Answer:** The Organizational Resilience Engine helps organizations prepare for operational disruptions with scenario-based continuity plans, simulations, vulnerability tracking, and structured reviews. It supports preparedness, role clarity, structured recovery, and continuous learning — humans approve active plans; Aipify structures the workflow.

## FAQ 2

**Question:** What scenario types are supported?

**Answer:** Plans cover critical employee absence, support backlog, supplier disruption, integration failure, operational incident, and rapid growth. Each plan stores continuity requirements as metadata: critical processes, roles, fallback procedures, escalation contacts, and recovery priorities.

## FAQ 3

**Question:** How do simulations and reviews work?

**Answer:** Teams record tabletop exercises, walkthroughs, recovery reviews, and lessons-learned sessions via `record_resilience_simulation()`. Plan reviews use `complete_resilience_review()` with optional organizational memory capture — metadata only, never raw operational records. Every action is audited via `_ore_log()`.

## FAQ 4

**Question:** Who can manage and approve resilience plans?

**Answer:** Viewing requires `resilience.view`. Creating plans and recording simulations requires `resilience.manage`. Reviews and vulnerability tracking require `resilience.review`. Activating plans requires `resilience.approve`. Owners and administrators typically hold full permissions; managers may manage and review without approve.
