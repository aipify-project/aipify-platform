# Ecosystem Governance & Certification — FAQ

## What is the Ecosystem Governance Center?

The Ecosystem Governance Center at `/app/ecosystem-governance` provides ecosystem-wide certification oversight, audit programs, policy libraries, and trust badging across Growth Partners, Companions, and training providers.

## How is this different from Marketplace Governance?

**Marketplace Governance** (repo Phase 90 at `/app/marketplace-governance`) focuses on marketplace QA, fraud, and policy — a subset of the ecosystem.

**Ecosystem Governance** (Phase 119) spans the full certification ecosystem: GP levels, companion assessments, training providers, audit programs, and trust badges.

## How is this different from Partner Certification?

Partner Certification at `/app/partners` (Phase 91) remains the authoritative surface for Growth Partner certification tiers. Ecosystem Governance cross-links `_pce_tier_label()` presentation without duplicating Phase 91 RPCs.

## Does governance punish failures?

No. Governance guides — not controls. Reviews support improvement. Certification maintenance failures trigger review, not automatic punishment.

## Is enterprise alignment mandatory?

No. Enterprise governance integration is voluntary. Organizations retain autonomy.

## What about internal team certifications?

Internal team certifications are handled by Certification & Achievement A.37 at `/app/certification-achievement-engine` — distinct from ecosystem certification.

## Where does continuous improvement fit?

Organizational continuous improvement lives at `/app/continuous-improvement-engine` (Blueprint Phase 90). Ecosystem Governance cross-links CI activities without duplicating CI RPCs.

## What security requirements apply?

Audit logging, RBAC, review histories, 2FA enforcement (`/app/settings/two-factor`), recovery procedures, governance documentation, and policy acknowledgements.

## What terminology should I use?

Always use **Growth Partner** — never Affiliate.
