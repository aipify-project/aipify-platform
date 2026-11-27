# Platform Operations — Complete Functional Repair V3 (2026-11-27)

## Scope

Platform Dashboard + Drift hubs: Oversikt, Plattformstatus, Installasjoner, Hendelseslogg, Pilotkontroll, Publiseringer, Nettsideverifisering, Historikk, Kompis.

Branch: `fix/platform-ops-functional-repair-v3-20261127`  
Base: `origin/main` @ `2f257ffa8`  
No SQL applied in this job.

## Root causes vs hypotheses

| Symptom | Cause (verified in code) | Fix |
|---|---|---|
| Sidebar/hub “jump” on soft-nav | Platform `GroupedSidebar` re-hydrated expanded groups from localStorage on every `activeGroupId` change | Mount/viewport hydrate once; soft-nav only ensures active hub is visible |
| Publish hub felt like a hop | `/platform/operations/publish-verify` → redirect → deployments | Canonical href `/platform/operations/deployments` |
| Driftsoversikt full-page error | UI required both `record_platform_admin_login` and snapshot | Snapshot required; session optional with safe fallback |
| Install “Frisk” + never synced | Health ignored sync freshness | Never-synced / ≥24h sync → `attention`; automation requires fresh sync |
| Huge minute strings | Raw `{count} minutes` for multi-day ages | Hours/days labels |
| Hendelseslogg / Publiseringer empty placeholders | Pages not wired to existing feeds | Actions feed + updates panel; RPC-missing distinct from empty |
| Checksum “mismatch” when absent | Null actual treated as mismatch | Absent/unchecked → neutral `absent` |
| Pilot/Kompis/verify narrow rails | Local `max-w-*` wrappers | Full Platform width |
| Publiseringer empty on Prod | `list_platform_updates` missing on connected Core | Fail-closed UI + SQL candidate (not applied) |

## Data source matrix

| Surface | Source | Backend | Display | Notes |
|---|---|---|---|---|
| Dashboard overview KPIs | `get_platform_dashboard_snapshot` | Prod RPC present | PlatformOverviewPanel | Partial load OK if session RPC fails |
| Installations | `list_platform_installations` | Prod RPC present | PlatformInstallationsPanel | Health policy documented (24h stale) |
| Hendelseslogg | `list_platform_actions` | Prod Action Engine | PlatformActionsListPanel | Admin/action history — not full telemetry |
| Publiseringer | `list_platform_updates` | **Missing on Prod** | PlatformUpdatesPanel | Shows RPC-missing state; candidate package ready |
| Nettsideverifisering | `/api/platform-portal/website-verification*` | Existing APIs | WebsiteReleaseVerificationPanel | Historical run ≠ current readiness; checksum absent ≠ mismatch |
| Pilot | existing Unonight pilot panels | Existing | Full width | No Production mode changes in this job |
| Kompis | `/api/platform-portal/kompis-ai-status` | Existing | KompisAiGovernancePanel | Circuit breaker copy already scoped; unknown orgs → `—`; dates localized |
| Governance activity log | foundation panel | Placeholder | Linked from Hendelseslogg | Still structure-only |

## SQL candidate (not applied)

- Path: `docs/platform/sql-candidates/list_platform_updates_rpc_prod_port_v1.sql`
- SHA256: see sibling `.sha256`
- Target: Production Core (and Staging if parity required)
- Approval text: `Approve apply of list_platform_updates_rpc_prod_port_v1 to Production Core`
- Dependency: `platform_updates` / `platform_update_targets` / `is_platform_admin()`

## Tests

| Suite | Result |
|---|---|
| `lib/platform/drift-hub.test.ts` | PASS (7) |
| `lib/design/platform-layout.test.ts` | PASS (3) |
| `lib/platform/nav-master-structure.test.ts` | PASS (6) |
| Logged-in Production browser QA | NOT_RUN (no session in agent) |
| Live provider check / publish / emergency-stop mutation | NOT_RUN (out of scope / safety) |

## Remaining blockers

1. **Publiseringer history rows** blocked until `list_platform_updates` is applied on Core (candidate above).
2. **Dashboard KPI drilldown nuances** (4 group vs 2 ops customers, support-admin role definition) rely on existing portal dashboard RPCs; no false-zero cosmetics applied. Owner login verification still required after LIVE.
3. Governance `/platform/governance/activity-logs` remains foundation placeholder — separate from Drift action feed.

## Owner test links (after LIVE)

- `/platform`
- `/platform/operations/overview`
- `/platform/operations/platform-health`
- `/platform/installations`
- `/platform/operations/audit-logs`
- `/platform/unonight-pilot`
- `/platform/operations/deployments`
- `/platform/website-verification`
- `/platform/kompis-ai`
