# Global Talent & Expert Network Engine — Phase 147

**Feature owner:** Customer App  
**Route:** `/app/global-talent-expert-network-engine`  
**Nav id:** `globalTalentExpertNetworkEngine`  
**Module key:** `global_talent_expert_network_engine`  
**Era:** Global Intelligence & Interorganizational (141–150)

## Summary

Phase 147 delivers the **Global Expert Network Center** — professional expert discovery and Growth Partner matching across verified ecosystems. It is **not** a gig economy or anonymous freelancer marketplace. Quality not popularity — no star ratings or popularity rankings.

## Distinction

| Surface | Relationship |
|---------|--------------|
| Ecosystem Governance Phase 146 `/app/ecosystem-governance` | Professional directory & certification standards — cross-link |
| Trust Network Phase 142 `/app/trust-reputation-engine` | Verified organizations — cross-link |
| Partner Certification Phase 91 `/app/partners` | GP tiers via `_pce_tier_label()` — cross-link |
| Marketplace Partner Ecosystem A.45 / Blueprint 33 | Partner expert network — cross-link |
| Growth Partner Ecosystem Phase 107 | Matching scaffolds — cross-link |
| Global Knowledge Exchange Phase 141 | Knowledge steward communities — cross-link |
| Joint Operations Phase 143 | Collaboration charters — cross-link |

## Database

Migration: `supabase/migrations/20261307000000_global_talent_expert_network_engine_phase147.sql`

**Helpers:** `_gtene_*` (engine), `_gtenbp147_*` (blueprint)

**Tables (organization_id + RLS, metadata only):**

- `global_talent_expert_network_settings`
- `global_expert_profiles`
- `global_expert_engagements`
- `global_expert_contributions`
- `global_talent_expert_network_audit_logs`

**RPCs:**

- `get_global_talent_expert_network_engine_dashboard(p_org_id uuid)`
- `get_global_talent_expert_network_engine_card(p_org_id uuid)`
- `register_global_expert_profile(...)`
- `create_expert_engagement_charter(...)`

## Permissions

- `global_talent_expert_network.view`
- `global_talent_expert_network.manage`

## Code paths

| Layer | Path |
|-------|------|
| Page | `app/app/global-talent-expert-network-engine/page.tsx` |
| Panel | `components/app/global-talent-expert-network-engine/` |
| Lib | `lib/aipify/global-talent-expert-network-engine/` |
| Core helpers | `lib/core/global-talent-expert-network-engine.ts` |
| APIs | `/api/aipify/global-talent-expert-network-engine/dashboard`, `/card` |
| ILM | `implementation-blueprint-phase147-global-talent-expert-network-engine.txt` |
| Vocabulary | `lib/internal-language-model/implementation-blueprint-phase147-vocabulary.ts` |
| KC FAQ | `content/knowledge/aipify/global-talent-expert-network-engine/faq/implementation-blueprint-phase147-faq.md` |

## Philosophy

- Professional ecosystems built on trust, verification, and shared standards — not anonymous marketplaces.
- Growth Partner not Affiliate. People First. Growth through support.
- Talent Companion supports discovery — does NOT guarantee outcomes, misrepresent expertise, manipulate visibility, or replace procurement/hiring decisions.

## Companion limitations

No guarantee outcomes · No misrepresent expertise · No manipulate visibility · No reveal confidential info · No replace procurement · No popularity as quality
