# AIPIFY Enterprise Design & Communication Standard

**Status:** ACTIVE · **Priority:** FOUNDATIONAL · **Version:** 1.0

Cross-reference: [AIPIFY_DESIGN_STANDARD_V1_LIGHT_ENTERPRISE.md](./AIPIFY_DESIGN_STANDARD_V1_LIGHT_ENTERPRISE.md) (visual theme) · [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md) · [AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md](./AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md)

ILM corpus: `aipify-core/knowledge/internal-language-model/enterprise-design-communication-standard.txt` · Cursor rule: `.cursor/rules/enterprise-design-communication-standard.mdc`

---

## Applies to

All surfaces where Aipify speaks to or presents itself to people:

- **Customer App** — dashboards, centers, settings, onboarding, Companion UI, notifications
- **Platform Admin** — customer records, governance, internal operations UI
- **Marketing & public web** — landing pages, pricing, proposals, investor materials
- **Knowledge Center** — articles, FAQs, help copy
- **Registration & onboarding** — `/register`, workspace provisioning, welcome flows
- **Pricing & commercial copy** — plans, modules, upgrade messaging
- **Growth Partner ecosystem** — partner portal, certification, operations center
- **Cursor specifications & generated docs** — every new feature spec, blueprint, and implementation prompt
- **i18n locale files** — `en`, `no`, `sv`, `da` for all user-facing strings

This standard does **not** replace [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) or [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md). It extends them with enterprise design and communication expectations.

---

## Purpose

Aipify is built for organizations from **50 to 10,000 employees** — with design and language quality influenced by **Fortune 500** operational software expectations. Every screen, sentence, and specification should feel **enterprise-ready on day one**: credible to a CIO, approachable to a team lead, and respectful to every person who uses the product.

This is not cosmetic polish. Design and communication are **trust infrastructure**. When Aipify looks amateur or speaks like a consumer gimmick, organizations hesitate. When Aipify looks disciplined and speaks with clarity, organizations adopt.

> *Aipify works in the background so businesses can move forward — and every touchpoint should reflect that confidence.*

---

## Default Cursor assumption

When generating UI, copy, onboarding, dashboards, marketing strings, or specifications **without explicit contrary instruction**, Cursor and all contributors must assume:

1. **Audience:** A decision-maker or operator at a company with **50–10,000 employees** — not a hobby project or solo freelancer tool (unless the flow explicitly targets Growth Partners, consultants, or pilots).
2. **Design bar:** Microsoft-level professionalism, Apple-level simplicity, GitHub-level trust signals, Stripe-level pricing clarity, and Aipify humanity (see Design bar below).
3. **Language bar:** Companion terminology, workspace establishment language, no slang, no gimmicks, no generic "AI assistant platform" category framing.
4. **Security baseline:** Two-factor authentication, audit visibility, and role-based access are **expected** — not optional extras mentioned in fine print.
5. **Human control:** Aipify informs and prepares; humans decide. Never imply autonomous company operation.

If a proposed UI or copy would embarrass Aipify in a Fortune 500 procurement review, **pause and redesign**.

---

## Philosophy

These principles govern design and communication decisions across ABOS. They align with [CORE_FOUNDATION.md](./CORE_FOUNDATION.md) and [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md).

| Principle | Meaning for design & copy |
|-----------|---------------------------|
| **People First** | Dignity and agency in every layout and sentence. Technology serves people — never the reverse. |
| **Technology Second** | Capability is shown through outcomes and clarity — not jargon, badges, or hype. |
| **Self Love** | Sustainable systems, honest status, transparent limits. See [SELF_LOVE_NAMING_STANDARD.md](./SELF_LOVE_NAMING_STANDARD.md). |
| **Wisdom before speed** | Prefer thoughtful copy and calm UI over rushed features, alarmist alerts, or pressure tactics. |
| **Companionship before replacement** | Aipify augments teams. Never imply Aipify replaces employees, leaders, or human judgment. |
| **Stewardship through responsibility** | Enterprise language reflects accountability — especially for Growth Partners and governance surfaces. |
| **Trust earned, never manipulated** | No dark patterns, false urgency, or hidden actions. See [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md). |

---

## The design bar

