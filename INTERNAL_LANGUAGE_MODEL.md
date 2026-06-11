# Internal Language Model (ILM)

**Function vocabulary, command wording, and natural business language**

Defines how Aipify describes its own functionality and understands how people naturally communicate at work — consistently, professionally, and without implying replacement of employees.

**Source of truth:**

- `aipify-core/knowledge/internal-language-model/function-vocabulary.txt` — feature descriptions
- `aipify-core/knowledge/internal-language-model/user-command-wording.txt` — explicit commands and safe action language
- `aipify-core/knowledge/internal-language-model/natural-business-language-engine.txt` — human work language (NBLE)
- `aipify-core/knowledge/internal-language-model/business-phrase-dataset.txt` — expanded business phrase dataset
- `aipify-core/knowledge/internal-language-model/proactive-guidance-language.txt` — proactive assistance and gentle guidance

**Code:** `lib/internal-language-model/`

---

## Core philosophy

> Aipify helps people work smarter, faster and with greater confidence.

> People make the important decisions. Aipify helps them make those decisions faster and with better information.

**NBLE vision:** People speak naturally. Aipify understands responsibly. Humans remain in control.

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

## User command wording

| Command key | Example |
|-------------|---------|
| `email_overview` | *Open my email and create an overview* |
| `email_tasks` | *Create tasks from my emails* |
| `calendar_availability` | *Check my calendar and find a time* |
| `support_priority` | *Check today's support cases* |
| `sales_follow_up` | *Look at my leads and make a follow-up plan* |
| `bulk_approve` | *Approve everything Aipify suggested* |
| `automation_rule` | *Let Aipify handle this automatically from now on* |

Action flow: **Understand → Prepare → Approve → Execute**

---

## Natural Business Language Engine (NBLE)

Recognizes vague, emotional, and everyday work language — not just explicit commands.

| Domain | Example phrase |
|--------|----------------|
| `email` | *I've fallen behind on emails* · *What do I need to answer today?* |
| `calendar` | *When do I have time?* · *Prepare me for today's meetings* |
| `task_management` | *I'm overwhelmed* · *Get me back on track* |
| `support` | *What's burning right now?* · *Who needs help first?* |
| `sales` | *Who should I call?* · *What deals are slipping away?* |
| `action_center` | *Show me what needs approval* · *Can we automate this?* |
| `emotional` | *I'm stressed* · *I don't know where to start* |

**Expanded business phrase dataset** — executive, retail, marketing, accounting, HR, project management, admin, productivity, and Aipify-specific phrasing (40+ intents). Append new phrases to `business-phrase-dataset.txt` and `business-phrase-vocabulary.ts`.

| Domain | Example phrase |
|--------|----------------|
| `executive` | *Give me the big picture* · *Anything I should be worried about?* |
| `retail` | *What's selling best?* · *Are customers abandoning their carts?* |
| `marketing` | *What's working?* · *What should we test next?* |
| `accounting` | *Have we been paid?* · *What's overdue?* |
| `hr` | *How is everyone doing?* · *Who's overloaded?* |
| `project_management` | *Are we on track?* · *What slipped through the cracks?* |
| `admin` | *What happened while I was away?* · *What's my day looking like?* |
| `productivity` | *Help me get organized* · *I'm drowning* |
| `aipify_specific` | *What would you do?* · *Make sure this doesn't happen again* |

**Industry normalization:** `normalizeBusinessConcept()` maps lead/prospect/opportunity, ticket/case/request, customer/client/member, etc. to canonical concepts.

**Safety:** Understanding ≠ permission. Preparing ≠ approval. Execution stays within approved boundaries.

---

## Proactive guidance

Observes, informs, recommends — humans decide. Used when Aipify detects risk, overload, unusual activity, or automation concerns.

| Domain | Scenario example |
|--------|------------------|
| `email` | Unreviewed attachments · emotional reply · large recipient list |
| `calendar` | Overlapping meetings · no prep time |
| `support` | Backlog increasing · VIP customers waiting |
| `sales` | Neglected lead · low-value focus |
| `workload` | Task overload · frequent rescheduling · burnout risk |
| `financial` | Overdue invoices · spending trends |
| `project` | Behind schedule · unclear ownership |
| `security` | Sensitive action · elevated permissions |
| `automation` | Sensitive workflow · scope too broad |
| `autonomy` | User continues · approval required · action prohibited |

Never use: *You're doing this wrong* · *That's a bad idea*. Prefer observational framing: *It appears...* · *There may be factors worth considering.*

---

## APIs

| Function | Purpose |
|----------|---------|
| `describeAipifyFunction(key)` | Preferred wording for a feature |
| `detectAipifyFeatureIntent(message)` | Natural-language feature questions |
| `detectUserCommandIntent(message)` | Explicit action commands with risk-aware responses |
| `detectNaturalBusinessIntent(message)` | NBLE + expanded business phrase intent (priority-scored) |
| `getUserCommandVocabulary(key)` | Command intent, risk level, integration |
| `getNaturalBusinessVocabulary(key)` | NBLE phrase, meanings, safe response |
| `getBusinessPhraseVocabulary(key)` | Expanded phrase entry by intent key |
| `findBusinessPhraseMatch(message)` | Match expanded phrase only |
| `getProactiveGuidance(scenarioKey)` | Gentle guidance for system-detected scenarios |
| `detectProactiveGuidanceCue(message)` | Risky user expressions needing intervention |
| `getProactiveGuidanceVocabulary(key)` | Scenario, response, consequence, safer alternative |
| `normalizeBusinessConcept(term)` | Industry synonym → canonical concept |
| `getCorePhilosophy()` | Core positioning phrase |
| `getNbleVision()` | NBLE long-term vision phrase |

---

## Chat integration

Detection order in `buildAssistantTurn()`:

1. `detectUserCommandIntent()` — explicit commands (email, calendar, support, sales, approval, automation)
2. `detectProactiveGuidanceCue()` — risky expressions needing gentle intervention
3. `detectNaturalBusinessIntent()` — natural/vague/emotional language
4. `detectAipifyFeatureIntent()` — *"What is the Action Center?"* and replacement questions

Other modules (Action Center, AEF, support ops) call `getProactiveGuidance(scenarioKey)` when system observations trigger a scenario.

---

## Rules

1. Never use avoid phrases: *replaces employees*, *runs your company by itself*.
2. Prefer closing phrases that invite approval or next steps.
3. Augment people — never imply unrestricted autonomous authority.
4. NBLE is not a static FAQ — it improves intent recognition across all assistant modules.
