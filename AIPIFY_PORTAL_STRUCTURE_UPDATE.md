# AIPIFY – Portal Structure Update

**Status:** Official · Supersedes Growth portal terminology

## Official ecosystem hierarchy

```
SUPER
↓
PLATFORM
├── APP
└── PARTNERS
```

Aipify Group AS · Bergen. Norway. For the world.

## Portal definitions

| Portal | Purpose |
|--------|---------|
| **SUPER** | Executive oversight and governance — not daily operations |
| **PLATFORM** | Aipify Group AS operational workspace — runs the company |
| **APP** | Customer-facing workspace — delivers customer value |
| **PARTNERS** | Aipify Partners workspace — external collaborators, not employees |

## Terminology

Replace partner-program **Growth** terminology with **Partners** / **Aipify Partners**.

Do **not** rename legitimate business metrics: Revenue Growth, User Growth, Growth Rate, Market Growth, etc.

## Implementation (this update)

- Canonical route: `/partners/*`
- Legacy redirects: `/growth/*`, `/growth-partner/*`
- Module: `lib/partners-portal/`, `components/partners-portal/`
- i18n: `partnersPortal.*` in en, no, sv, da, es, pl, uk
- FAQ: `content/knowledge/aipify/partners-portal/faq/aipify-partners-knowledge-center-faq.md`
- Deprecated aliases: `lib/growth-portal/`, `growthPortal.json` (backward compatibility)

See [AIPIFY_PARTNERS_PORTAL_STRUCTURE.md](./AIPIFY_PARTNERS_PORTAL_STRUCTURE.md) for full Partners portal specification.
