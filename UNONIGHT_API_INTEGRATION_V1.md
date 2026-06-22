# UNONIGHT_API_INTEGRATION_V1

| Field | Value |
|-------|-------|
| **Marker** | `UNONIGHT_API_INTEGRATION_V1` |
| **Status** | `PRODUCTION_VERIFIED` |
| **State** | `FROZEN` |
| **Change policy** | `DEFECT_OR_APPROVED_REQUIREMENT_ONLY` |
| **Verified** | 2026-06-22 — Unonight APP owner, production |

## Final verified state

| Setting | Value |
|---------|-------|
| Provider | `unonight` |
| Base URL | `https://www.unonight.com` |
| Endpoint | `GET https://www.unonight.com/api/aipify/v1/connection` |
| Access | Read-only |
| Connection status | Connected and verified |
| Organization | Unonight |

**Scopes (effective after normalization):**

- `metadata.read`
- `organization.read`
- `integration.status.read` (controlled compatibility — implicit when live connection returns `status: connected` with read-only metadata/org scopes)

**Production behavior confirmed:**

- Secure credential storage works
- Correct base URL persists
- Connection test returns success
- Verification status persists after reload
- Repeated connection tests succeed
- Connected integration appears in the integration overview
- No API key exposed in browser or UI
- Unonight remains organization-scoped
- No Unonight-specific access bypass

## Freeze rule

**Freeze the Unonight API Integration V1 implementation.**

Do not redesign, replace, rename, refactor, or migrate the working integration unless a **verified production defect** or **explicitly approved requirement** requires it.

### Do not change

- Unonight endpoint
- Provider key (`unonight`)
- Credential-storage flow
- Connection test contract
- Compatibility parser (`lib/unonight/connection/contract-parser.ts`)
- Organization matching (UUID + slug `unonight`)
- Scope validation and controlled implicit `integration.status.read`
- Read-only access model
- Canonical integration status flow
- Activation, deactivation, and removal flows
- Verification persistence

Do **not** replace the controlled compatibility parser with a stricter schema that rejects the current valid Unonight response.

### Locked compatibility support

The parser must continue to support:

- `status: "connected"` (without `ok` / `connected` booleans)
- `read_only: true` (boolean, without `access_mode`)
- Organization ID/slug `unonight` (slug namespace vs platform UUID)
- Controlled implicit `integration.status.read` scope
- Optional `{ data: ... }` response wrapper

## Production contract

Live Unonight response (verified):

```json
{
  "status": "connected",
  "read_only": true,
  "api_version": "v1",
  "scopes": ["metadata.read", "organization.read"],
  "organization": { "id": "unonight", "name": "Unonight" }
}
```

Aipify normalizes this into the canonical internal contract. This compatibility behavior is **approved and locked**.

## Security rules

The API key must always remain:

- Encrypted at rest
- Organization-scoped
- Unavailable to client-side code after storage
- Excluded from logs, query strings, browser responses, page source, analytics, and error reporting

Never display the full token again after saving. Only a safe masked hint may be shown.

Do not place secrets in source code, environment examples, migrations, fixtures, seed data, test snapshots, screenshots, or console output.

## Code ownership map

| Concern | Location |
|---------|----------|
| Compatibility parser | `lib/unonight/connection/contract-parser.ts` |
| Live connection test | `lib/unonight/connection/test-connection.ts` |
| APP portal test runner | `lib/unonight/connection/run-test.ts` |
| Credential crypto | `lib/unonight/connection/crypto.ts` |
| Test API route | `app/api/app-portal/integrations/test/route.ts` |
| Save API route | `app/api/app-portal/integrations/save/route.ts` |
| Regression tests | `lib/unonight/connection/unonight-connection.test.ts` |
| Unonight platform endpoint (reference) | `app/api/aipify/v1/connection/route.ts` |
| Customer UI | `components/app/app-portal/`, `components/app/integration-setup/` |
| i18n | `locales/{en,no,sv,da,pl,uk}/customer-app/portalStructure.json` |

## Change control

Any future change must include:

1. Documented production defect or approved requirement
2. Backward compatibility analysis
3. Security review
4. Unit tests
5. Typecheck
6. Real authenticated production verification
7. Confirmation that the current connection remains usable
8. A rollback plan

Do not make opportunistic cleanup while redesigning unrelated APP pages. Do not include this integration in broad refactoring tasks.

## Regression tests

Run:

```bash
npx tsx lib/unonight/connection/unonight-connection.test.ts
```

Coverage includes: valid production response, `{ data: ... }` wrapper, `status: connected`, `read_only: true`, organization slug matching, required scopes, revoked/invalid token, malformed JSON, provider mismatch, organization mismatch, unsupported API version, connection not established.

Tests must **never** contain a live API key.

## User experience (locked)

Verified state copy:

- ✅ Unonight er tilkoblet og verifisert
- Access type: Skrivebeskyttet tilgang

Integration overview must show Unonight as connected and verified after reload.

## Localization

Preserve localization for `en`, `no`, `sv`, `da`, `pl`, `uk`. Text improvements may be made without changing API or verification logic.

---

**UNONIGHT_API_INTEGRATION_V1 — complete, verified, frozen.**
