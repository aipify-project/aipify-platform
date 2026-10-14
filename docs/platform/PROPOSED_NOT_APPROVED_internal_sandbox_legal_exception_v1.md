# PROPOSED — NOT APPROVED — Internal sandbox legal exception v1

Status: **PROPOSED_NOT_APPROVED**  
Contract: `platform_internal_sandbox_onboarding_v1`  
This document is **not** permission to create tenants, apply SQL, invite users, record acceptance, or grant Bedrift.

## Purpose

Describe a possible owner/legal path for an **INTERNAL SANDBOX** ordinary customer org used only for Aipify Group AS internal Kompis Bedrift testing and later sales demos — without pretending MSA acceptance exists.

## Scope (if later approved)

- One named ordinary (`is_platform = false`) customer organization
- No public website / customer traffic
- No Stripe customer, subscription automation, or invoices from this path
- Does **not** set `PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = true`
- Does **not** invent acceptance evidence; D2B probe remains `AGREEMENT_UNVERIFIED`

## Authorization required before any use

1. Written owner approval naming this exception id and an expiry/review date
2. Legal counsel confirmation that internal sandbox use may proceed without MSA evidence (or decision to require MSA path instead)
3. Separate named jobs for any create / invite / activate writes

## Audit

- Every authorized job must cite this exception id in `internalReason`
- Platform UI/RPC must not display agreement as signed/verified under this exception

## Protections

- Empty execute allowlists until customer id is named
- No UnoNight mutation
- No cross-tenant auto-link
- No accept-on-behalf without explicit policy
