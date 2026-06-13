# ABOS Self Love Naming Standard

**Effective immediately** for all Aipify documentation, Knowledge Center articles, product copy, ILM corpus, and Cursor-generated specifications.

Cross-reference: [ABOS_FOUNDATION.md](./ABOS_FOUNDATION.md) · [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) · [INTERNAL_LANGUAGE_MODEL.md](./INTERNAL_LANGUAGE_MODEL.md)

---

## Preferred form

**Self Love** — two words, no trademark symbol.

When referring to the engine module, use **Self Love Engine (A.76)** — route `/app/self-love-engine`.

---

## Avoid

- Self Love™
- SelfLove™
- SELF LOVE™
- Self Love Engine™
- SelfLove (one word, user-facing copy)
- ALL CAPS **SELF LOVE** in customer-facing text (internal corpus section headers may use uppercase labels)

---

## What Self Love is

Self Love is a **principle, value, philosophy, and reminder** within ABOS — not primarily a trademarked product name.

It expresses balance, wellbeing, reflection, sustainable growth, and compassion. ABOS treats Self Love as natural, warm, human, and approachable — never overly commercialized.

**Vision:** Self Love should be a recognizable expression of care through experience, not heavy marketing.

---

## Usage examples

Use Self Love in calm, supportive phrasing:

- "Perhaps this workflow needs a little Self Love."
- "Remember some Self Love today."
- "Self Love recommends taking a short break."
- "A little Self Love can go a long way."
- "Self Love encourages reflection before action."

---

## Self Love Engine (A.76)

The **Self Love Engine** is an ABOS assistance capability (Phase **A.76**) at `/app/self-love-engine`.

Planned scope:

- Operational wellbeing monitoring (extends Quality Guardian A.13, Observability A.19)
- Knowledge Center–integrated maintenance guidance (A.5)
- Positive, non-alarmist communication when Aipify needs attention
- Human approval gates for recovery actions above low risk (A.3)

> Systems that care for themselves are better equipped to care for others.

Self Love must never perform irreversible actions without explicit human approval.

---

## Implementation surfaces

| Surface | Location |
|---------|----------|
| Canonical doc | `SELF_LOVE_NAMING_STANDARD.md` (this file) |
| Engine doc | `SELF_LOVE_ENGINE_PHASE_A76.md` |
| Route | `/app/self-love-engine` |
| KC article | `content/knowledge/aipify/abos/articles/understanding-self-love.md` |
| KC FAQ | `content/knowledge/aipify/abos/faq/self-love-naming-standard-faq.md` |
| ILM corpus | `aipify-core/knowledge/internal-language-model/self-love-naming-standard.txt` |
| Programmatic vocabulary | `lib/internal-language-model/self-love-naming-vocabulary.ts` |
| Copy normalization | `adaptReplyToSelfLoveNaming()` |

---

## i18n

Translation **keys** may remain camelCase (`selfLoveNote`, `balanceWithSelfLoveToggle`). **Display strings** must use **Self Love** (two words, no ™).

---

## Cursor rule

When generating user-facing copy about wellbeing, balance, or A.76 scaffold references, use **Self Love** per this standard. Do not add ™ symbols or merge into **SelfLove**.

Programmatic normalization: `adaptReplyToSelfLoveNaming()` · `getSelfLoveNamingStandard()` · corpus `self-love-naming-standard.txt`
