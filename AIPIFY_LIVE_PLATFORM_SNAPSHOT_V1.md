# AIPIFY_LIVE_PLATFORM_SNAPSHOT_V1

## Freeze marker

| Field | Value |
|---|---|
| **STATUS** | PRODUCTION_VERIFIED |
| **PRESENTATION** | COMPLETE |
| **LOCALIZATION** | COMPLETE |
| **ACTIVE_LANGUAGES** | no, en, sv, da, es, pl, uk |
| **CUSTOMER_STANDARD** | APPROVED |
| **STATE** | FROZEN |
| **CHANGE_POLICY** | DEFECT_OR_APPROVED_REQUIREMENT_ONLY |

## Scope

Reusable customer-facing presentation standard for verified live platform snapshot answers (Unonight first; extensible to future providers).

## Frozen surfaces

- Generic provider presentation registry: `lib/live-platform-snapshot/presentation-registry.ts`
- Platform snapshot card builder: `lib/companion-platform-knowledge/platform-snapshot-card.ts`
- Platform snapshot answer builder: `lib/companion-platform-knowledge/platform-snapshot-answer.ts`
- Companion card UI: `components/app/companion-experience/CompanionPlatformSnapshotCard.tsx`
- i18n namespace: `customerApp.companionPlatformKnowledge.platformSnapshot` in all seven active APP locales

## Explicitly not changed (connection V1)

- Unonight connection contract parser and endpoint flow
- Token handling, organization isolation, live routing, verification logic
- Platform snapshot compatibility parser: `lib/unonight/platform-snapshot/contract-parser.ts`

## Canonical active-language source

`lib/i18n/customer-active-locale-registry.ts` → `CUSTOMER_ACTIVE_LOCALE_ORDER`

## Companion locale source

Authenticated user selected APP language via shared locale resolution (`resolveCustomerActiveLocale`, organization default, English fallback).

## Provider vs UI languages

- **Aipify UI languages:** all active registry locales (no, en, sv, da, es, pl, uk)
- **Unonight reported locales:** only locales returned by live platform metadata (expected no, en, sv, da)
