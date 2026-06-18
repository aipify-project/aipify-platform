# AIPIFY – PHASE 455
## TITLE: Public Growth Partner Signup Page — Start Your Aipify Business

**PURPOSE:** Create a public Growth Partner recruitment page that makes it easy for independent sellers to start working with Aipify as a business opportunity — not a job application and not an affiliate page.

**OBJECTIVES:**
- Public page at `/growth-partners` with aliases `/become-a-partner`, `/start-selling`, `/sell-aipify`
- Signup creates Growth Partner account under `/app/growth-partner` with `certification_required` status
- Role `growth_partner` in organization membership — no Platform Admin access

**REQUIREMENTS:**
- Growth Partner terminology — never Affiliate
- Country-aware business registration helper text and phone country code selector
- i18n: en, no, sv, da (marketing + dashboard)
- Navigation: Growth Partners in main nav; footer under Company

**COMPONENTS:**
- Migration: `20261845500000_growth_partner_public_signup_phase455.sql`
- Public: `app/(marketing)/growth-partners/`, `components/marketing/GrowthPartners*`
- API: `/api/marketing/growth-partner-signup`, `/api/growth-partner/dashboard`
- App dashboard: `/app/growth-partner`, `components/app/growth-partner-dashboard/`

END OF PHASE.
