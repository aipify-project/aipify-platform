# Relationship Intelligence Engine (Organizational)

**Phase A.78 · ABOS Assistance & Operations pillar**

Understand relationships within and around the organization using metadata-only context. Aipify informs and prepares — humans decide.

> **Critical distinction:** Phase 33 RSI (`RELATIONSHIP_SOCIAL_INTELLIGENCE.md`) is **personal** assistant relationships at `/app/assistant/relationships`. Phase A.78 is **organizational** tenant-level relationship intelligence.

---

## Vision

Organizations operate through relationships — internal teams, customers, partners, and communities. Aipify surfaces interaction patterns, collaboration context, escalation paths, communication preferences, and trust indicators so support, management, operations, and executive teams can act with transparency.

---

## Relationship categories

| Category | Scope | Context signals |
|----------|-------|-----------------|
| **Internal** | Employee, team, manager, executive | Interaction frequency, collaboration patterns, escalation paths |
| **Customer** | Accounts and stakeholders | Communication preferences, trust indicators, engagement trends |
| **Partner** | Implementation, reseller, advisory | Collaboration patterns, renewal signals (links to A.73) |
| **Community** | Ecosystem and public stakeholders | Engagement trends, sentiment hints |

---

## Applications

- **Support AI** — customer relationship context for triage and escalation
- **Management** — team collaboration and handoff visibility
- **Operations** — partner and community engagement patterns
- **Executive** — portfolio-level relationship health summaries

---

## Ethical boundaries

Aipify must **never**:

- Impersonate users or auto-send messages
- Store raw email, chat, or customer conversation content
- Manipulate relationships or apply pressure tactics
- Conflate organizational profiles with personal RSI data

**Self Love** monitors relational health gently — signals when collaboration patterns need attention, without guilt or pressure.

---

## Database

| Table | Purpose |
|-------|---------|
| `organization_relationship_profiles` | Metadata-only relationship profiles by category |
| `organization_relationship_interactions` | Recorded interaction summaries (max 500 chars) |
| `organization_relationship_insights` | Open insights with recommended actions |
| `organization_relationship_intelligence_settings` | Org defaults and guardrails |

---

## Integration links

| Engine | Route | Notes |
|--------|-------|-------|
| Personal RSI | `/app/assistant/relationships` | Personal — do not merge |
| Support AI | `/app/support-ai-engine` | Customer support context |
| Partner Success | `/app/partner-success-engine` | Partner portfolio (A.73) |

---

## Code

- Migration: `supabase/migrations/20260923000000_relationship_intelligence_engine_phase_a78.sql`
- Core helpers: `lib/core/relationship-intelligence-engine.ts`
- App layer: `lib/aipify/relationship-intelligence-engine/`
- APIs: `/api/aipify/relationship-intelligence-engine/*`
- ILM: `lib/internal-language-model/relationship-intelligence-vocabulary.ts`

**Do not use** `lib/relationship-intelligence/` — that is Phase 33 personal RSI.
