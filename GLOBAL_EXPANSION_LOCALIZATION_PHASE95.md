# Global Expansion & Localization Framework — Phase 95

## Vision

**One platform. Local experiences. Global impact.**

Aipify shall feel native wherever it operates.

## Distinction from Global Learning Network

| Feature | `/app/global-learning` (Phase 72) | `/app/global-expansion` (Phase 95) |
|---------|-----------------------------------|-------------------------------------|
| Purpose | Collective intelligence & evolution | Internationalization & localization |
| Focus | Anonymized cross-tenant learning | Languages, regions, compliance readiness |
| Audience | Platform evolution contributors | Global organizations & expansion teams |

## What was built

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20260624000000_global_expansion_localization_phase95.sql` |
| Lib | `lib/aipify/global-expansion/` |
| API | `/api/aipify/global-expansion/*` |
| UI | `/app/global-expansion` — Global Expansion & Localization hub |
| KC FAQ | `content/knowledge/aipify/global-expansion/faq/global-expansion-faq.md` |

## Core capabilities

- **Multi-language architecture** — en, da, no, sv active; future language roadmap
- **Regional configuration** — language, timezone, currency, formatting defaults
- **Localization projects** — interface, KC, notifications, emails, partner assets
- **Country expansion playbooks** — market assessment through launch readiness
- **Terminology governance** — glossary with domain-specific terms
- **International analytics** — adoption, language usage, satisfaction by region
- **Localization QA** — translation quality, terminology, cultural, compliance audits

## Database tables

- `localization_settings` — tenant regional defaults
- `localization_supported_languages`, `localization_language_variants`
- `localization_projects`, `localization_translation_entries`, `localization_translation_reviews`
- `localization_terminology_glossary`, `localization_regional_content`
- `localization_country_playbooks`, `localization_recommendations`
- `localization_audits`, `localization_analytics`
- `localization_briefings`, `localization_audit_log`

## RPCs

- `get_global_expansion_dashboard()` — full localization framework dashboard
- `get_global_expansion_card()` — summary card
- `generate_global_expansion_briefing()` — executive expansion briefing
- `dismiss_localization_recommendation(uuid)` — dismiss recommendation
- `advance_country_playbook(text)` — advance country expansion status

## Integrations

Knowledge Center (localized content), Academy (localized training), Partners (regional enablement), Billing & Commercial (regional currencies), Global Learning Network (distinct purpose)

## Principle

Global success requires local understanding. Technology should adapt to people, not force people to adapt to technology.
