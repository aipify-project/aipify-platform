# Super Admin Language Management System

## Vision

Adding a new language should be an **administrative action**, not a software development project. If Aipify gains customers in a new country, Super Admin can activate support for that language quickly and professionally.

**Route:** `/platform/language-center`

**Feature owner:** PLATFORM ADMIN

## Core principle

Every user-facing text in Aipify must be translation-key based. Hardcoded strings are forbidden.

## Super Admin capabilities

| Capability | Description |
|------------|-------------|
| Language Center | View active/inactive languages, add languages, enable/disable, monitor progress |
| Auto-generation | Generate translation packs from English baseline without developer JSON editing |
| Quality Center | Completeness %, missing keys, fallback warnings, audit log |
| Publish | Activate language platform-wide — no redeploy required |
| Rollback | Restore previous published language versions (2FA required) |

## Language status

- **Active** — available platform-wide
- **In Review** — native reviewer approval pending
- **Translation Required** — pack generated, needs review
- **Draft** — initial state
- **Disabled** — not selectable by tenants or users

## Multi-tenant control

| Role | Control |
|------|---------|
| Super Admin | Defines global languages, publishes packs, maintains standards |
| Tenant Admin | Chooses approved languages for organization, sets default |
| End User | Selects preferred language from tenant-enabled list |

## Fallback rules

1. User preferred language
2. Organization default language
3. English
4. Humanized key label (never raw `dashboard.executive.title`)

## Security

- Publishing and rollback require **Super Admin** + **2FA session verification**
- Full audit log in `platform_language_audit_logs`

## Implementation

| Layer | Location |
|-------|----------|
| Migration | `supabase/migrations/20261381000000_super_admin_language_management_system.sql` |
| Lib | `lib/platform/language-center/` |
| i18n runtime | `lib/i18n/get-dictionary.ts`, `lib/i18n/translate.ts`, `lib/i18n/published-pack.ts` |
| API | `/api/platform/language-center/actions` |
| UI | `/platform/language-center` |

## Expansion roadmap

- **Phase 1:** en, no, sv, da (file-backed, active)
- **Phase 2:** de, nl, fi
- **Phase 3:** fr, es, it, pl, pt
- **Phase 4:** ja, ko, zh, ar, hi

## Distinction from Global Expansion (Phase 95)

| Feature | `/platform/language-center` | `/app/global-expansion` |
|---------|----------------------------|-------------------------|
| Layer | Platform Admin | Customer App |
| Purpose | Global language packs & publishing | Tenant regional expansion planning |
| User | Aipify Super Admin | Customer expansion teams |
