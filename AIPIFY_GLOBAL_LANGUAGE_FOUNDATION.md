# Aipify Global Language Foundation

## Purpose

Define the default multilingual baseline for Aipify Core. New capabilities ship with full translation-key coverage across six core languages so additional locales can be added later without refactoring.

## Core languages

| Code | Language |
|------|----------|
| `en` | English (default fallback) |
| `no` | Norwegian |
| `sv` | Swedish |
| `da` | Danish |
| `pl` | Polish |
| `uk` | Ukrainian |

These six languages are the **Aipify Core Language Foundation**.

## Mandatory scope

Every new surface must support all core languages before release:

- Modules and centers (Customer App, Platform Admin)
- Business Packs and Industry Packs
- Knowledge Center sections and FAQ entries
- Email and notification templates
- Companion interactions and workflows
- Portal pages (partner, growth, super-admin where user-facing)

## Implementation rules

1. **Translation keys only** — no hardcoded user-facing strings in components, pages, emails, or RPC copy exposed to customers.
2. **Locale files** — `locales/{locale}/{namespace}.json` for each core locale.
3. **Fallback** — English (`en`) is the authoritative baseline; `getDictionary()` merges missing keys from `en`.
4. **Future languages** — add locale folders and extend `LOCALES` / `EXTENDED_LOCALES` in `lib/i18n/config.ts`; do not rename or restructure existing keys.
5. **Quality** — incomplete core-locale packs are technical debt and block feature completion.

## Code reference

| Concern | Location |
|---------|----------|
| Core locale constants | `lib/i18n/config.ts` — `CORE_LOCALES`, `CORE_LOCALE_LABELS` |
| Dictionary loading | `lib/i18n/get-dictionary.ts` |
| Cursor rule | `.cursor/rules/global-language-foundation.mdc` |
| i18n policy | `.cursor/rules/i18n-required.mdc` |
| Super Admin language ops | [SUPER_ADMIN_LANGUAGE_MANAGEMENT.md](./SUPER_ADMIN_LANGUAGE_MANAGEMENT.md) |

## Governance

Company Foundation → Core Foundation → **Global Language Foundation** → Enterprise Design Standard → Implementation

English remains the engineering fallback. Norwegian reflects Aipify Group AS origin; Nordic, Polish, and Ukrainian coverage supports current and planned European operations.
