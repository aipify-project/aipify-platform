# Registration & Organization Onboarding Redesign

**Feature owner:** SHARED (auth + platform admin + customer provisioning)  
**Canonical route:** `/register`  
**Migration:** `supabase/migrations/20261221000000_organization_registration_onboarding_redesign.sql`

## Vision

People First. Premium but not overwhelming. Registration collects **Day One metadata** for the Aipify Business Operating System (ABOS) — not a throwaway signup form. Humans decide; Aipify prepares the workspace.

Growth Partner terminology is used throughout — never "Affiliate".

## Five-step wizard

| Step | Purpose |
|------|---------|
| 1 — Account Owner | Full name, business email, phone, country, password |
| 2 — Organization | Company name, org/VAT, address, optional website & logo URL |
| 3 — Organization Profile | Industry, employee range, use cases, organization type |
| 4 — Security Setup | 2FA preview — skip or enable after workspace (see below) |
| 5 — Confirmation | Terms, authority, optional product updates → **Create Aipify Workspace** |

Progress is saved in `sessionStorage` (`aipify-registration-wizard`). Password is kept in memory only.

### 2FA architectural choice

Full TOTP enrollment requires an authenticated session tied to a provisioned `users` row. During registration:

- **Step 4** is informational (authenticator apps, recovery codes, trusted devices).
- **Skip for now** → `registration_2fa_skipped = true`
- **Enable after workspace** → redirect to `/app/settings/two-factor` after provisioning (reuses `/api/auth/2fa/*` — no duplicated TOTP logic)

Auth account is created at **Step 1 Continue** via `supabase.auth.signUp()`. Workspace provisioning runs at **Step 5** via `POST /api/auth/register-workspace`.

## Database

### `organization_registration_profiles`

Linked to `customers.id` and `organizations.id`. Stores owner, organization, profile, flags, 2FA registration choices, and `workspace_metadata` jsonb.

Key flags:

- `enterprise_candidate` — auto `true` when `employee_range` is `251-1000` or `1000+`
- `growth_partner_eligible` — auto when `organization_type = growth_partner`
- `verification_status` — `pending` | `verified` | `rejected` (platform admin review)

Existing `customers` columns (`phone`, `organization_number`) are populated during provisioning.

### RPC: `complete_aipify_workspace_registration(p_payload jsonb)`

- Callable by **authenticated** user completing their own registration (no completed profile yet)
- Validates required fields and business email (rejects common free domains via `_awr_is_business_email`)
- Creates: company → customer → payment_profile → trial subscription → tenant profile → organization sync → organization_users (owner) → registration profile → organization_onboarding (welcome)
- Growth Partner: sets tenant metadata flags for future GP ops center, university, marketplace
- Returns `{ organization_id, customer_id, slug, redirect_path }`

### Platform admin

`list_platform_customer_records()` extended with LEFT JOIN to registration profiles:

- owner_name, phone, organization_number, industry, workspace_type, verification_status, two_factor_status, growth_partner_status, employee_size, website, enterprise_candidate

Client-side filters in `CustomersTable`: workspace type, verification, enterprise candidate.

## Code map

| Layer | Path |
|-------|------|
| Wizard UI | `components/auth/RegistrationWizard.tsx` |
| Validation | `lib/auth/registration/` |
| API | `app/api/auth/register-workspace/route.ts` |
| Platform table | `components/platform/CustomersTable.tsx` |
| i18n | `locales/{en,no,sv,da}/auth.json` (`auth.wizard.*`), `platform.json` (`platform.customers.*`) |

## Post-registration redirect

Default: `/app/install?onboarding=welcome`  
With 2FA opt-in: `/app/settings/two-factor?return=...`

Distinct from **Customer Onboarding Engine (A.10)** at `organization_onboarding` — that begins after workspace exists.
