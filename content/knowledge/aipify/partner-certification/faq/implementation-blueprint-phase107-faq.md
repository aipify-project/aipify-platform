# Implementation Blueprint Phase 107 — Growth Partner Ecosystem Engine FAQ

## What is Phase 107 of the Implementation Blueprint?

Phase 107 extends the Partner & Certification Ecosystem (repo Phase 91) at `/app/partners` with **ABOS Growth Partner blueprint scaffolding** — a thriving ecosystem of independent businesses supporting implementation, education, consulting, and customer success. All baseline `_pce_*` dashboard fields are preserved.

## How is Blueprint Phase 107 different from repo Phase 91 baseline?

**Repo Phase 91** ships certification tracks, digital credentials, partner directory, opportunity pipeline, performance insights, and compliance. **Blueprint Phase 107** adds Growth Partner mission/philosophy metadata, six objectives, certification level mapping, matching engine dimensions, companion guidance, limitation principles, leadership connection, and live success criteria — layered on top without replacing baseline RPC behavior.

## How is this different from Marketplace Partner Ecosystem A.45?

**Marketplace Partner Ecosystem A.45** at `/app/marketplace-partner-ecosystem-foundation-engine` governs marketplace connectors, offerings, and certification workflows for the module marketplace. **Growth Partner Phase 107** at `/app/partners` is the Growth Partner program — certification, directory, and partner portal — distinct surface.

## How is this different from Partner Success A.73?

**Partner Success A.73** at `/app/partner-success-engine` tracks partner portfolio health, onboarding, and renewal readiness for customer organizations. **Growth Partner Phase 107** is the partner-facing certification and ecosystem portal — cross-link only.

## How is this different from Sales Expert OS Phase 33?

**Sales Expert OS Phase 33 / A.95** at `/app/sales-expert-engine` is a Growth Partner type — independent sales experts with marketing center and certification cross-links. Phase 107 provides the broader Growth Partner ecosystem framing at `/app/partners`.

## How is this different from Certification & Achievement A.37?

**Certification & Achievement A.37** at `/app/certification-achievement-engine` is for **internal team certifications** — not partner certification. Partner credentials live in repo Phase 91 / Blueprint Phase 107.

## What about Organizational Resilience Blueprint Phase 91?

**Organizational Resilience Blueprint Phase 91** at `/app/organizational-resilience-engine` is an unrelated phase number collision — continuity and resilience planning, not partner certification.

## What are the certification levels?

| Blueprint level | Maps to `_pce_tier_label()` |
|-----------------|------------------------------|
| Certified Partner | Certified tier |
| Professional Partner | Sales Expert tier |
| Elite Partner | Expert tier |

Competence-based — certification quality must not be diluted for recruitment volume.

## What is the Growth Partner Companion?

The **Growth Partner Companion** is Aipify's partnership-focused framing — not a generic AI recruitment bot. It scaffolds certification pathways and customer matching with optional prompts (🦉🌹🔔). Humans govern program decisions.

## What are the limitation principles?

**Partnership not extraction:** no disposable sales channels, no recruitment over partner success, no diluted certification, and **never Affiliate language** — Growth Partner terminology only per `PARTNER_TERMINOLOGY_UPDATE.md`.

## What is the vision phrase?

*"We did not simply purchase software. We gained a trusted partner who helped us succeed."*

## What data does the engine store?

Partner directory metadata, certification progress, credential codes, compliance status, lead registration summaries, and audit events — no raw customer PII in blueprint metadata.

## What is the helper prefix?

Engine helpers use `_pce_*`. Blueprint Phase 107 helpers use `_gpebp107_*` — they must not collide.

## What cross-links does Phase 107 include?

Partner Certification repo Phase 91, Marketplace A.45, Partner Success A.73, Sales Expert Phase 33, Certification & Achievement A.37, Learning & Training A.36, Customer Success A.26, Aipify Academy, Knowledge Center, Ecosystem Intelligence Phase 88, and Self Love A.76.
