# AIPIFY_VARIANT_COMMISSION_UI_CORE_RELEASE_VERIFIED

**PR:** https://github.com/aipify-project/aipify-platform/pull/493  
**Gates:** NO_SQL_APPLY · NO_PRODUCTION_DB_WRITE · NO_PRODUCTION_VARIANT_PERSISTENCE · NO_STRIPE · NO_PAYMENT · NO_COMMISSION_ACTIVATION · NO_SECRET_CHANGE

## QA checklist

| # | Check | Result |
|---|---|---|
| 1 | PR vs latest main / conflicts | PASS — merged main; mergeable |
| 2 | API security (Platform Admin + MFA guard) | PASS — `guardPrivilegedPlatformApi` on both routes; Core RPCs also require `is_platform_admin` |
| 3 | Production fail-closed without RPCs | PASS — Production Core has no variant/commission tables/RPCs; env gate `production_fail_closed` |
| 4 | No false save success for variants | PASS — persist fail → error/closed; Production → success + explicit not-saved copy; Saved only after variants API ok |
| 5 | Both admin surfaces same Core data | PASS — editor load/save + Provisjonspriser list use shared Core helpers/RPCs |
| 6 | Automated tests | PASS — 16/16 variant commission unit/persist-flow |
| 7 | Logged-in Staging UI E2E | **BLOCKED** — no authorized test account available; none created |
| 8 | Staging E2E fixture cleanup | PASS — `e2e_ui_free` removed; legacy rates=3, qualified_sales=4 |
| 9 | Merge LIVE with Production fail-closed | pending green Vercel after typefix |
| 10 | Post-deploy Production gate | pending after merge |

## Security notes

- `GET|POST /api/platform/sellers/products/variants`
- `GET /api/platform/sellers/commission-rates/variants`
- Both: session via `createClient` + `guardPrivilegedPlatformApi` (auth + platform admin + MFA when required)
- Writes blocked when Supabase URL is Production or unbound
- `settlement_activated` always false in responses

## Staging UI E2E

**BLOCKED** for authenticated browser flow (Opprett → Lagre → Åpne → Endre → Provisjonspriser).  
No credentials provided; instruction forbids creating/changing test accounts.

## Remaining after LIVE

1. Owner-authorized Staging UI E2E with platform admin login on Staging-bound host
2. Production SQL apply (separate YES) before enabling Production persist
3. Earn/payment activation (separate task)
