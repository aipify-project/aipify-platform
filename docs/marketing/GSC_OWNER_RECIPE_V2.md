# Google Search Console — owner recipe V2

**No GSC settings / DNS / sitemap submit / request indexing without authorized access + owner YES.**

## Live checks (read-only, this job)

| URL | Result |
|---|---|
| `https://aipify.ai/robots.txt` | 200 · sitemap `https://aipify.ai/sitemap.xml` · host `aipify.ai` · `/login` disallowed |
| `https://aipify.ai/sitemap.xml` | 200 · canonical public surfaces only |
| `https://aipify.ai/` · `/growth-partners` · `/contact/support` | 200 · Production deploy `dpl_3Q81Usbic7kL8kgwVzDuCyUAMv17` @ `03f7bebce` |
| `https://www.aipify.ai/` | 200 (same project aliases) |

Indexed / not indexed counts: **not available** without authorized GSC login — do not invent numbers.

## Owner steps when access exists

1. Confirm property is domain or URL-prefix for `aipify.ai` (prefer domain property covering www).
2. Inspect sitemap URL; submit only if missing and YES granted.
3. URL inspection for `/`, `/growth-partners`, `/contact/support`, sample legacy noindex page.
4. Record actual Coverage / Page indexing counts with date — never estimate.
5. Do not request indexing in bulk without YES.

```text
YES GSC: submit sitemap https://aipify.ai/sitemap.xml and/or request indexing
for listed URLs only, under authorized Search Console access.
```
