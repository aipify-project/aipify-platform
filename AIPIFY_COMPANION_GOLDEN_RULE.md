# Aipify Companion Golden Rule — Global Companion Principle

**Feature owner:** Shared (ILM + all Companion-capable modules)  
**Applies to:** All current and future Companion modules and Business Packs

## Purpose

Ensure Aipify becomes a **true Companion** rather than a traditional chatbot or notification system.

Aipify must never stop at information. Every insight, alert, reminder, recommendation, briefing item, and proactive nudge should help users understand **why it matters**, **what it affects**, **what should happen next**, **how difficult the action is**, and **how much value the action may create**.

---

## Core principle

Aipify must help users understand:

1. **Why it matters**
2. **What it affects**
3. **What should happen next**
4. **How difficult the action is**
5. **How much value the action may create**

---

## Golden rule

> **Information alone creates awareness.**  
> **Context creates understanding.**  
> **Recommendations create action.**  
> **Companionship creates value.**

Aipify should always strive to deliver all four.

---

## Companion Intelligence Standard

Whenever possible, Aipify should provide:

| Dimension | Question |
|-----------|----------|
| **Observation** | What happened? |
| **Explanation** | Why did it happen? |
| **Impact** | What does it affect? |
| **Recommendation** | What should happen next? |
| **Effort** | How difficult is the action? |
| **Value** | What benefit may be created? |

---

## Companion Explanation Framework

Every recommendation, insight, alert, or reminder should attempt to answer:

- Why am I seeing this?
- Why does it matter?
- What should I do?
- What happens if I ignore it?
- What value is created if I act?

---

## Executive standard

Executives do not need more information. Executives need:

- **Clarity**
- **Prioritization**
- **Context**
- **Actionability**

Aipify should focus on **high signal, low noise**.

---

## Companion behavior standard

Aipify should strive to behave like:

- A highly competent executive assistant
- A trusted advisor
- A proactive operations coordinator
- A knowledgeable companion

Aipify should **not** behave like:

- A notification engine
- A chatbot
- A passive dashboard

---

## Examples

### Task overdue

**Bad:** `Task overdue.`

**Good:**

> This task is overdue.  
> The task is blocking:  
> - 2 employees  
> - 1 customer request  
> - 1 project milestone  
>  
> Recommended action: Review today.  
> Estimated effort: 15 minutes.  
> Potential impact: High.

### Notifications

**Bad:** `You have 14 notifications.`

**Good:**

> You have 14 notifications.  
> Only 2 require attention today.  
>  
> Recommended focus:  
> 1. Contract approval  
> 2. Customer escalation  
>  
> The remaining notifications can wait.

### Customer contact

**Bad:** `Customer has not been contacted.`

**Good:**

> This customer has not been contacted for 90 days.  
> Customer relationship length: 4 years.  
> Recent activity: Low.  
>  
> Recommended action: Schedule a check-in.  
> Suggested message is ready for review.

### Support volume

**Bad:** `Support requests increased.`

**Good:**

> Support requests increased by 18%.  
> Most requests relate to onboarding.  
>  
> Recommended action: Review onboarding documentation.  
> Potential impact: Reduced support workload and improved customer experience.

---

## Applicable modules

Apply this principle across:

| Module | Primary paths |
|--------|---------------|
| Companion Context Engine | `lib/context-engine/`, `/app/assistant/context` |
| Memory Engine (PAME) | `lib/assistant-memory/`, `/app/assistant/memory` |
| Recommendation Engine | `/app/recommendations`, Core RPCs |
| Proactive Insights Engine | `lib/core/proactive-companion.ts`, Phase A.79 |
| Personalization Engine | Identity Engine, `/app/assistant/identity` |
| Daily Briefing Center | `lib/aipify/briefing/`, `/app/briefing` |
| Work Prioritization Engine | Priority & Focus, `/app/assistant/attention` |
| Follow-Up Engine | Reminder follow-up ILM, PAME notifications |
| Relationship Intelligence (RSI) | `lib/relationship-intelligence/`, `/app/assistant/relationships` |
| Executive Companion Layer | `/app/intelligence/executive-companion`, Phase 299 |
| Companion Briefing banners | `AipifyCompanionBriefingBanner`, Phase 60 extension |
| Future Companion modules | Business Packs, `lib/core/skills/future/*` |

---

## Implementation

### ILM corpus

`aipify-core/knowledge/internal-language-model/companion-golden-rule.txt`

### Programmatic vocabulary

`lib/internal-language-model/companion-golden-rule-vocabulary.ts`  
`lib/internal-language-model/companion-golden-rule.ts`

Key helpers:

- `formatCompanionInsight()` — render structured insight copy
- `validateCompanionInsight()` — verify minimum Companion Intelligence Standard fields
- `detectInformationOnlyPattern()` — flag awareness-only messages
- `COMPANION_GOLDEN_RULE_MODULES` — module scope registry

### Cursor rule

`.cursor/rules/companion-golden-rule.mdc`

### Integration points

1. **Assistant replies** — structured insights should pass `validateCompanionInsight()` before customer-facing delivery when generating alerts, nudges, or recommendations.
2. **Proactive Companion nudges** — extend nudge payloads with impact, effort, and value fields; avoid count-only summaries.
3. **Briefing cards** — include recommended focus and deferrable items, not totals alone.
4. **Executive intelligence centers** — prioritize clarity and actionability per Executive Standard.
5. **New Companion features** — register in `COMPANION_GOLDEN_RULE_MODULES` and document insight shape in module types.

### TypeScript insight shape

```typescript
type CompanionInsight = {
  observation: string;
  explanation?: string;
  impact?: string | string[];
  recommendation: string;
  effort?: string;
  value?: string;
  ifIgnored?: string;
};
```

---

## Aipify philosophy

- People First
- Context Before Automation
- Understanding Before Action
- Companionship Before Technology

Aipify exists to help people make better decisions, build stronger relationships, and achieve better outcomes.

**Bergen. Norway. For the world.**

---

## Related standards

- [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) — Aipify-first language
- [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md) — Companion naming
- [AIPIFY_DESIGN_PRINCIPLE_COMPANION_BRIEFING.md](./AIPIFY_DESIGN_PRINCIPLE_COMPANION_BRIEFING.md) — page-level Companion Briefing
- [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md) — proactive guidance and reminder language
- [ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md](./ENTERPRISE_DESIGN_COMMUNICATION_STANDARD.md) — executive-ready copy
