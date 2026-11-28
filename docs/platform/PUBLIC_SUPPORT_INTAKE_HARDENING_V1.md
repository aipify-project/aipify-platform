# Public support intake hardening V1

Prepared only. Do not apply SQL and do not turn public intake on from this document.

Public submission stays closed: `SUPPORT_INTAKE_RPC_CONNECTED` and `SUPPORT_INTAKE_FEATURE_GATE` remain false. Email transport remains false.

## What changed in code

- The public form sends one idempotency key per attempt and reuses it if the request is repeated. The API does not invent a replacement key.
- Web create in the V3 candidate takes a transaction lock on that key before it reads or inserts a ticket. A second concurrent call waits and returns the first ticket. A unique-key conflict raises, so the extra ticket rolls back.
- Public support rate limiting uses Upstash Redis REST. Prefer the Aipify Core pair `AIPIFY_CORE_REDIS_KV_REST_API_URL` + `AIPIFY_CORE_REDIS_KV_REST_API_TOKEN` (write token; never READ_ONLY). When that pair is present but incomplete or invalid, fail closed — do not mix credentials or fall through. When Core is unset, keep legacy compatibility: `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, then Marketplace / KV aliases (`UPSTASH_REDIS_REST_KV_REST_API_URL` / `UPSTASH_REDIS_REST_KV_REST_API_TOKEN`, or `KV_REST_API_URL` / `KV_REST_API_TOKEN`). The counter is shared across Vercel instances. Limit: 8 requests per IP per 15 minutes. The IP is stored as a hash. If the store is missing or errors, the API returns 503 and no ticket number.
- Honeypot, minimum fill time, and the human check stay in place.
- Other public forms still use their existing in-memory guard.

## APP support

`app/api/aipify/support-requests/route.ts` calls `create_app_portal_support_request` only after `getUser()` on the signed-in server client. That session is `authenticated`. The V3 candidate revokes `EXECUTE` from `public` and `anon` on the APP support functions and grants `authenticated`. It does not revoke `service_role`. Logged-in APP support does not use the anon role, so removing anon `EXECUTE` does not change that path.

## Install matrix

Previous Staging install of this candidate used SHA-256 `24bac8714ebc07e3311b47db0a6fe9716d0328c107e1a872cb79a0c796db0a46`. That byte string does not contain the transaction lock. It must not be installed again.

| Candidate | SHA-256 | Staging `auedugihkduoaikfusqe` | Production `qbcqoixhrvhnuwphefvw` |
|---|---|---|---|
| `docs/platform/sql-candidates/platform_support_all_channels_intake_rpc_v3.sql` | `9ba0499f0abe299e14a5880e75136837e2f512bd9af45a41f8d4293eb3f0d616` | Separate YES. Re-apply this file. `CREATE OR REPLACE` and `IF NOT EXISTS` cover objects already present. This file does not insert or change `companies`. | Separate YES. First install. Adds `web` / `partner` to the channel check, the three intake columns, the idempotency table, and the locked functions. Revokes anon `EXECUTE` on the APP support functions. |
| `docs/platform/sql-candidates/platform_company_restore_if_missing_v1.sql` | `20b7364e46b70c82b03c42a8a6c3ad2a0fab0abb5a34c60a12aab549ac64b6ff` | Separate YES, and only because Staging has no `companies` row with `is_platform = true`. Inserts one row when that flag and the slugs `aipify` / `aipify-ai` are both absent. | Do not apply. Production already has platform company `2697c432-d03d-44f6-839c-66200fd20b55`, slug `aipify`. This statement would insert nothing there, and it must still stay out of the Production approval. |

If Staging already has a non-platform company on slug `aipify`, the restore inserts nothing. Stop and decide separately. Do not change that row in this candidate.

## Activation, still separate

After the database YES for the environment the live site uses:

1. Confirm `NEXT_PUBLIC_SUPABASE_URL` for that deployment is the intended Core project.
2. Confirm the Upstash REST variables are present for that deployment.
3. Only then set the two intake gates to true in a later change.

Do not create a test ticket as part of either approval. Do not enable email.
