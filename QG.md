# Quality Guardian (Phase 58)

Aipify's software health monitor — observes expected behaviour, detects deviations, creates incidents and developer reports, and recommends improvements without automatic production changes.

## Philosophy

```
Expected Behaviour → Health Checks → Deviation Detection → Incident → Developer Report → Recommendations → Knowledge Center
```

## Code layout

| Area | Path |
|------|------|
| Migration | `supabase/migrations/20260614600000_quality_guardian_phase58.sql` |
| Library | `lib/aipify/quality/` |
| Scanners | `lib/aipify/quality/scanners/` |
| Unonight checks | `lib/aipify/quality/presets/unonight-checks.ts` |
| FAQ seed | `content/knowledge/aipify/faq/quality-guardian.md` |
| Customer UI | `/app/quality`, `/app/quality/incidents`, `/app/quality/reports`, `/app/quality/scans` |
| Settings | `/app/settings/quality` |

## Tables

- `aipify_quality_settings` — observation mode (default on), auto_fix (default off)
- `aipify_quality_checks` — expected behaviour definitions
- `aipify_quality_scan_runs` — scan history
- `aipify_quality_incidents` — open/resolved issues with full report fields
- `aipify_quality_reports` — developer report bodies
- `aipify_quality_recommendations` — suggested fixes (approval required)
- `aipify_quality_incident_events` — incident timeline

## APIs

- `GET /api/aipify/quality/dashboard`
- `GET /api/aipify/quality/incidents`
- `GET /api/aipify/quality/reports`
- `GET /api/aipify/quality/scans`
- `POST /api/aipify/quality/scans/run`
- `POST /api/aipify/quality/incidents/:id/resolve`
- `GET/PATCH /api/aipify/quality/settings`

## Pilot / observation mode

- `observation_mode = true` by default
- `auto_fix_enabled = false` always enforced on enable attempts
- Incidents create draft reports and recommendations
- Knowledge gaps opened when documentation is missing
- All scans and resolutions logged via TACC audit timeline

## Module access

`quality_guardian` — Business and Enterprise plans.

## Worker jobs (callable from API / future cron)

| Job | Entry |
|-----|-------|
| `scan_links` | `runAllQualityScanners` → link_monitor |
| `validate_workflows` | workflow_validator scanner |
| `monitor_integrations` | integration_monitor scanner |
| `detect_translation_gaps` | translation_monitor scanner |
| `detect_mobile_issues` | mobile_monitor scanner |
| `generate_reports` | `_qg_create_incident` + report insert |
| `create_quality_summary` | `runQualityScanJob(..., 'summary')` |

## Import Knowledge Center seed

Use existing import route after migration:

```bash
POST /api/aipify/knowledge/import-seed-content
```

Or include `quality-guardian.md` in the global Aipify seed import flow.
