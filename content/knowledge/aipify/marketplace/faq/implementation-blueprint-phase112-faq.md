# Implementation Blueprint Phase 112 — Skills & Extensions Marketplace FAQ

## What is Phase 112 of the Implementation Blueprint?

Phase 112 extends the Marketplace & Business Pack Ecosystem (repo Phase 69) at `/app/marketplace` with **ABOS blueprint scaffolding** — trusted Skills and Extensions catalog, skill categories, install flow, QA cross-link, developer ecosystem, and live success criteria. All baseline `_mkp_*` dashboard and card fields are preserved.

## How is this different from Skill Store Phase 63?

**Skill Store (Phase 63)** at `/app/skills` is the **installation engine** for individual skills — marketplace uses `install_tenant_skill` via precheck/install RPCs. **Marketplace (Phase 112)** governs **discovery, permissions review, and pack install** — not duplicate install logic.

## How is this different from Module Marketplace A.23?

**Module Marketplace (A.23)** at `/app/module-marketplace-foundation-engine` handles **module licensing** via `tenant_modules`. **Skills marketplace** handles Skills, business packs, and extensions — distinct surfaces.

## What is the install flow?

Browse → review details → understand permissions → install → configure → activate. Medium/high risk items require approval — cross-link Trust & Action Phase 30 at `/app/approvals`.

## What are the skill categories?

Commerce · Support · Executive · Growth Partner · Personal Companion — mapped to official seed packs and registry skill IDs where available.

## What is quality assurance?

Security, reliability, UX, documentation, and governance alignment — cross-link **Marketplace Governance Phase 90** at `/app/marketplace-governance` for publish review. Not everything that can be listed should be published.

## What are the limitation principles?

No unnecessary complexity, no security sacrifice, no low-quality submissions without governance, no ungoverned growth — organizations activate what creates value.

## What is the vision phrase?

*"Aipify evolves alongside our needs."*

## What data does the engine store?

Catalog metadata, install entitlements, precheck results, and audit events — no raw customer business records in marketplace tables.

## What is the helper prefix?

Engine helpers use `_mkp_*`. Blueprint Phase 112 helpers use `_sembp112_*` — they must not collide.

## What cross-links does Phase 112 include?

Skill Store 63 · SkillOS 22 · Module Marketplace A.23 · Marketplace Governance 90 · Partner A.45 · Growth Partner 107 · Industry Packs 111 · API Platform A.21 · Trust & Action 30 · App Ecosystem 75 · Knowledge Center.
