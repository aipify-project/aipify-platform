# APP Portal — Integrations & API Access FAQ

Phase 260 addon — customer self-onboarding for external platform connections at `/app/platform/integrations`.

**Principle:** Aipify only requests the access needed to help your organization. Read-only access is preferred whenever possible.

## How do I connect an external platform to Aipify?

Open **APP → Platform → Integrations**, choose a provider, review what Aipify needs, approve permission scopes, and complete either OAuth or manual API key setup. Test the connection before finishing.

## What is read-only access?

Read-only access lets Aipify read operational metadata from your external system without changing data. This is the default and recommended permission level.

## Why does Aipify ask for API access?

Aipify needs limited access to understand your systems and deliver operational insights inside your workspace. Access is scoped, approved by you, and never broader than required.

## Where do I find my API key?

Each provider places API keys in different admin menus. The integration setup wizard shows step-by-step instructions for your selected platform — login location, menu path, and key creation screen.

## How do I know which permissions to choose?

Choose the lowest permission level that satisfies the listed scopes. Prefer read-only. Do not enable admin-wide, destructive, or write permissions unless a specific feature requires them and you approve them explicitly.

## Can Aipify change data in my external system?

Not with read-only access. Write permissions are never enabled by default. If write access is ever required for a feature, you must approve it explicitly during setup.

## How do I remove an integration?

Open the connected integration in **Platform → Integrations**, choose remove/revoke, and confirm. Credentials are revoked and audit logs record the action.

## How do I rotate an API key?

Create a new key in your external platform with the same read-only scopes, paste it in Aipify to replace the existing credential, test the connection, then revoke the old key in the external system.

## What should I do if an integration fails?

Review permission scopes, confirm the API key is active, verify read-only access is selected, and run **Test connection** again. Contact support from **Support → Contact Support** if the issue persists.

## What is the difference between OAuth and API keys?

OAuth uses a provider redirect and official app authorization — preferred when available. Manual API keys require you to copy a key from the provider admin and paste it into Aipify. Both require scope approval before saving.

## Is it safe to connect my business tools to Aipify?

Credentials are encrypted at rest, masked after saving, and never shown in full again. You can revoke or replace access at any time. All create, update, delete, and test actions are audit logged.
