# CSP email delivery — owner setup (aipify.ai)

**Status:** guidance only. Do not paste secrets into this repo, chat logs, or PR comments.

## Why applicant emails failed

CSP public apply runs on **aipify.ai** (Vercel project `aipify-platform-iz5z`).
Transactional mail uses `RESEND_API_KEY` via `lib/certified-sales-partner/onboarding-email.ts`.

Observed (2026-11-25):

| Vercel project | Host | `RESEND_API_KEY` |
|----------------|------|------------------|
| `aipify-platform` | app.aipify.ai | Present |
| `aipify-platform-iz5z` | aipify.ai | **Missing** |

Until the key exists on `aipify-platform-iz5z` Production, register returns `email_delivery.receipt = not_configured` (honest). Applications can still store in Core.

## Exact owner actions

1. Open Vercel → team **unonight-platform-s-projects** → project **aipify-platform-iz5z**.
2. Settings → Environment Variables → Add:
   - Name: `RESEND_API_KEY`
   - Value: the **same Resend API key** already used on `aipify-platform` (copy only inside the Vercel UI; do not paste into Cursor/chat).
   - Environments: **Production** (and Preview if you want preview apply emails).
3. Optional — admin new-application notices:
   - Name: `CSP_ADMIN_NOTIFY_EMAILS`
   - Value: comma-separated Platform Admin inboxes (e.g. `ops@aipify.ai`).
   - Same environments as above.
4. Confirm Resend dashboard: domain **aipify.ai** (or sending domain for `partners@aipify.ai`) has SPF/DKIM verified; FROM used by code is `Aipify Group AS <partners@aipify.ai>`.
5. Redeploy Production for `aipify-platform-iz5z` (env changes apply on next deploy), or trigger a Production redeploy of the current READY SHA.
6. Owner test: signed-in apply at `https://aipify.ai/certified-sales-partner#apply` → success screen must not claim email unless API returns `email_delivery.receipt = accepted` → check owned inbox (also spam).

## What “accepted” means

Provider HTTP 2xx / Resend id = **accepted for delivery**, not proof of inbox delivery. Report inbox separately as `INBOX_VERIFIED` / `INBOX_NOT_VERIFIED`.

## Do not

- Copy or print the API key into git, reports, screenshots of env values, or agent chat.
- Invent a new Resend account unless DNS/FROM require it.
- Claim LIVE email until Production on **aipify.ai** has the key and a real inbox check passes.
