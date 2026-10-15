# AIPIFY — PLATFORM PASSWORD RECOVERY SUPPORT AUTH/EMAIL & I18N V1 — RESULT

| Field | Value |
|---|---|
| **Verdict** | **PARTIAL** — UI/i18n + error-mapping **FIXED**; **email delivery NOT VERIFIED** (provider/SMTP still failing for owner observation) |
| Branch | `fix/platform-password-recovery-support-auth-email-i18n-v1` |
| Base | `origin/main` @ `d05de306` |
| Frozen WK | **46/46** |
| Step B stash | **intact** |
| UnoNight | **untouched** |

---

## 1. Cause

| Layer | Status |
|---|---|
| UI showing `Error sending recovery email.` | **VERIFIED** — `POST /api/auth/forgot-password` returned raw Supabase `error.message`; form displayed it verbatim |
| Account `support@aipify.ai` | **VERIFIED RO** — exists in `auth.users`, email confirmed, Platform role `super_admin` |
| Why Auth failed to send | **HYPOTHESIS** — GoTrue recovery send/SMTP/provider failure (message matches Auth “Error sending recovery email.”). Not missing user. Not fixed in this job (no provider/secret changes allowed) |

---

## 2. Code changes

| File | Change |
|---|---|
| `lib/auth/forgot-password.ts` | Map provider errors → stable codes; anti-enumeration for unknown-user messages; safe logging |
| `lib/auth/forgot-password.test.ts` | Unit + locale + frozen + route/form contract tests |
| `app/api/auth/forgot-password/route.ts` | Return codes only; never `error.message` |
| `components/auth/ForgotPasswordForm.tsx` | Resolve codes via labels |
| `app/forgot-password/page.tsx` | Pass new labels |
| `locales/{en,no,sv,da,pl,uk,es}/auth.json` | `forgotPassword.errors.*` + neutral success copy |

---

## 3. Test matrix

| Gate | Result |
|---|---|
| Unknown-account → neutral success (mapper) | **PASS** |
| Provider “Error sending recovery email.” → `delivery_failed` | **PASS** |
| Rate-limit mapping | **PASS** |
| No raw provider text in UI path | **PASS** |
| 7 locales (`en no sv da pl uk es`) | **PASS** |
| Redirect builder / recovery-flow tests | **PASS** |
| Frozen WK 46/46 | **PASS** |
| Full typecheck / production build | **NOT RUN** locally (Vercel CI is gate) |
| Live email send / inbox receive / reset complete | **NOT RUN** (no unsolicited test email; delivery still blocked at provider) |
| Authenticated browser QA | **NOT RUN** |

---

## 4. Status split (required honesty)

| Claim | Status |
|---|---|
| Code LIVE (after merge) | pending CI/merge |
| Localized / non-enumerating public errors | **YES** after LIVE |
| Email delivery verified | **NO** |
| Full recovery E2E verified | **NO** |

---

## 5. Exact next owner action (delivery)

Inspect **Supabase Auth → Email / SMTP** for project `qbcqoixhrvhnuwphefvw` (custom SMTP credentials, rate limits, sender domain). Re-try Forgot password for `support@aipify.ai` only after provider is healthy. Do **not** treat UI localization as proof of inbox delivery.
