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

- Activate the public widget only when access is `public` and install/domain/license gates allow.
- On `private` / `unknown`: hide the surface, clear public pageContext, ignore delayed context for the wrong page.
- Keep one loader/iframe across soft navigation; update context on public→public.
- Fail-closed context filters remain (no form/input scraping) and do not replace the host access adapter.

## What Core does not do

- Guess public/private from URL path names
- Whitelist customer routes, domains, or products
- Bypass CSP, auth, install, domain, or license controls
- Remotely inject the loader onto pages that never load the integration

## Next-customer checklist

1. Place the loader in the shared public layout (or equivalent single mount point).
2. Set `data-aipify-kompis-access` from your access boundary on first paint and on SPA navigations.
3. Confirm kill switch / install disable still prevents mount or activation.
4. Verify login/register (or your public auth entry) are `public` if visitors can open them without a session.
