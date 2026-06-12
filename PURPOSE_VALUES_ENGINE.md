# Purpose & Values Engine

**Feature owner:** Customer App · **Module:** `purpose_values_engine` · **Phase:** A.82

Help the Aipify Business Operating System (ABOS) understand what an organization stands for — purpose, principles, and values that guide decisions during daily operations, growth, and change.

## Philosophy

Actions align with values. Aipify bridges intention and execution — meaningful progress matters as much as efficiency. How you succeed matters as much as whether.

## Mission

Keep organizations connected to purpose and values during daily ops, growth, and change.

## Vision

The companion understands why the organization exists — technology strengthens identity, it does not replace it.

## Capabilities

- **Organizational purpose** — why exist, problems solved, who served, impact aspired
- **Stated values** — integrity, innovation, inclusion, excellence, transparency, sustainability, customer obsession, continuous learning (operationalized per tenant)
- **Values-aware assistance** — adapt recommendations to stated values (transparency → explainability; customer care → CX/support)
- **Decision support** — reflection prompts on alignment, trade-offs, and trust
- **Culture support** — reinforce behaviors, celebrate value-aligned wins, knowledge sharing, respectful comms
- **Alignment signals** — metadata-only drift, celebration, and opportunity signals

## Distinctions

| Engine | Scope |
|--------|-------|
| Brand Identity & Personhood Standard | Aipify product naming and self-reference |
| Business DNA Engine | Products, templates, tone, support knowledge |
| Strategic Alignment A.55 | Strategic initiative alignment snapshots |
| AI Ethics & Responsible Use | Platform ethics governance |
| **Purpose & Values A.82** | Tenant organizational purpose and values |

## Route & code

- Customer route: `/app/purpose-values-engine`
- Nav id: `purposeValuesEngine`
- Core helpers: `lib/core/purpose-values.ts`
- Types/parse: `lib/aipify/purpose-values-engine/`
- APIs: `/api/aipify/purpose-values-engine/*`
- Migration: `20260928000000_purpose_values_engine_phase_a82.sql`
- ILM: `aipify-core/knowledge/internal-language-model/purpose-values-engine-abos.txt`

See [PURPOSE_VALUES_ENGINE_PHASE_A82.md](./PURPOSE_VALUES_ENGINE_PHASE_A82.md) for phase details.
