# AIPIFY – PHASE 502
## TITLE: App Store & Business Pack Installation Engine

**PURPOSE:** Create the official Aipify App Store where APP customers discover, purchase, install, upgrade, and remove Business Packs — the commercial engine of Aipify.

**OBJECTIVES:**

- App Store at `/app/store` with Installed, Marketplace, Recommended, Popular, Recently Added, My Licenses
- Pack detail at `/app/store/[pack]` with overview, modules, pricing, FAQ, version history
- License dashboard at `/app/licenses`
- Install flow: select seats → review cost → payment → activation → modules registered
- Upgrade and removal flows with confirmation
- Seat licensing tiers (1–500 + Enterprise)
- APP owner controls employee visibility (Module Access)
- Recommendations engine by industry and installed packs
- Platform revenue dashboard at `/platform/store/revenue`

**REQUIREMENTS:**

- Migration: `20261850200000_app_store_business_pack_installation_engine_phase502.sql`
- Lib: `lib/app-store/`
- Customer: `/app/store`, `/app/store/[pack]`, `/app/licenses`
- Platform: `/platform/store/revenue`
- APIs: `/api/app/store`, `/api/app/store/[pack]`, `/api/app/store/action`, `/api/app/licenses`, `/api/platform/app-store/revenue`
- Integrates Module Registry (501), Business Pack Marketplace (Foundation 08), License Engine

**KEY RPCs:**

- `get_app_store_home()` — store sections and pack cards
- `get_app_store_pack_detail()` — full pack detail page
- `get_customer_license_dashboard()` — license dashboard
- `perform_app_store_action()` — install, upgrade, remove, review_install
- `get_platform_app_store_revenue_dashboard()` — platform revenue aggregates
- `customer_remove_business_pack()` — APP owner pack removal

**ACCEPTANCE CRITERIA:**

- ✅ App Store created
- ✅ Marketplace section created
- ✅ Installed section created
- ✅ License dashboard created
- ✅ Pack installation flow created
- ✅ Pack removal flow created
- ✅ Upgrade flow created
- ✅ Seat licensing created
- ✅ Employee inheritance supported (via Module Access grants)
- ✅ APP owner controls visibility
- ✅ Recommendations engine created
- ✅ Platform revenue visibility created

**PRINCIPLE:** PLATFORM sells · APP buys · APP activates · One Platform · Unlimited Business Packs.

END OF PHASE.
