# Customer Website Runtime Delivery V1

Generic, customer-agnostic contract for delivering published Website CMS state to a customer runtime through installation trust.

Example organization name in this document: **Example Customer** (`customer.example`).

## Chain

1. Platform manages customer, agreement, APP license, Website Kompis, domain, installation, and canonical delivery.
2. APP publishes a CMS version (candidate → preview → publish).
3. Publish reaches `pending_runtime` after database verification (not fully green).
4. Customer runtime authenticates with the installation token (server-side only).
5. Runtime fetches context / manifest / page from `/api/runtime/v1/website/*`.
6. Runtime renders only explicitly mounted paths (homepage off by default).
7. Runtime acknowledges observed version + checksums.
8. Platform performs SSRF-safe HTTP read-back and requires proof headers.
9. Operation becomes fully verified (`active`) only when DB + acknowledgement + HTTP match.

## Environment (customer runtime)

Server-only configuration references (never expose token values to browsers or public docs as live secrets):

- `AIPIFY_RUNTIME_API_BASE` — e.g. `https://app.aipify.ai`
- `AIPIFY_INSTALLATION_TOKEN` — installation token from Developer Settings (rotate-only surface)
- Mounted paths — configured in Platform runtime delivery panel
- Homepage enablement — default false

## API (installation-bound)

All routes resolve tenant/website/version from the installation token. Clients must not send customer/org/website/version selectors.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/runtime/v1/website/context` | Runtime context, mounted paths, cache token |
| GET | `/api/runtime/v1/website/manifest` | Active published manifest |
| GET | `/api/runtime/v1/website/page?path=&locale=` | Page payload for a mounted path |
| POST | `/api/runtime/v1/website/acknowledge` | Runtime acknowledgement (server computes status) |

Auth headers (one of):

- `X-Aipify-Installation-Token: <token>`
- `Authorization: Bearer <token>`

## Adapter helpers

Package: `lib/customer-website-runtime/`

- `isPathMounted` / `fetchRuntimeContext` / `fetchRuntimePage`
- `buildRuntimeProofHeaders` for HTTP verification markers
- On any failure return `{ ok: false, fallback: true }` and render the customer's existing page

## Proof headers (required for HTTP green)

- `X-Aipify-Website-Version`
- `X-Aipify-Manifest-Checksum`
- `X-Aipify-Page-Checksum`
- `X-Aipify-Installation`

`200` without these markers is rejected.

## Fallback

Keep the customer's existing runtime authoritative when Aipify is unavailable, the route is not mounted, the website is not published, checksums mismatch, or acknowledgement fails. Never catch-all the whole site. Never auto-take over `/`.

## Security

- Token never logged or returned
- Rate/size limits on acknowledge
- SSRF blocks for private IPs, localhost, metadata hosts, off-host redirects
- No draft/preview/staging leakage on Production runtime routes

## Integration sketch (Example Customer)

1. Platform enables runtime delivery and mounts e.g. `/about`, `/pricing` for `customer.example`.
2. Example Customer's Next.js (or other) server handler, for those paths only, calls Aipify page resolve with the installation token.
3. On success, render structured CMS content and set proof headers.
4. POST acknowledgement with observed checksums and an idempotency key.
5. On any error, fall back to the existing Example Customer page implementation.
