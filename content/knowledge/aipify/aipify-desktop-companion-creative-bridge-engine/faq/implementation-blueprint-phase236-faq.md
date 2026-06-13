# Desktop Companion & Creative Bridge Engine — FAQ (Phase 236)

## What is the Desktop Companion & Creative Bridge Engine?

The Desktop Companion & Creative Bridge Engine enables Aipify to securely collaborate with approved desktop applications at `/app/aipify-desktop-companion-creative-bridge-engine`.

## What desktop companion features are included?

Detect approved installed applications, request user consent, launch supported applications, assist within approved apps, perform guided actions, temporary session permissions, complete audit history, and organization application policies.

## What creative applications are supported?

Adobe Photoshop, Illustrator, Lightroom, Premiere Pro, InDesign, Canva Desktop, Blender, and Figma Desktop — all require explicit consent.

## What business applications are supported?

Microsoft Word, Excel, PowerPoint, Outlook, and Teams — all governed by organization policies.

## How does the consent workflow work?

Aipify detects an approved application and requests consent with Allow Once (current task only), Always Allow (explicit approval), or Decline — users must understand exactly what is requested.

## What application capabilities are available?

Photoshop background removal and cleanup, Illustrator icon creation, Lightroom exposure adjustments, Word report generation, PowerPoint presentation generation, and more — users retain final control.

## Who can manage desktop companion policies?

Super Admin (full configuration), Tenant Admin (organization policies), Managers (department approvals), and Employees (request approved assistance) — all governed by enterprise RBAC.

## Are application sessions audited?

**Yes.** All application sessions must be recorded including access granted, sessions started, documents generated, sessions terminated, access revoked, and session expired events.

## How does this integrate with other Aipify surfaces?

Cross-link only: Aipify Studio Phase 229, Document Intelligence Phase 230, Executive Cockpit Phase 200, Knowledge Center, Enterprise Notification Engine Phase 233, Trust Center — never duplicate their RPCs.

## Does the Bridge Companion replace user control?

**No.** Bridge Companion prepares in-application guidance — it does **NOT** access applications without permission or bypass session consent.
