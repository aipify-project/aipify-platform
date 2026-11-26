# V4 ownership vs APP PR #361

| Surface | Owner this job (CSP V4) | Owner PR #361 (APP) |
|---------|-------------------------|---------------------|
| `/partners/*` seller portal | Yes | No |
| `/platform/sellers/*` SELGERE | Yes | No |
| `/api/certified-sales-partner/*` | Yes | No |
| `/api/platform/sellers/*` | Yes | No |
| `lib/certified-sales-partner/**` | Yes | No |
| `components/partners-portal/**` | Yes | No |
| `components/platform/sellers/**` | Yes | No |
| `locales/*/partnersPortal.json` | Yes | Avoid |
| `locales/*/platform.json` sellers.* keys | Narrow CSP-only keys | Avoid overlapping APP keys |
| `/app/*` customer routes | **No — do not touch** | Yes |
| APP catalog / billing / invoices | **No** | Yes |
| Kompis Public Chain / FAQ / Widget | **ZERO DIFF** | N/A |
| Academy exam pass rules | **ZERO DIFF** | N/A |
| Stripe Connect / customer payments | **No** | Separate |

Shared i18n collisions: change only CSP seller keys; if APP merges first, rebase this branch and re-check `platform.json` / shared auth helpers.
