# Aipify Security Implementation — Two-Factor Authentication Code System

## Feature owner

**SHARED** — Supabase auth sessions, Core RPCs, Customer App settings UI, and auth routes.

## Vision

Aipify sign-in verification adds a second step after password login for privileged accounts and optional users. Phase 1 ships **authenticator TOTP**; Phase 2 ships **recovery codes** at enrollment; Phase 3 (**SSO / passkeys**) is documented only.

> Aipify informs and prepares — humans decide. Verification never replaces human accountability for sensitive actions (Trust & Action Engine).

## Phases

| Phase | Scope | Status |
|-------|--------|--------|
| 1 | Authenticator TOTP (RFC 6238) | Shipped |
| 2 | Single-use recovery codes (10 at enrollment) | Shipped |
| 3 | SSO, passkeys, WebAuthn | Future — not in this migration |

## Architecture

```text
Password login (Supabase Auth)
        ↓
GET /api/auth/2fa/status  (+ session fingerprint)
        ↓
   needs enrollment?  → /app/settings/two-factor
   needs verification? → /verify-2fa
        ↓
mark_session_two_factor_verified(session fingerprint)
        ↓
Customer App / Platform Admin
```

### Session gate

- Supabase session alone is **not fully trusted** until `two_factor_session_verifications` marks the session fingerprint verified.
- Fingerprint = SHA-256 hash of access token (never stored raw).
- `TwoFactorSessionGate` in `/app` and `/platform` layouts enforces the gate client-side; `ensureTwoFactorVerified()` available for server routes.

### Secret handling

- TOTP secrets generated with **otplib** in API routes.
- Ciphertext stored in `user_two_factor_settings.totp_secret_encrypted` using **AES-256-GCM** and `TOTP_ENCRYPTION_KEY` (32-byte base64).
- Plaintext secrets, codes, and recovery values are **never logged**.

## Database

Migration: `supabase/migrations/20261202000000_two_factor_authentication_system.sql`

| Table | Purpose |
|-------|---------|
| `user_two_factor_settings` | Per-user TOTP state (encrypted secret, pending enrollment) |
| `user_two_factor_recovery_codes` | Hashed single-use recovery codes |
| `two_factor_verification_challenges` | Post-login challenge (10 min TTL, 5 attempts, 15 min lockout) |
| `two_factor_session_verifications` | Verified session fingerprints |
| `organization_two_factor_policies` | Org-wide enforcement and role lists |
| `two_factor_audit_logs` | Metadata-only audit trail |

### Role requirements — `user_requires_two_factor()`

**Mandatory:** platform admins (`super_admin`, `platform_support`), organization `owner` / `administrator`, legacy `users.role` owner/admin, scaffolds for `billing_admin`, `security_admin`, `growth_partner`.

**Optional:** staff, viewer, trial — unless `organization_two_factor_policies.enforce_all_users` or `required_roles` applies.

## RPCs

- `get_two_factor_status(p_session_fingerprint)`
- `begin_two_factor_enrollment()` — app layer generates secret; RPC stores pending ciphertext
- `confirm_two_factor_enrollment(p_recovery_code_hashes)` — after app verifies first TOTP
- `disable_two_factor()` — blocked when policy requires 2FA
- `regenerate_two_factor_recovery_codes(p_recovery_code_hashes)`
- `create_two_factor_challenge(p_user_id, p_ip_hash)`
- `verify_two_factor_challenge(p_challenge_id, p_code, p_use_recovery)` — recovery path in SQL; TOTP verified in API then `_tfa_complete_challenge`
- `mark_session_two_factor_verified(p_session_fingerprint)`
- `is_session_two_factor_verified(p_session_fingerprint)`
- `log_two_factor_audit_event(...)`

Audit event types: `enabled`, `disabled`, `verification_success`, `verification_failed`, `recovery_code_used`, `recovery_codes_regenerated`, `admin_enforced`, `suspicious_attempt`.

## Application layer

| Path | Role |
|------|------|
| `lib/auth/two-factor/totp.ts` | Secret, otpauth URI, verify |
| `lib/auth/two-factor/encryption.ts` | AES encrypt/decrypt |
| `lib/auth/two-factor/recovery-codes.ts` | Generate + hash recovery codes |
| `lib/auth/two-factor/session-fingerprint.ts` | Session fingerprint |
| `lib/auth/ensure-two-factor-verified.ts` | Server redirect helper |

## API routes

- `GET /api/auth/2fa/status`
- `POST /api/auth/2fa/enroll/begin`
- `POST /api/auth/2fa/enroll/confirm`
- `POST /api/auth/2fa/disable`
- `POST /api/auth/2fa/recovery/regenerate`
- `POST /api/auth/2fa/challenge`
- `POST /api/auth/2fa/verify`
- `POST /api/auth/2fa/recovery/verify`

## UI

| Route | Component |
|-------|-----------|
| `/verify-2fa` | GitHub-style six-digit card — `TwoFactorVerifyForm` |
| `/app/settings/two-factor` | Enrollment, recovery codes, disable/regenerate |

## Environment

| Variable | Description |
|----------|-------------|
| `TOTP_ENCRYPTION_KEY` | Required. 32 random bytes, base64-encoded. Generate: `openssl rand -base64 32` |

## Cross-links

- [IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md](./IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md) — MFA readiness scaffold extended by this implementation
- [ARCHITECTURE.md](./ARCHITECTURE.md) — layer ownership and routes
- KC FAQ: `content/knowledge/aipify/security/faq/two-factor-authentication-faq.md`

## Future (Phase 3)

- Enterprise SSO (SAML/OIDC) as primary auth with optional step-up TOTP
- Passkeys / WebAuthn for passwordless + step-up
- SMS/email OTP explicitly out of scope for Phase 1 (authenticator preferred)
