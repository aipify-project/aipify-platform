# Growth Partner Operations Center — FAQ

## What is the Growth Partner Operations Center?

A distinct operational workspace at `/app/growth-partner-operations` for Growth Partners to manage customer portfolios, implementations, training, renewals, and partner health. It is **not** the Partner Certification portal at `/app/partners`.

## How is this different from Partner Certification (Phase 91)?

Partner Certification at `/app/partners` handles certification, directory, credentials, and ecosystem framing (`_pce_*`, `_gpebp107_*`). The Operations Center (`_gpoc_*`, `_gpocbp114_*`) handles day-to-day partner delivery operations. Cross-link — do not duplicate.

## How is this different from Partner Success (A.73)?

Partner Success at `/app/partner-success-engine` tracks portfolio health for **customer organizations** managing their partner engagements. Growth Partner Operations is the **Growth Partner's own** operational workspace. Complementary surfaces.

## What data does the Operations Center store?

Metadata only — org profile summaries, industry classification, implementation status, health scores, training progress percentages, renewal dates, and communication history **counts**. No customer email, chat, or PII content.

## What are the Implementation Center stages?

Ten stages: Discovery, Planning, Configuration, Companion Setup, Knowledge Preparation, Pilot Deployment, User Training, Go Live, Optimization, Continuous Success. Each includes tasks, milestones, owners, templates, checklists, and escalation procedures.

## How does Companion deployment work?

The Companion Deployment Center covers selection, configuration, permissions, governance, department assignments, knowledge prep, rollout, and post-launch optimization. Cross-link Companion Marketplace Phase 113 at `/app/companion-marketplace`.

## What certification levels are supported?

Six levels mapped to `_pce_tier_label()` without renaming DB seeds: Registered, Certified, Advanced, Strategic, Enterprise, Global Growth Partner. Authoritative certification remains at `/app/partners`.

## What Training Academy programs are available?

Aipify Fundamentals, Companion Strategy, Implementation Excellence, Governance Best Practices, Commerce Excellence, Executive Advisory Skills, Knowledge Management, Security Principles, Customer Success Methodologies, Industry Specializations. Cross-link Learning & Training A.36 and Certification & Achievement A.37.

## What security requirements apply?

RBAC, customer access segmentation, audit logging, activity monitoring, data isolation, mandatory 2FA for sensitive roles, QR enrollment, recovery codes, and session visibility. Configure 2FA at `/app/settings/two-factor`.

## Does Aipify auto-progress implementations or renewals?

No. `human_oversight_required` defaults to true. Aipify informs and prepares; humans approve significant partner actions.

## What terminology should partners use?

Growth Partner terminology only — never "Affiliate." See PARTNER_TERMINOLOGY_UPDATE.md.

## What are the success metrics?

Higher retention, improved implementations, greater satisfaction, expanded ecosystem, increased adoption, stronger governance, healthier relationships, sustainable partner businesses, and improved transformation outcomes.

## Which marketplace surfaces integrate?

Implementation Packages, Training Programs, Industry Specializations, Governance Assessments, Executive Advisory, Optimization Programs, Companion Deployment Services, and Customer Success Packages. Cross-link `/app/marketplace` (Phase 112) and `/app/marketplace-partner-ecosystem-foundation-engine` (A.45).

## What Partner Insights questions does Aipify help answer?

Which industries perform best? Which Companions deliver highest value? Which customers need intervention? Where are expansion opportunities? Which training programs improve outcomes? How is governance evolving?
