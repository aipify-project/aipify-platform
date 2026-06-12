# Purpose & Values Engine — FAQ

## What is the Purpose & Values Engine?

The Purpose & Values Engine (Phase A.82) is an organizational ABOS **Identity/Culture** capability that helps ABOS understand what your organization stands for — purpose, principles, and values that guide daily decisions. It stores tenant organizational purpose and stated values, alignment signals, and reflection prompts.

## How is this different from Brand Identity & Personhood Standard?

**Brand Identity & Personhood Standard** governs how **Aipify the product** names and refers to itself in assistant replies. **Purpose & Values** holds **your organization's** purpose and values for decision alignment and culture support — completely separate concerns.

## How is this different from Business DNA Engine?

**Business DNA Engine** (`/app/settings/business-dna`) manages products, email templates, tone profiles, and support knowledge for operational responses. **Purpose & Values** defines why the organization exists and which values must guide decisions — not how to draft a support email.

## How is this different from Strategic Alignment Engine (A.55)?

**Strategic Alignment A.55** tracks alignment between strategic initiatives and organizational objectives over time. **Purpose & Values A.82** holds foundational purpose statements and stated values that inform *all* decisions — including whether strategic moves align with identity.

## How is this different from AI Ethics & Responsible Use Engine?

**AI Ethics & Responsible Use** is platform-level ethics governance for AI behavior. **Purpose & Values** is tenant-specific organizational identity — your stated values, not global AI policy.

## What stated values are supported?

Organizations define their own values via `organization_stated_values`. Example values include integrity, innovation, inclusion, excellence, transparency, sustainability, customer obsession, and continuous learning — each with operational hints for values-aware assistance.

## What are alignment signals?

Metadata-only signals (`alignment`, `drift`, `celebration`, `tension`, `opportunity`) that summarize how recent organizational patterns relate to stated values. No raw customer content — summaries only.

## What are values reflection prompts?

Reflection prompts ask humans to consider alignment before decisions — e.g. "Does this decision align with your stated values?" Prompts can be acknowledged or dismissed; Aipify prepares context; humans decide.

## Who can edit stated values?

`purpose_values.values.edit` is required to create or update stated values. Owners, administrators, and managers have this by default. All roles with `purpose_values.view` can see the dashboard.

## What integrations does Purpose & Values use?

Organizational Decision Support (A.54), Strategic Alignment (A.55), Trust & Reputation (A.72), Organizational Health (A.57), Change Management (A.47), and Goals & OKR (A.65). Growth & Evolution (A.81) references evolving without compromising identity — see [GROWTH_EVOLUTION_ENGINE_PHASE_A81.md](../../GROWTH_EVOLUTION_ENGINE_PHASE_A81.md).
