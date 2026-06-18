# AIPIFY – PHASE 455 ADDON
## Growth Partner Auto-Link & Marketing Attribution System

**PURPOSE:** Automatically generate unique partner tracking links on registration and inject them into all Growth Partner marketing material — no manual link editing.

**ROUTES:**
- Public partner links: `/p/{slug}`, `/partner/{slug}` (alias)
- Partner Marketing Center: `/app/growth-partner/marketing`
- Partner Dashboard link card: `/app/growth-partner`

**COMPONENTS:**
- Migration: `20261845510000_growth_partner_auto_link_attribution_addon.sql`
- Lib: `lib/growth-partner-attribution/`
- UI: `components/app/growth-partner-attribution/`
- APIs: `/api/growth-partner/marketing-center`, `/api/growth-partner/qr`
- Public: `app/p/[slug]/route.ts`, `app/partner/[slug]/route.ts`
- Platform RPC: `get_platform_growth_partner_links_overview()`, `admin_regenerate_growth_partner_link()`, `admin_set_growth_partner_link_status()`

**PRINCIPLE:** A Growth Partner should never have to think about tracking links. Aipify prepares material, tracks leads, attributes customers, and calculates commission.

END OF PHASE.
