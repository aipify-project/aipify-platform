# Platform Support — APP SoT read integration contract V1

**Status:** Prepare only — RPCs are authored under `docs/platform/NOT_APPLIED_…sql` and are **not applied**.  
**UI wiring:** Forbidden in the prepare job.  
**Related SQL:** `docs/platform/NOT_APPLIED_platform_support_tickets_cross_tenant_read_rpc_v1.sql`

## Role policy (owner-approved for apply)

| Caller | List / get / counts |
|--------|---------------------|
| Active `platform_admins.role = super_admin` | Allowed |
| Active `platform_admins.role = platform_support` | Allowed |
| Customer APP authenticated user | Denied (`_ppsf258_require_platform_access`) |
| `anon` / `PUBLIC` | No execute grant |

Writes, outbound replies, and email remain a **separate** owner job (may tighten to super_admin + confirmation).

## Future Platform API (next job after SQL apply)

Suggested thin route (not created here):

- `GET /api/platform-portal/support-requests` → `list_platform_app_portal_support_requests`
- `GET /api/platform-portal/support-requests/[id]` → `get_platform_app_portal_support_request`
- `GET /api/platform-portal/support-requests/counts` → `get_platform_app_portal_support_request_counts`

Rules:

1. Server-side session must prove Platform admin via existing portal auth helpers (same as other `platform-portal` routes).
2. Never accept a client-supplied “role” or “isAdmin” flag.
3. Map stable status/channel/priority codes through Platform i18n labels — never show raw codes as primary UI.
4. List uses `description_preview`; detail uses bounded `description` + `timeline`.
5. Treat `source_locale: null` as “unknown / not stored” — do not invent from operator UI locale.

## KPI rules (mandatory)

| Allowed | Forbidden as ticket KPIs |
|---------|---------------------------|
| Counts from `get_platform_app_portal_support_request_counts` | `usage_statistics.support_requests_handled` |
| Pagination `total` from list RPC | `get_platform_dashboard_snapshot.support_resolved` |
| Empty list when APP SoT has zero rows | Empty `list_platform_support_queue` labelled as “no tickets” |
| | Since-last-login “N support requests resolved” as ticket volume |

Never sum APP tickets + ASO cases + usage_statistics into one number.

## Channel → four sources (ingest later)

Existing DB channels: `app_portal`, `email`, `chat`, `phone`, `assistant`.

| Desired Platform filter | Today | Later |
|-------------------------|-------|-------|
| Aipify public website | No ticket write | Additive intake + channel/source marker |
| Kompis Web | Frozen ask/FAQ | Optional human-request → ticket; Web entitlement badge |
| Kompis Bedrift / APP | `app_portal` SoT | Primary |
| Selgere | No partner ticket table | Escalation RPC + attribution only |

Do not auto-route or invent channel for historical rows.

## Locale / translation (later)

1. Add optional `source_locale` column in a **named** migration (not this prepare SQL).
2. Dual-view UI: original + machine-suggested translation labelled; human approve before send.
3. No AI/provider calls in read RPC apply job.

## Empty states (UI job)

- APP SoT empty → “No customer support requests yet” (i18n).
- Do not show legacy queue empty copy for APP SoT.
- Auth failure → generic access denied (no table leak).
