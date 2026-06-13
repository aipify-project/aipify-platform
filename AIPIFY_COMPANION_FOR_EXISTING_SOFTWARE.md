# Aipify as Companion for Existing Software

## Core principle

**Do not reinvent the wheel.**

Aipify orchestrates, guides and assists existing software when the user grants permission.

## Positioning

Aipify is **not** competing with Canva, Adobe or Microsoft.

Aipify helps users succeed with tools they already own — guide, translator, workflow assistant, creative helper, productivity companion.

## User experience

User: *"Aipify, help me create a Facebook campaign in Canva."*

Aipify asks for explicit consent with **Allow once**, **Use Aipify Studio**, or **Decline**.

## Permission modes

| Mode | Behavior |
|------|----------|
| Allow once | Assist only for the current task |
| Always allow | Assist under organization policy with explicit approval |
| Use Aipify Studio | Built-in capabilities without external tool access |
| Decline | Built-in Aipify capabilities only |

## Supported categories

- **Creative:** Canva, Adobe Photoshop/Illustrator/Lightroom/InDesign, Figma, Blender, DaVinci Resolve
- **Productivity:** Microsoft Word/Excel/PowerPoint, Outlook, Teams, Google Docs/Sheets/Slides
- **Marketing:** Canva, Meta Business Suite, Mailchimp, Shopify, WordPress

## Enterprise controls

Super Admin: approve applications, disable assistance, provider policies, audit logs.

Tenant Admin: organization tool access, department approvals, BYOL settings.

Employees: task-level permission, revoke access, Studio vs external tools.

## Security

Permission-based access · no silent desktop control · no unauthorized file access · session expiration · emergency revoke · audit logging.

## Business model transparency

- This uses your own subscription
- This requires a connected account
- This provider may charge separately
- Official partner links only — no hidden billing

## Implementation

- Desktop Companion: `/app/aipify-desktop-companion-creative-bridge-engine`
- Blueprint helpers: `_adccbebp236_*`
- ILM: `companion-for-existing-software.txt`
- Constants: `lib/companion/existing-software.ts`
