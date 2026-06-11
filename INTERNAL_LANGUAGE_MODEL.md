# Internal Language Model (ILM)

**Function vocabulary and response guide**

Defines how Aipify describes its own functionality — consistently, professionally, and without implying replacement of employees.

**Source of truth:** `aipify-core/knowledge/internal-language-model/function-vocabulary.txt`

**Code:** `lib/internal-language-model/`

---

## Core philosophy

> Aipify helps people work smarter, faster and with greater confidence.

> People make the important decisions. Aipify helps them make those decisions faster and with better information.

---

## Function vocabulary

| Key | Label |
|-----|-------|
| `aipify` | Platform overview |
| `support_assistant` | Customer support assistance |
| `admin_assistant` | Administrative workflows |
| `knowledge_engine` | Employee Knowledge Engine |
| `business_insights_engine` | Recommendations and trends |
| `continuous_improvement_engine` | Learning and improvement loop |
| `action_center` | Action review and approval |
| `autonomous_execution_framework` | Controlled automation (AEF) |
| `observer_mode` · `assistant_mode` · `operator_mode` · `autonomous_mode` | Execution levels |
| `audit_log` · `approval_flow` · `safety_system` | Governance |

---

## APIs

| Function | Purpose |
|----------|---------|
| `describeAipifyFunction(key)` | Preferred wording for a feature |
| `detectAipifyFeatureIntent(message)` | Natural-language feature questions |
| `getCorePhilosophy()` | Core positioning phrase |

---

## Chat integration

`detectAipifyFeatureIntent()` in `lib/internal-language-model/detection.ts` handles questions like *"What is the Action Center?"* and *"Does Aipify replace support staff?"* using approved vocabulary from the function guide.

---

## Rules

1. Never use avoid phrases: *replaces employees*, *runs your company by itself*.
2. Prefer closing phrases that invite approval or next steps.
3. Augment people — never imply unrestricted autonomous authority.
