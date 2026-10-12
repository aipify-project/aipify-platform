# Website Kompis — universal public surface contract

Core owns when the public Companion surface is active. Customer hosts mount the Core loader once and publish an access class from their existing layout/access boundary.

## Host responsibilities

1. Load `https://aipify.ai/embed/website-kompis.js` (or your Core origin) with `data-install-id` and `data-domain`.
2. Publish access on every navigation:

```html
<html data-aipify-kompis-access="public">
```

Values:

| Value | Meaning |
|-------|---------|
| `public` | Visitor-reachable page — show Kompis; safe public pageContext may be captured |
| `private` | Authenticated/admin/member surface — hide public Kompis; clear pageContext |
| `unknown` | Do not activate; clear pageContext |

3. Map **your** existing private boundary to that attribute (admin shell, member app, auth gate). Do not send customer route lists to Core.
4. Never put passwords, form field values, tokens, or private DOM into pageContext.

Optional equivalents: `data-aipify-kompis-access` / `data-access-class` on the script tag, or `window.__AIPIFY_WEBSITE_KOMPIS_ACCESS__`.

## Core responsibilities

- Activate the public widget only when **effective** access is `public` and install/domain/license gates allow.
- Effective access = host adapter **plus** a shared Core path failsafe for known private prefixes (`/admin`, `/member`, `/app`, …). Explicit host `public` does **not** override that failsafe.
- Public auth entry paths (`/login`, `/register`, `/signin`, `/signup`) are **not** failsafe-hidden; mark them `public` when visitors can open them without a session.
- On `private` / `unknown`: hide the surface, clear public pageContext, stop disclosure refresh timers, and abort in-flight asks. Capture miss must clear — never keep a stale snapshot.
- Keep one loader/iframe across soft navigation; update context on public→public with a **fresh** capture only.
- Fail-closed context filters remain (no form/input scraping). Path failsafe complements the host adapter — it does **not** replace it.

## What Core does not do

- Claim complete detection of every customer private/admin URL (unknown protected routes still need the host adapter)
- Whitelist customer routes, domains, or products
- Bypass CSP, auth, install, domain, or license controls
- Remotely inject the loader onto pages that never load the integration
- Treat install/domain trust as a path grant

## Next-customer checklist

1. Place the loader in the shared public layout (or equivalent single mount point).
2. Set `data-aipify-kompis-access` from your access boundary on first paint and on SPA navigations.
3. Confirm kill switch / install disable still prevents mount or activation.
4. Verify login/register (or your public auth entry) are `public` if visitors can open them without a session.
5. Confirm known private shells also update the adapter — path failsafe is a safety net, not full auth.
