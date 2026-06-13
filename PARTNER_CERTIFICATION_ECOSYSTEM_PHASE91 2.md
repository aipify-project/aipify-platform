# Partner & Certification Ecosystem — Phase 91

## Vision

**Enable others to succeed with Aipify.**

Aipify empowers professionals and organizations to become trusted implementation and advisory partners through training, validation, and recognition.

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260620000000_partner_certification_ecosystem_phase91.sql` |
| Lib | `lib/aipify/partner-certification/` |
| API | `/api/aipify/partner-certification/*` |
| UI | `/app/partners` — Partner Portal & Directory |
| KC FAQ | `content/knowledge/aipify/partner-certification/faq/partner-certification-faq.md` |

## Database tables

- `partner_ecosystem_profiles` — partner profiles with types and tiers
- `partner_certification_tracks` — certification framework areas
- `partner_certification_progress` / `partner_certification_attempts` — tracking and assessments
- `partner_digital_credentials` — verifiable digital badges
- `partner_ecosystem_scorecards` — partner performance evaluation
- `partner_ecosystem_resources` — resource library
- `partner_lead_registrations` — lead referral program
- `partner_compliance_records` — code of conduct and compliance
- `partner_recognition_awards` — excellence recognition
- `partner_ecosystem_settings`, `partner_ecosystem_briefings`, `partner_ecosystem_audit_log`

## Partner types

Implementation, Certified Consultant, Development, Technology, Strategic Alliance, Training, Managed Service, Reseller

## Partner tiers

Registered → Certified → Advanced → Premier → Strategic

## Certification areas

Aipify Foundations, Support AI Specialist, Governance Specialist, Enterprise Deployment, Commerce Specialist, Integration Specialist, Strategic Intelligence Specialist

## RPCs

- `get_partner_ecosystem_dashboard()` — Partner Portal dashboard
- `get_partner_ecosystem_card()` — summary card
- `generate_partner_ecosystem_briefing()` — executive briefing
- `verify_partner_credential(text)` — public credential verification
- `register_partner_lead(...)` — lead referral registration
- `accept_partner_compliance(uuid, text)` — compliance acceptance

## Integrations

Knowledge Center, Aipify Academy (future), Billing, Enterprise Deployment, Marketplace Governance, Ecosystem Intelligence

## Human oversight

High-impact program decisions require human approval. All governance actions are audit-logged.