Every new surface must consciously balance five influences plus Aipify's distinct humanity.

### Microsoft — professionalism

Enterprise buyers expect **disciplined, predictable, operational software**.

- Consistent navigation, spacing, typography, and component patterns
- Dense information presented with hierarchy — not clutter
- Role-appropriate views (executive summary vs operational detail)
- Status, health, and governance visible without hunting
- No playful illustrations or novelty UI in executive, security, or billing contexts

**DO:** "Organization health overview" with clear metrics and last-updated timestamps.  
**DO NOT:** Cartoon mascots on the governance dashboard or neon gradient overload on settings pages.

### Apple — simplicity

Power without complexity. Users should understand the **next action** within seconds.

- One primary action per screen region
- Progressive disclosure — advanced options tucked behind clear affordances
- Generous whitespace; readable type scale; accessible contrast
- Remove words before adding features
- Mobile-first responsiveness without dumbing down desktop workflows

**DO:** A registration step with one headline, one sentence of context, and a single primary button.  
**DO NOT:** Five competing CTAs, tooltip mazes, or settings pages that require a manual.

### GitHub — trust

Developers and operators trust products that show **how things work and what happened**.

- Audit trails, activity feeds, and explainability blocks where actions occur
- Clear permission and role labels — who can do what
- Honest empty states ("No approvals yet" not fake sample data)
- Security and compliance cross-links visible in settings
- Version, status, and policy transparency

**DO:** "This action was logged · View audit trail" beside sensitive operations.  
**DO NOT:** Silent state changes, unexplained badges, or "Trust us" without evidence links.

### Stripe — clarity

Especially for **pricing, billing, modules, and upgrades** — confusion kills conversion and trust.

- Plan names, limits, and entitlements stated plainly
- No hidden fees language; grace periods and pause behavior documented
- Comparison tables that respect the reader's time
- Upgrade paths explained as business outcomes, not feature dumps
- Currency, billing cycle, and license ownership messaging aligned with [LICENSE_CENTER.md](./LICENSE_CENTER.md)

**DO:** "Business includes 5 installations · Additional installations available on Enterprise."  
**DO NOT:** "Unlock the power of AI" with no concrete limit or price context.

### Aipify humanity

Aipify is calm, competent, and **warm without being cute**. Professional does not mean cold.

- Acknowledge difficulty during onboarding, change, and recovery — without guilt or pressure
- Companions support; they do not judge, rank, or surveil individuals
- Celebrations and milestones are measured — not gamified noise
- Inclusive, respectful language across locales ([HUMAN_VALUES_CHARTER.md](./HUMAN_VALUES_CHARTER.md))
- The product name **Aipify** and **Companion** identity — not anonymous "AI"

**DO:** "Your workspace is ready. Aipify will learn alongside your team."  
**DO NOT:** "You're crushing it! 🚀🔥" on a compliance settings page.

---

## Language standard — DO / DO NOT

### Product category & naming

Cross-ref: [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) · [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md)

| DO NOT | DO |
|--------|-----|
| AI chatbot · AI assistant platform · AI automation tool | **Aipify Business Operating System (ABOS)** |
| AI Assistant · AI Support · Resolved by AI | **Aipify Companion** · **Aipify Support** · **Resolved by Aipify** |
| Bot · Copilot · Magic · Supercharged AI | Aipify · Companion · Intelligent operations |
| Get Started Free!!! · Join the revolution | **Establish your Aipify Workspace** · **Request a demo** |

Plain-language **digital coworker** is approved for hero and first-contact marketing per ABOS positioning — formal category remains ABOS in enterprise, KC, and governance contexts.

### Registration & onboarding

Cross-ref: [REGISTRATION_ORGANIZATION_ONBOARDING.md](./REGISTRATION_ORGANIZATION_ONBOARDING.md)

| DO NOT | DO |
|--------|-----|
| Create your account · Sign up · Register | **Establish your Aipify Workspace** |
| Create account (button) | **Establish workspace** · **Create Aipify Workspace** (wizard final step) |
| Start building with intelligent AI assistants | **Set up your Aipify Business Operating System in a few guided steps** |
| Throwaway signup form tone | Premium, calm, People First — Day One metadata for ABOS |

