# Two-Factor Authentication — FAQ

## What is Aipify sign-in verification?

Aipify sign-in verification (two-factor authentication) adds a second step after your password when you sign in. After entering your email and password, you confirm with a 6-digit code from an authenticator app on your phone or computer. Aipify uses the product name **Aipify sign-in verification** — not generic “AI verification.”

## Who must use two-factor authentication?

Aipify requires sign-in verification for privileged roles: platform administrators, organization owners and administrators, and accounts covered by your organization’s two-factor policy. Other team members may enable it voluntarily. If your organization enforces verification for all users, everyone must set it up before accessing Aipify.

## How do I set up an authenticator?

Go to **Settings → Sign-in verification (2FA)** or **Identity & Permissions → Set up sign-in verification**. Scan the QR code with Google Authenticator, 1Password, Authy, or a similar app, then enter the first 6-digit code to confirm. Save your recovery codes immediately — Aipify shows them only once.

## What if I lose my phone or authenticator?

Use one of your **recovery codes** on the sign-in verification screen (“Use a recovery code”). Each code works once. If you have no codes left, contact your organization owner or Aipify support to regain access — Aipify cannot recover your account without proper identity verification.

## Can I turn off two-factor authentication?

If your role or organization **requires** sign-in verification, you cannot disable it. Optional users may disable it from Settings after confirming with a current authenticator code. Disabling removes unused recovery codes and clears verified sessions so you will verify again on next sign-in if you re-enable.

## Related

- Spec: [AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md](../../../../AIPIFY_SECURITY_IMPLEMENTATION_TWO_FACTOR_AUTHENTICATION.md)
- Identity & Permissions (Phase A.2): [IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md](../../../../IDENTITY_PERMISSIONS_ENGINE_PHASE_A2.md)
