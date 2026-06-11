# Quality Guardian (Phases 58–59)

Aipify's software and frontend health monitor — observes expected behaviour, detects deviations, creates incidents and developer reports, and recommends improvements without automatic production changes.

## Philosophy

```
Expected Behaviour → Health Checks → Deviation Detection → Incident → Developer Report → Recommendations → Knowledge Center
```

## Code layout

| Area | Path |
|------|------|
| Phase 58 migration | `supabase/migrations/20260614600000_quality_guardian_phase58.sql` |
| Phase 59 migration | `supabase/migrations/20260614700000_frontend_experience_guardian_phase59.sql` |
| Library | `lib/aipify/quality/` |
| Image Guardian | `lib/aipify/quality/image-guardian.ts` |
| Performance Guardian | `lib/aipify/quality/performance-guardian.ts` |
| Mobile checks | `lib/aipify/quality/mobile-checks.ts` |
| Frontend scanner | `lib/aipify/quality/frontend-scanner.ts` |
| Unonight checks (Phase 58) | `lib/aipify/quality/presets/unonight-checks.ts` |
| Unonight frontend (Phase 59) | `lib/aipify/quality/presets/unonight-frontend-checks.ts` |
| FAQ seed (Phase 58) | `content/knowledge/aipify/faq/quality-guardian.md` |
| FAQ seed (Phase 59) | `content/knowledge/aipify/quality/` |
| Customer UI | `/app/quality`, `/app/quality/images`, `/app/quality/performance`, `/app/quality/mobile` |
| Settings | `/app/settings/quality` |

## Tables

- `aipify_quality_settings` — observation mode, scan thresholds, frontend toggles
- `aipify_quality_checks` — expected behaviour definitions
- `aipify_quality_scan_runs` — scan history
- `aipify_quality_incidents` — open/resolved issues with full report fields
- `aipify_quality_reports` — admin and developer report bodies
- `aipify_quality_recommendations` — suggested fixes (approval required)
- `aipify_quality_incident_events` — incident timeline
- `aipify_quality_assets` — scanned images, scripts, fonts (Phase 59)
- `aipify_quality_page_snapshots` — per-viewport page weight metrics (Phase 59)

## APIs

- `GET /api/aipify/quality/dashboard`
- `GET /api/aipify/quality/incidents`
- `GET /api/aipify/quality/reports`
- `POST /api/aipify/quality/reports/generate`
- `GET /api/aipify/quality/scans`
- `POST /api/aipify/quality/scans/run`
- `POST /api/aipify/quality/incidents/:id/resolve`
- `GET/PATCH /api/aipify/quality/settings`
- `GET /api/aipify/quality/images`
- `GET /api/aipify/quality/images/largest`
- `GET /api/aipify/quality/images/issues`
- `GET /api/aipify/quality/performance/pages`
- `GET /api/aipify/quality/mobile/incidents`

## Pilot / observation mode

- `observation_mode = true` by default
- `auto_fix_enabled = false` always enforced on enable attempts
- Incidents create draft reports and recommendations
- Knowledge gaps opened when documentation is missing
- All scans and resolutions logged via TACC audit timeline
- No automatic production image replacement or deploys

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
| `scan_tenant_images` | `runFrontendExperienceScan(..., 'images')` |
| `scan_tenant_performance` | `runFrontendExperienceScan(..., 'performance')` |
| `scan_mobile_experience` | `runFrontendExperienceScan(..., 'mobile')` |
| `scan_localization_quality` | `runFrontendExperienceScan(..., 'localization')` |
| `generate_guardian_report` | `generateGuardianReportJob` |
| `generate_developer_report` | `generateGuardianReportJob('developer_report')` |
| `create_quality_summary` | `runQualityScanJob(..., 'summary')` |

## Import Knowledge Center seed

```bash
POST /api/aipify/knowledge/import-seed-content
```

Include `content/knowledge/aipify/quality/` and `content/knowledge/unonight/quality/` in the global seed import flow.
