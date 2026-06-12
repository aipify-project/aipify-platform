# Registration & Workspace Onboarding FAQ

## What is the difference between registration and customer onboarding?

**Registration** (`/register`) creates your Aipify workspace — account, organization, trial subscription, and Day One profile metadata.

**Customer onboarding** (inside `/app` after registration) is the guided setup checklist: team, modules, Knowledge Center, integrations, and go-live steps.

## Why does Aipify require a business email?

Aipify is a Business Operating System for organizations. Business email validation helps ensure workspace ownership aligns with your company domain. Personal providers (Gmail, Outlook, etc.) are not accepted during self-service registration.

## Can I enable two-factor authentication during registration?

You can choose to enable 2FA immediately after your workspace is created. Full enrollment uses the same Settings → Two-Factor flow and `/api/auth/2fa/*` APIs as existing accounts.

## What is a Growth Partner workspace?

Growth Partner is an organization type for partners who help other businesses adopt Aipify. Selecting it prepares metadata for Growth Partner Operations Center, Aipify University, and Companion Marketplace onboarding — subject to platform verification.

## Who sees my registration details?

Your registration profile is stored for your tenant. Platform administrators see enriched fields (owner, industry, verification status, 2FA status) in `/platform/customers` for support and verification — not your operational business data.
