# Aipify Skill Engine

**Phase 16 · Version 1.0 · Critical**

Aipify is built from **skills** — reusable, well-defined capabilities — not disconnected features. **Every future capability must be implemented as a skill.**

**Prerequisites:** [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) · [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

**Code:** `lib/core/skills/` · Central registry: `SKILL_REGISTRY` in `lib/core/skills/registry.ts`

---

## 1. Purpose

The Skill Engine defines for each capability:

- What Aipify can do
- Required permissions
- Plan availability
- Permitted data access
- Approval requirements
- Learning behaviour

---

## 2. Categories

| Category | Purpose |
|----------|---------|
| **Operational** | Run the business efficiently (core) |
| **Customer** | Assist customers; escalation required |
| **Executive** | Support leaders in business language |
| **Installation** | Understand customer environments |
| **Companion** | Optional human-friendly interactions (off by default) |
| **Future** | Planned modular skills (marketplace prep) |

---

## 3–7. Initial skills

Registered in `lib/core/skills/` by category:

- **Operational (10):** support-assistant, presence-engine, executive-briefings, knowledge-assistant, health-monitoring, recommendations-engine, action-engine, self-healing-engine, billing-monitoring, installation-monitoring
- **Customer (6):** faq-assistant, onboarding-assistant, invoice-explanation-assistant, escalation-assistant, customer-support-assistant, installation-guide-assistant
- **Executive (6):** priority-recommendations, risk-identification, opportunity-detection, weekly-executive-summaries, monthly-executive-reports, approval-insights
- **Installation (7):** workflow-discovery, integration-detection, domain-validation, health-scanning, system-mapping, configuration-assessment, improvement-recommendations
- **Companion (1):** companion (disabled by default)
- **Future (3):** marketing-assistant, commerce-assistant, recruitment-assistant (planned)

---

## 8–10. Skill definition & metadata

Each skill exports a `SkillDefinition` (`lib/core/skills/types.ts`):

`id` · `name` · `category` · `description` · `purpose` · `dataSources` · `permissionsRequired` · `approvalRequirements` · `learningBehaviour` · `tenantIsolation` · `escalationRules` · `rollbackSupport` · `ownerTeam` · `status` · `enabledByDefault` · `requiresApproval` · `supportsLearning` · `requiresInstallation` · `minimumPlan` · `core` · `tenantScoped` · `version` · `layers` · `releaseStage`

---

## 11. Skill states

`active` · `disabled` · `beta` · `internal_only` · `deprecated` · `planned`

Platform administrators manage global availability via `/platform/skills`.

---

## 12. Plan requirements

| Plan | Skills |
|------|--------|
| **Starter** | Core operational skills |
| **Growth** | Starter + expanded recommendations, action engine |
| **Business** | Growth + self-healing + advanced executive skills |
| **Enterprise** | Business + custom / dedicated intelligence skills |

Use `isSkillAvailableForPlan(skillId, plan)` from the registry.

---

## 13. Internal validation pipeline

```
Aipify Internal → Unonight Pilot → Limited Rollout → General Availability
```

No skill bypasses this process (`SKILL_RELEASE_PIPELINE` in `governance.ts`).

---

## 14–15. Learning & action rules

- Learning: operational metadata only; sensitive data prohibited; global learning anonymised
- Action-capable skills: risk classification, approval policies, verification, rollback, execution logging (`actionCapable: true`)

---

## 16. Marketplace preparation (architecture only)

`getTenantSkillCatalog(plan)` and `getDefaultTenantSkillStates(plan)` prepare enable/disable semantics. **No public marketplace UI in this phase.**

---

## 17–18. Governance & architecture

Before new skills: answer `SKILL_GOVERNANCE_QUESTIONS` in `governance.ts` and place per [CORE_FOUNDATION.md §21](./CORE_FOUNDATION.md#21-skill-placement-rules):

| Layer | Role |
|-------|------|
| Platform Admin | Governance, global enablement, testing |
| Customer App | Consumption, configuration, insights |
| Embedded | Execution, context, assistance |

---

## 19–20. Vision & success

Skills expand what Aipify can do without changing who Aipify is. When complete:

- Capabilities are structured and consistent
- New ideas have a framework
- Operational complexity stays manageable
- Aipify scales without chaos

---

## Final principle

> **Features create software. Skills create intelligence. Aipify should be built from skills — not from random functionality.**

---

## References

| Document | Purpose |
|----------|---------|
| `docs/cursor/AIPIFY-SKILL-ENGINE-PHASE16.txt` | Phase spec |
| `docs/cursor/AIPIFY-SKILL-PLACEMENT-RULES.txt` | Layer placement |
| `lib/core/skills/registry.ts` | Central registry API |
