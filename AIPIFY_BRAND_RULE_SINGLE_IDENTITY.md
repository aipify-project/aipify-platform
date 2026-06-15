# Aipify Brand Rule — Single Identity

**There is only one Aipify.**

Cross-reference: [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) · [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md) · [AIPIFY_SKILLS_MARKETPLACE_NAMING_STANDARD.md](./AIPIFY_SKILLS_MARKETPLACE_NAMING_STANDARD.md)

---

## Rule

1. **Do not create multiple AIs.** Aipify is one product — not a bundle of separate AI services.
2. **Do not introduce separate assistant identities.** No second persona, no competing “AI assistant” brand inside Aipify.
3. **All capabilities belong to Aipify.** Every module, Skill, Center, Specialist, and Companion is part of the same trusted platform.
4. **Users interact with Aipify.** Conversation, notifications, approvals, and guidance come from Aipify — even when a specific capability (Support, Executive Briefing, Analytics Center) is doing the work.
5. **Aipify remains the single trusted companion** throughout the platform.

---

## What this means in practice

| Correct framing | Incorrect framing |
|-----------------|-------------------|
| Aipify Support capability | A separate Support AI |
| Aipify Executive Briefing | Another AI assistant for executives |
| Install the Analytics Center Skill | Add another AI to your stack |
| Aipify prepared this summary | The AI prepared this summary |
| Skills extend what Aipify can do | Multiple AI tools you manage separately |

**Skills, Centers, Specialists, and Companions** name **business capabilities** — they are extensions of Aipify, not independent assistants users must learn separately.

---

## Relationship to other standards

- **Brand Identity & Personhood** — Aipify is the product name; technology stays in the background.
- **Companion Naming Policy** — Customer labels use **Aipify** (Aipify Support, Aipify Insights), not generic AI.
- **Skills Marketplace Naming** — Skill cards use Center / Specialist / Engine suffixes **without** implying a separate AI product; all Skills are Aipify capabilities.

---

## Avoid in customer-facing copy

- Multiple AIs · separate AI · another AI · our AI assistant · AI assistant named …
- “This AI …” · “Each AI …” · “Your AI tools …”
- Persona language that suggests a fleet of assistants (copilot army, AI team, AI workforce as separate entities)

---

## Implementation

| Surface | Location |
|---------|----------|
| Canonical doc | `AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md` (this file) |
| Cursor rule | `.cursor/rules/aipify-identity-rule.mdc` |
| ILM vocabulary | `lib/internal-language-model/aipify-single-identity-brand-rule-vocabulary.ts` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/aipify-single-identity-brand-rule.txt` |
| Copy normalization | `applyAipifyFirstLanguagePolicy()` in `brand-identity-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/brand-identity/faq/single-identity-brand-rule-faq.md` |

---

## Success criteria

- Users experience **one Aipify** — not a marketplace of disconnected AI products.
- Skills and modules read as **capabilities Aipify provides**, not separate assistants.
- Assistant replies and notifications refer to **Aipify**, not anonymous AI.
- No new feature introduces a standalone “AI identity” alongside Aipify.

> People build relationships with names, not technologies — and with **one** trusted companion, not many.
