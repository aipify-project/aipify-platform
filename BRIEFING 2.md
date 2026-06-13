# Briefing System (Phase 60)

Since Last Login and Daily Command Brief — Aipify's calm command center across all modules.

## Philosophy

```
Module Activity → Event Collectors → Priority Ranking → Brief Generator → Dashboard Card → Full Brief
```

Core message: *Dette har skjedd siden sist. Dette er viktig. Dette bør du gjøre nå.*

## Code layout

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20260614900000_briefing_system_phase60.sql` |
| Library | `lib/aipify/briefing/` |
| Collectors | `lib/aipify/briefing/collectors/` |
| Unonight presets | `lib/aipify/briefing/presets/unonight-briefing.ts` |
| FAQ seed | `content/knowledge/aipify/briefing/faq/briefing-faq.md` |
| Customer UI | `/app` (briefing card), `/app/briefing`, `/app/briefing/since-last-login`, `/app/briefing/daily` |
| Settings | `/app/settings/briefing` |

## Tables

- `aipify_user_activity_state` — last login, last brief viewed
- `aipify_briefing_events` — normalized cross-module events
- `aipify_briefing_summaries` — generated briefs
- `aipify_briefing_preferences` — user/role preferences
- `aipify_briefing_actions` — actions taken from briefs
- `aipify_briefing_settings` — tenant toggles and thresholds

## APIs

- `GET /api/aipify/briefing/card`
- `GET /api/aipify/briefing/since-last-login`
- `POST /api/aipify/briefing/since-last-login/generate`
- `POST /api/aipify/briefing/since-last-login/mark-viewed`
- `GET /api/aipify/briefing/daily`
- `POST /api/aipify/briefing/daily/generate`
- `GET /api/aipify/briefing/summaries`
- `GET /api/aipify/briefing/events`
- `POST /api/aipify/briefing/events/collect`
- `GET/PATCH /api/aipify/briefing/settings`
- `POST /api/aipify/briefing/actions`

## Module access

Built on core `executive_briefing_basic` (all plans). Enriched by enabled tenant modules (quality, knowledge, governance, etc.).

## Worker jobs (callable from API / future cron)

| Job | Entry |
|-----|-------|
| `collect_briefing_events` | `collectBriefingEventsJob` |
| `generate_daily_briefs` | `generateDailyBriefJob` |
| `generate_since_last_login` | `generateSinceLastLoginJob` |

## Import Knowledge Center seed

```bash
POST /api/aipify/knowledge/import-seed-content
{ "overwrite": true }
```

Includes `content/knowledge/aipify/briefing/faq/briefing-faq.md` (15 articles).
