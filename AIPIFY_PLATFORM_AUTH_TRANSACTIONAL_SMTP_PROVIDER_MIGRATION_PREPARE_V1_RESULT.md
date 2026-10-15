# AIPIFY_PLATFORM_AUTH_TRANSACTIONAL_SMTP_PROVIDER_MIGRATION_PREPARE_V1_RESULT

## Status

**PARTIAL — migration decision package ready. Production Auth SMTP NOT changed.**

Password recovery delivery remains **broken until a separate owner-approved SMTP config write + recovery test**. This job did not swap providers, write DNS, rotate secrets, or send mail.

## Baseline

| Item | Value |
|---|---|
| Worktree | `/Users/veltrix/Development/aipify-platform-supabase-auth-smtp-recovery-delivery-diagnostics-v1` |
| Branch | `docs/platform-auth-transactional-smtp-provider-migration-prepare-v1` |
| Tip | `2db69cf8` (`origin/main`, includes PR #226 diagnostics) |
| Prior evidence | PR #225 LIVE (UI codes); PR #226 ACR04 SMTP reject on `/recover` |
| Core | `qbcqoixhrvhnuwphefvw` · `eu-west-1` |
| Code / Auth / DNS / SMTP writes this job | **None** |
| Frozen WK 46/46 | Untouched |
| Step B stash | Untouched (`stash@{1}` step-b-wip-blocked-not-for-merge) |

## Part checks

| Check | Result | Notes |
|---|---|---|
| ACR04 root cause (from #226) | **PASS** (accepted, not re-tested with new sends) | `gomail` 550 ACR04 — remote SMTP rejects Supabase AWS egress |
| Current Auth SMTP host name | **NOT VERIFIED** via RO API | Dashboard SMTP fields not readable without secrets/Management write tools; owner must open Auth → SMTP |
| Other Auth mail paths (`/invite`, `/signup`, magic link) | **LIKELY SHARED FAIL** | Same GoTrue SMTP; no ACR04 samples on those paths in last 14d (low traffic), only `/recover` 500×4 |
| App redirect builder | **PASS** | `https://app.aipify.ai/auth/callback?next=%2Fauth%2Fupdate-password&type=recovery` |
| Existing Aipify transactional convention | **PASS** | Code uses `RESEND_API_KEY` + Resend HTTP API (`lib/partner-communications-email/send.ts`); Super Admin health lists `resend` |
| Resend DNS on `aipify.ai` | **PASS (public DNS)** | See below |
| Resend account / domain “Verified” in Dashboard | **NOT VERIFIED** | Requires owner Resend login; no secret/API probe |
| Production Vercel `RESEND_API_KEY` presence | **NOT READ** | Must not dump env; code path expects the var for partner mail |
| Inbox / reset success | **NOT VERIFIED** | Explicitly out of scope without YES |

## Public DNS (read-only, 2026-10-15)

| Record | Observed |
|---|---|
| Apex TXT SPF | `v=spf1 include:_spf.domeneshop.no ~all` |
| Apex MX | `mx.domeneshop.no` |
| `_dmarc.aipify.ai` | `v=DMARC1; p=none` |
| `resend._domainkey.aipify.ai` | TXT **present** (DKIM material not copied into this report) |
| `send.aipify.ai` TXT SPF | `v=spf1 include:amazonses.com ~all` |
| `send.aipify.ai` MX | `10 feedback-smtp.eu-west-1.amazonses.com` |

Interpretation: **Resend-style domain verification records for `aipify.ai` already exist** (DKIM + send-subdomain SPF/MX in **eu-west-1**, same region family as Core). Apex SPF stays on Domeneshop for inbound/mailbox — that is normal for Resend (SPF on `send.` subdomain, not forced on apex). Exact Resend Dashboard verification status remains owner-confirmed.

## Provider comparison (2–3 options)

| Criterion | **Resend (preferred)** | Amazon SES direct | Postmark / SendGrid |
|---|---|---|---|
| Supabase Auth custom SMTP docs | Official Resend + Supabase SMTP guide | Supported | Supported |
| AWS egress / ACR04 class | Designed for this (SMTP → Resend → SES path) | Native AWS | OK if SMTP allows AWS |
| Existing Aipify convention | **Yes** — `RESEND_API_KEY`, partner mail, Super Admin service id `resend` | Not in app send path | No repo convention |
| DNS for `aipify.ai` | **Already present** (DKIM + `send.` SPF/MX eu-west-1) | Would need SES identities/DKIM (may overlap Resend) | No matching DKIM selectors seen |
| Ops complexity | Low: Dashboard SMTP paste | Higher: IAM SMTP user, region, sandbox exit | Medium + new vendor |
| Cost | Existing account presumed; **plan/limits NOT VERIFIED** | AWS billing; **NOT VERIFIED** | New vendor cost |
| Risk of open relay / security downgrade | Low if using Resend SMTP + API key password | Low if IAM locked | Low if standard SMTP |

### Recommendation

**Preferred: Resend SMTP for Supabase Auth custom SMTP.**

**Alternative: Amazon SES SMTP** only if owner rejects Resend for Auth (e.g. billing/policy). Do **not** point Auth back at Domeneshop/Google Workspace consumer SMTP — that class of server produced ACR04.

Uncertainty: whether the existing Resend domain is marked Verified and whether the Production API key is allowed for SMTP password reuse (Resend documents API key as SMTP password). Owner confirms in Resend Dashboard before Production Auth save.

## Target configuration (no secrets)

### Supabase Dashboard → Authentication → Email → SMTP Settings

| Field | Target value (non-secret) |
|---|---|
| Enable custom SMTP | On |
| Host | `smtp.resend.com` |
| Port | `465` (SMTPS / implicit TLS; Resend + Supabase documented default) |
| Username | `resend` |
| Password | Resend **API key** (paste only in Dashboard; never commit/chat) |
| Sender email | Verified `@aipify.ai` address (recommend `noreply@aipify.ai` or existing Auth sender already verified in Resend — **never `@aipify.com`**) |
| Sender name | `Aipify` |

Optional STARTTLS: port `587` also documented by Resend; prefer **465** to match Resend’s Supabase guide unless Dashboard requires 587.

### DNS / domain (owner checklist)

1. In Resend → Domains: confirm `aipify.ai` (or chosen send domain) status **Verified**.
2. Compare Dashboard “Records” to live DNS (already looks Resend-shaped; do not invent new apex SPF includes).
3. If verification incomplete: add/fix only the exact records Resend shows (typically `resend._domainkey`, `send` SPF TXT + MX). Do not weaken DMARC to bypass failures.
4. Domeneshop apex SPF/MX for **mailbox receive** can remain; do not replace inbound MX with a transactional-only setup.

### Redirect URLs (Auth allowlist — verify, usually already set)

Ensure these are allowed (exact paths used by app):

- Site URL / app origin: `https://app.aipify.ai`
- Redirect: `https://app.aipify.ai/auth/callback` (and recovery query variants as configured)
- App builds recovery as:  
  `https://app.aipify.ai/auth/callback?next=%2Fauth%2Fupdate-password&type=recovery`

### What can be checked without sharing secrets

- Auth logs: `/recover` status leaves 500 ACR04 → becomes 200 after fix (still not inbox proof).
- Resend Dashboard: domain Verified; outbound activity for Auth sends (no need to paste API key).
- Public DNS: DKIM/`send` records remain present.
- App UI: `#225` still shows localized `delivery_failed` if send fails; success copy remains anti-enumerating.

## Risk assessment

| Area | Risk if SMTP swap wrong / incomplete |
|---|---|
| Recovery | Continues failing or new provider rejects From/domain |
| Invite / confirmation / email change / magic link | **Same SMTP** — all Auth mail moves together |
| Rate limits | Supabase may impose low custom-SMTP hourly caps until Rate Limits raised |
| Reputation | New From without Verified domain → bounce/spam |
| Secrets | API key in Auth SMTP password field — store only in Dashboard/password manager |
| Rollback | Re-enter previous SMTP host/user/pass from private backup (do not invent) |

## Safe sequence (later jobs — not this one)

1. **Owner YES — Production Auth SMTP config** (Resend fields above; human pastes key in Dashboard).
2. Owner confirms Resend domain Verified + optional rate-limit review in Supabase.
3. **Separate Owner YES — one recovery test** to `support@aipify.ai` only.
4. Human confirms levels below; never paste link/token into chat.

### Test levels (must be reported separately)

| Level | Meaning | After this prepare job |
|---|---|---|
| L1 Provider accepted | Resend SMTP AUTH + accept from Supabase IP | **NOT RUN** |
| L2 Supabase send accepted | Auth `/recover` → HTTP 200 without gomail/ACR04 | **NOT RUN** |
| L3 Mailbox received | Message in `support@aipify.ai` inbox (check spam) | **NOT RUN** |
| L4 Reset completes | One recovery link sets new password; login works | **NOT RUN** |

Green CI / API `{ok:true}` alone ≠ L3/L4. Anti-enumeration can yield HTTP success without mail.

## Rollback procedure (for the later config job)

1. Before change: owner screenshots/exports current Auth SMTP non-secret fields (host/port/user/from) and retrieves prior password from private vault only.
2. If Auth mail fails after Resend: restore previous SMTP values immediately.
3. If Resend accepts but inbox fails: check domain Verified, From address, spam, Resend logs — do not open an unauthenticated relay.
4. No SQL rollback; Auth SMTP is Dashboard/config only.

## Exact owner YES lines (copy/paste)

**YES A — Production config (separate job):**

> YES — configure Aipify Core (`qbcqoixhrvhnuwphefvw`) Auth custom SMTP to Resend (`smtp.resend.com:465`, user `resend`, From verified `@aipify.ai`). Human pastes API key in Dashboard only. No password/role/session changes. Confirm Resend domain Verified first.

**YES B — one recovery proof (after A):**

> YES — one recovery delivery test to `support@aipify.ai` after SMTP save; human confirms inbox + completed reset; no link/token sharing.

## Out of scope / not done

- No SMTP swap, DNS write, secret write, provider signup, or cost-triggering registration by agent  
- No recovery send, password reset, auth.admin, MFA/session/role changes  
- No SQL, Bedrift, UnoNight, Step B  
- No claim of SUCCESS for mail delivery  
- No code patch required for this prepare package  

## Concrete next step

Owner replies with **YES A** (or chooses SES alternative explicitly). A follow-up job may guide Dashboard steps only after that YES — still without printing secrets — then **YES B** for the single recovery proof.

## Explicit non-claims

- Auth transactional SMTP is **not** migrated in Production by this job.  
- Recovery is **not** FIXED.  
- Resend is **recommended** from convention + public DNS + vendor docs; account/plan Verified status remains owner-confirmed.