Registration is **workspace establishment**, not consumer app signup. Collect organization context with respect; explain why each field matters.

### Companion & modules

| DO NOT | DO |
|--------|-----|
| Your AI will handle this automatically | **Aipify recommends** · **Your Companion can prepare** |
| The AI decided · AI takeover | **Suggested action** · **Awaiting your approval** |
| Digital employee replaces your team | **Digital coworker** · **Companion augments your team** |
| Monitor your employees | **Organizational patterns** · **Aggregate operational signals** (never individual surveillance) |

### Pricing & commercial

| DO NOT | DO |
|--------|-----|
| Cheap · Best deal · Limited time!!! | **Plan** · **Module** · **License** · **Entitlement** |
| All features included (when gated) | **Included in Business** · **Available on Enterprise** |
| Contact us for mystery pricing | Transparent tiers with clear limits; enterprise as **Talk to us** when appropriate |
| You own the software | **License to use Aipify** — customer owns **their data** ([LICENSE_CENTER.md](./LICENSE_CENTER.md)) |

### Growth Partner

Cross-ref: [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) · partner terminology in [ARCHITECTURE.md](./ARCHITECTURE.md) Phase 91

| DO NOT | DO |
|--------|-----|
| Affiliate · Referral partner · Reseller (unless legally required) | **Growth Partner** |
| Earn money fast with Aipify | **Stewardship through responsibility** · certification and ecosystem language |
| Affiliate program · Affiliate dashboard | **Growth Partner Operations Center** · **Partner certification** |

**Growth Partner** is the official public term — **never Affiliate** in product UI, marketing, KC, or Cursor specs.

### Tone — global DO NOT list

- Slang, memes, emoji spam, or exclamation-heavy marketing in enterprise surfaces
- Alarmist defaults ("Critical failure!" when status is informational)
- Guilt-based motivation ("You forgot", "Don't fall behind competitors")
- Fake urgency countdown timers on billing or security pages
- Anthropomorphic manipulation ("Aipify is disappointed in you")
- Provider brand exposure (GPT, Claude, Gemini) in customer-facing UI — see [MODEL_AGNOSTIC_INTELLIGENCE.md](./MODEL_AGNOSTIC_INTELLIGENCE.md)

---

## Security communication baseline

Enterprise buyers expect security to be **visible, not buried**. Cross-ref: [AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md](./AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md) · [TRUST_ARCHITECTURE.md](./TRUST_ARCHITECTURE.md)

### Minimum expectations in copy and UI

1. **Two-factor authentication (2FA)** — promoted during registration and required for privileged roles (owners, administrators, platform admins, Growth Partners where applicable). Language: "Protect your workspace" not "Extra security hassle."
2. **Audit visibility** — sensitive actions link to audit trails; platform and tenant governance surfaces expose activity history (metadata only — no PII dumps).
3. **Role-based access control (RBAC)** — permissions labeled clearly; least-privilege explained when requesting elevated access.
4. **Data ownership** — customer owns operational data; Aipify owns the intelligence layer — stated plainly in security and license surfaces.
5. **Recovery & continuity** — honest about limits; recovery flows transparent; no hidden autonomous remediation.

**DO:** "Two-factor authentication is required for organization administrators."  
**DO NOT:** Security features hidden three levels deep with no mention at workspace creation.

---

## Onboarding & first-run experience

Onboarding establishes **trust before feature depth**.

- Lead with workspace identity (organization name, role, purpose) — not feature tours
- Explain Install-first philosophy: daily work happens in customer systems; Control Center is for management
- Security step is informational and respectful — skip allowed with clear path to enable later
- Welcome copy: professional warmth — "Welcome to Aipify" not "Woohoo you're in!"
- Post-registration redirect to install/onboarding with clear next step — one primary CTA
- Enterprise candidates (251+ employees) should see copy that acknowledges scale without overwhelming

See [REGISTRATION_ORGANIZATION_ONBOARDING.md](./REGISTRATION_ORGANIZATION_ONBOARDING.md) · [MODERN_INSTALL_EXPERIENCE.md](./MODERN_INSTALL_EXPERIENCE.md) · [CUSTOMER_APP.md](./CUSTOMER_APP.md)

