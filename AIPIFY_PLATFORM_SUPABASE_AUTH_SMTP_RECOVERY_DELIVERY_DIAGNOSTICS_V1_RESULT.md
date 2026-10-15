# AIPIFY_PLATFORM_SUPABASE_AUTH_SMTP_RECOVERY_DELIVERY_DIAGNOSTICS_V1_RESULT

## Status

**PARTIAL — root cause identified (SMTP reject). Recovery NOT FIXED.**

Inbox delivery and completed password reset remain **NOT VERIFIED**. No Auth/SMTP/DNS mutation and no test email were performed in this job.

## Baseline

| Item | Value |
|---|---|
| Worktree | `/Users/veltrix/Development/aipify-platform-supabase-auth-smtp-recovery-delivery-diagnostics-v1` |
| Branch | `docs/platform-supabase-auth-smtp-recovery-delivery-diagnostics-v1` |
| Tip at diagnose | `3768155b` (= `origin/main`, includes PR #225) |
| Scope | Read-only Auth/SMTP delivery diagnostics + RESULT only |
| Code diff | None (no app/Auth code change required) |
| Core project | `qbcqoixhrvhnuwphefvw` (Aipify Core, `eu-west-1`, `ACTIVE_HEALTHY`) |
| Frozen WK | Manifest present; public chain not touched (46/46) |
| Step B stash | Present and untouched (`stash@{1}` step-b-wip-blocked-not-for-merge) |

## PR #225 baseline (verified on tip)

- Merge commit `3768155b` is ancestor of `origin/main`.
- `lib/auth/forgot-password.ts` maps provider “Error sending recovery email.” / SMTP-like text → public code `delivery_failed` (never raw provider text).
- `app/api/auth/forgot-password/route.ts` keeps anti-enumeration: unknown-account provider messages return `{ ok: true }`.
- Reset redirect builder targets `https://app.aipify.ai/auth/callback?next=%2Fauth%2Fupdate-password&type=recovery` (covered by existing unit tests).
- Locales `en/no/sv/da/pl/uk/es` each have localized `forgotPassword.errors.deliveryFailed` (and rate/request/success copy). No i18n code fix required in this job.

## RO findings (redacted)

### Auth logs (`source = auth_logs`, path `/recover`, last ~7 days)

| Outcome | Count | Window (UTC) |
|---|---|---|
| HTTP **500** | 4 | 2026-10-15 09:45:03 → 10:15:40 |
| HTTP **200** | 1 | 2026-10-15 09:45:09 |

Repeated **500** error payload (emails/tokens not selected; message redacted of any mailbox identity):

```text
gomail: could not send email 1: 550 "[ACR04] Amazon AWS IP
2a05:d018:10e0:3302:7f4e:c96b:9969:3516 may not use this server.
Amazon servers should use Amazon SES (https://aws.amazon.com/ses/)."
```

Interpretation (evidence-backed):

1. **Request accepted by app → Auth `/recover` invoked** — yes (log path `/recover`).
2. **Provider SMTP send failed** — yes. Custom SMTP (or the configured relay) **rejects Supabase Auth egress from AWS** with policy **ACR04**.
3. **Inbox received** — no evidence; send never left the rejected SMTP hop for the failing attempts.
4. **Reset link worked** — not tested; blocked until send succeeds.

The single `/recover` **200** does **not** prove delivery. Auth often returns success for unknown accounts (anti-enumeration) or when no mail is required; surrounding attempts for real send paths failed with ACR04.

### What this is / is not

| Hypothesis | Verdict |
|---|---|
| App forgot-password code / i18n broken | **Ruled out** for delivery (UI correctly surfaces `delivery_failed`) |
| Redirect allowlist / wrong reset URL as cause of *this* 500 | **Not indicated** — failure is at SMTP send (`gomail` / 550), before link use |
| Custom SMTP missing entirely | **Unlikely primary** — Auth is attempting SMTP via gomail against a remote that answers 550 ACR04 |
| SMTP auth credential wrong | **Not indicated** — rejection is ACR04 IP policy, not 535/auth |
| SPF/DKIM alone | **Secondary** — mail is rejected at SMTP accept from AWS IP; DNS polish still needed after provider fix |
| Rate limit / provider outage | **Not indicated** for these samples |
| Redirect/link problem after inbox | **UNKNOWN / not reached** |

### Auth config surface (RO limit)

Supabase MCP available here: project health + log SQL. **No RO tool in this session exposes Auth SMTP host/user/password or Dashboard SMTP toggles without secrets.** Exact SMTP hostname/provider must be read by an owner in:

**Supabase Dashboard → Project `Aipify Core` → Authentication → SMTP Settings**  
(do not paste passwords, API keys, or full connection strings into chat/RESULT).

## Delivery gates

| Gate | Result |
|---|---|
| App/API stable public errors (#225) | **PASS** (code + 7 locales on tip) |
| Auth `/recover` invoked | **PASS** (logs) |
| SMTP/provider accepted message | **FAIL** (550 ACR04) |
| Inbox received | **NOT VERIFIED** |
| Reset link completed | **NOT VERIFIED** |
| End-to-end recovery FIXED | **BLOCKED** (owner SMTP/DNS + separate test YES) |

## Owner action package (no agent mutation)

### A) Fix SMTP for AWS egress (requires explicit owner YES)

Minimal safe direction:

1. In Supabase Auth SMTP settings, replace the current relay with a **transactional provider that allows sending from AWS/Supabase**, e.g. **Amazon SES**, **Resend**, **Postmark**, or **SendGrid** (pick one already owned/approved by Aipify Group AS).
2. Set **From** to an `@aipify.ai` address the provider has verified (never `@aipify.com`).
3. Update DNS for `aipify.ai`: SPF include for the chosen provider; enable DKIM; keep DMARC coherent.
4. Do **not** rely on consumer/Google Workspace “SMTP as client from datacenter IP” patterns — ACR04 is exactly that class of reject.
5. Save Auth SMTP settings in Dashboard only after credentials are rotated/stored privately (never commit credentials).

**Risk / rollback:** Wrong SMTP breaks all Auth mail (recovery, invite, magic link). Rollback = restore previous SMTP settings from the owner’s private password manager / prior Dashboard values. Prefer a short maintenance window.

**Exact approval line (owner reply):**

> **YES — change Aipify Core Auth custom SMTP** to \<provider\> for project `qbcqoixhrvhnuwphefvw`, update From/`aipify.ai` DNS as needed. No password/role/identity changes. Agent may **not** paste secrets; human configures Dashboard (or gives a separate secret-handling path).

### B) One recovery proof after A (separate owner YES)

Only after SMTP save:

1. Authorized human requests reset for `support@aipify.ai` via Production forgot-password (or Dashboard “send recovery” if used).
2. Confirm **inbox receipt** (and spam folder check).
3. Complete reset once; **do not paste the link or code** into chat/RESULT.
4. Confirm login with the new password via the normal Platform path.

**Exact approval line:**

> **YES — one recovery delivery test** to `support@aipify.ai` after SMTP fix; human confirms inbox + completed reset; no link/token sharing.

### C) Not requested / still out of scope

- D2U / helper-allowlist SQL / Bedrift enablement / Step B / UnoNight
- Auth user/role/password mutation by agent
- Automatic test emails before B
- Declaring recovery FIXED without A+B evidence

## Concrete next step

**Owner config approval (A)** — switch Auth SMTP to an AWS-compatible transactional provider and align `aipify.ai` DNS. Then **owner test approval (B)** for a single `support@aipify.ai` recovery proof.

Until A+B succeed: treat Platform password recovery as **delivery-broken** (UI/API correctly report failure; mail does not send).

## Explicit non-claims

- Recovery is **not** FIXED.
- No secrets were printed.
- No SMTP/Auth Dashboard mutation, DNS change, SQL apply, or test email was executed by this job.
