# Support notify + email activation plan V1

**Baseline:** Production SQL applied (ledger `20261128175108`, `20261128175211`) · runtime flags true · email OFF.  
**No apply / no secrets / no real mail in this job.**

## Current contract

| Layer | Status |
|---|---|
| Admin draft / send / note / status | LIVE (inbox_persisted; email_status=not_sent) |
| APP get customer_visible messages | LIVE |
| APP customer reply RPC | LIVE |
| In-APP unread / bell on admin public reply | **GAP** — send RPC audits only; no presence notification insert found |
| Guest email delivery | **OFF** — `SUPPORT_EMAIL_TRANSPORT_ENABLED=false`, `SUPPORT_EMAIL_DELIVERY_LIVE=false` |
| Templates (keys) | Prepared in `email-notify-contract.ts` — 7 keys; locales via existing i18n when activated |

## Customer notify (APP) — recommended SQL YES (candidate not authored here)

Goal: on `platform_support_send_public_reply` success, create tenant-scoped unread notification deep-linking to `/app/support/requests/[id]` for authorized company users (not guest web tickets on platform company).

```text
YES AUTHOR SQL CANDIDATE for APP support reply notification + unread
after platform_support_send_public_reply, tenant-scoped, no PII body,
dedupe by (ticket_id, message_id), no email. Separate Staging then Production YES.
```

Until then: customers discover replies by opening Kundeservice (messages now returned).

## Email transport activation (guest + optional account notify)

Prerequisites: provider already in Core · domain auth · rate limit · idempotency · delivery status · secure reply-back token (not email-only account link).

```text
YES ACTIVATE SUPPORT_EMAIL_TRANSPORT_ENABLED + SUPPORT_EMAIL_DELIVERY_LIVE
only after provider/domain/rate-limit/idempotency/reply-token verified on Staging,
then separate Production YES. No Production test sends without named ticket list.
Templates: case-created-to-customer, new-case-to-support, new-customer-reply-to-support,
public-reply-to-customer, public-reply-to-partner, case-closed, case-reopened
in locales en/no/sv/da/pl/uk (+es if required).
```

## Owner E2E recipe (authorized sessions required)

1. Platform Admin: open existing **APP tenant** support case (not SUP-1067A439 web guest).
2. Save draft → Send reply → expect delivery `inbox_persisted` / “email not sent”.
3. APP user (same company): open `/app/support/requests/[id]` → see customer_visible history.
4. Customer reply → Admin timeline shows inbound; internal notes never visible in APP.
5. Optional: confirm unread/bell **after** notify SQL YES.
6. SUP-1067A439: **read-only only** — web guest; no APP reply path; no test send.

**E2E status without sessions:** BLOCKED (not COMPLETE).