---

## Companion UI & executive surfaces

Companion experiences (Executive Intelligence, Board Governance, Decision Intelligence, Proactive Organization, etc.) must feel like **trusted advisory environments** — not chat toys.

- Structured insight blocks: what happened · why it matters · suggested action · if ignored
- Confidence and explainability visible alongside recommendations
- Human accountability explicit — "Leaders decide" · "Directors remain accountable"
- No individual performance scoring or surveillance framing
- Consistent Companion naming per [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md)

---

## Dashboard & data presentation

- Health scores and KPIs with context — trend, source, last updated
- Empty states guide next action — never fake data
- Loading states honest — no premature success messaging
- Error states actionable — what happened, what to do, link to support if needed
- Executive density vs operational density — match the audience ([OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) §3)

---

## Internationalization

All user-facing strings via locale files — **no hardcoded UI text**. Enterprise tone must survive translation:

- Prefer clear, translatable sentences over idioms
- `en`, `no`, `sv`, `da` required for new copy
- Norwegian Bokmål, Swedish, and Danish should mirror workspace/Companion terminology consistently

See [i18n-required rule](./.cursor/rules/i18n-required.mdc).

---

## The Aipify Standard — decision filter

Before shipping any UI, copy, onboarding step, pricing line, KC article, or Cursor spec, answer **all five questions**. If any answer is "no" or unclear, **pause and revise**.

1. **Enterprise-ready?** Would this pass review at a 500–10,000 employee organization without apology?
2. **People First?** Does it preserve human dignity, agency, and accountability?
3. **Clear & calm?** Can a busy operator understand the next action in seconds without hype?
4. **Trustworthy?** Are permissions, security, limits, and audit expectations visible and honest?
5. **Distinctly Aipify?** Does it use ABOS / Companion / workspace language — not generic AI SaaS tropes?

When in doubt, choose **clarity over cleverness** and **restraint over noise**.

---

## Governance order

[CORE_FOUNDATION.md](./CORE_FOUNDATION.md) → [OPERATING_PRINCIPLES.md](./OPERATING_PRINCIPLES.md) → **Enterprise Design & Communication Standard (this document)** → [ARCHITECTURE.md](./ARCHITECTURE.md) → Implementation → Skills

Read this standard before UX, copy, onboarding, dashboards, Companion UI, marketing strings, pricing copy, and Knowledge Center content.

---

## Related standards (do not duplicate)

| Document | Scope |
|----------|-------|
| [ABOS_BRAND_TERMINOLOGY_STANDARD.md](./ABOS_BRAND_TERMINOLOGY_STANDARD.md) | Product category ABOS, Self Love, digital coworker positioning |
| [AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md](./AIPIFY_BRANDING_STANDARD_COMPANION_NAMING_POLICY.md) | Companion vs AI labels in modules |
| [BRAND_IDENTITY_PERSONHOOD_STANDARD.md](./BRAND_IDENTITY_PERSONHOOD_STANDARD.md) | Aipify-first self-reference in assistant replies |
| [LEARNING_JOURNEY_COMMUNICATION_STANDARD.md](./LEARNING_JOURNEY_COMMUNICATION_STANDARD.md) | Honest capability-gap phrasing |
| [HUMAN_VALUES_CHARTER.md](./HUMAN_VALUES_CHARTER.md) | Dignity, inclusion, respectful assistance |
| [POSITIONING_FOUNDATION.md](./POSITIONING_FOUNDATION.md) | Digital coworker + ABOS dual positioning |

---

## Cursor implementation rule

All Cursor-generated UI, copy, specs, and documentation must default to this standard unless the user explicitly requests a different tone or audience.

Programmatic vocabulary (future): ILM corpus `enterprise-design-communication-standard.txt` · path constant `ENTERPRISE_DESIGN_COMMUNICATION_PATH` in `lib/internal-language-model/index.ts`.

---

## Vision

The long-term ambition is for **Aipify Business Operating System (ABOS)** to be trusted at the highest levels of organizational software — not because it shouts the loudest, but because every interaction reflects **discipline, clarity, and humanity**.

> *Enterprise-ready is not a tier. It is the baseline.*
