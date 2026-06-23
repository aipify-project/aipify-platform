import type {
  ExternalApplicationManifest,
  ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";

const STUDIO_VIEW_PERMISSION = "aipify_studio_creative_intelligence.view";

function capability(
  operation: ExternalApplicationOperation,
  capabilityKey: string,
  options?: { adapter_registered?: boolean; approval_required?: boolean; permission?: string | null },
) {
  return {
    operation,
    capability_key: capabilityKey,
    adapter_registered: options?.adapter_registered ?? false,
    approval_required: options?.approval_required ?? true,
    reversible: operation !== "export",
    risk_level: operation === "handoff" ? (2 as const) : (1 as const),
    required_permission: options?.permission ?? STUDIO_VIEW_PERMISSION,
  };
}

/** Application manifests originate outside Core — honest readiness only. */
export const EXTERNAL_APPLICATION_MANIFESTS: readonly ExternalApplicationManifest[] = [
  {
    application_key: "canva",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.canva",
    adapter_type: "api_oauth",
    workspaces: ["graphic_design", "presentation", "pdf"],
    readiness: "partial",
    capabilities: [
      capability("handoff", "artifact.handoff", { adapter_registered: true, approval_required: true }),
      capability("open", "design.open"),
      capability("edit", "design.edit"),
      capability("export", "media.export"),
    ],
  },
  {
    application_key: "adobe_photoshop",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.adobe_photoshop",
    adapter_type: "desktop_bridge",
    workspaces: ["graphic_design"],
    readiness: "adapter_missing",
    capabilities: [
      capability("open", "design.open"),
      capability("edit", "design.edit"),
      capability("handoff", "artifact.handoff"),
    ],
  },
  {
    application_key: "adobe_illustrator",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.adobe_illustrator",
    adapter_type: "desktop_bridge",
    workspaces: ["graphic_design"],
    readiness: "adapter_missing",
    capabilities: [
      capability("open", "design.open"),
      capability("edit", "design.edit"),
      capability("handoff", "artifact.handoff"),
    ],
  },
  {
    application_key: "microsoft_word",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.microsoft_word",
    adapter_type: "api_oauth",
    workspaces: ["document"],
    readiness: "partial",
    capabilities: [
      capability("create", "document.create", { adapter_registered: true, approval_required: true }),
      capability("open", "document.open", { adapter_registered: true, approval_required: true }),
      capability("edit", "document.edit", { adapter_registered: true, approval_required: true }),
      capability("save", "save.onedrive", { adapter_registered: true, approval_required: true }),
      capability("export", "export.onedrive", { adapter_registered: true, approval_required: true }),
      capability("handoff", "artifact.handoff", { adapter_registered: true, approval_required: true }),
    ],
  },
  {
    application_key: "microsoft_excel",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.microsoft_excel",
    adapter_type: "api_oauth",
    workspaces: ["spreadsheet"],
    readiness: "partial",
    capabilities: [
      capability("create", "spreadsheet.create", { adapter_registered: true, approval_required: true }),
      capability("open", "spreadsheet.open", { adapter_registered: true, approval_required: true }),
      capability("edit", "spreadsheet.edit", { adapter_registered: true, approval_required: true }),
      capability("save", "save.onedrive", { adapter_registered: true, approval_required: true }),
      capability("export", "export.onedrive", { adapter_registered: true, approval_required: true }),
      capability("handoff", "artifact.handoff", { adapter_registered: true, approval_required: true }),
    ],
  },
  {
    application_key: "microsoft_powerpoint",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.microsoft_powerpoint",
    adapter_type: "api_oauth",
    workspaces: ["presentation"],
    readiness: "partial",
    capabilities: [
      capability("create", "presentation.create", { adapter_registered: true, approval_required: true }),
      capability("open", "presentation.open", { adapter_registered: true, approval_required: true }),
      capability("edit", "presentation.edit", { adapter_registered: true, approval_required: true }),
      capability("save", "save.onedrive", { adapter_registered: true, approval_required: true }),
      capability("export", "export.onedrive", { adapter_registered: true, approval_required: true }),
      capability("handoff", "artifact.handoff", { adapter_registered: true, approval_required: true }),
    ],
  },
  {
    application_key: "adobe_premiere",
    display_name_key: "customerApp.companionExperience.externalApplications.providers.adobe_premiere",
    adapter_type: "desktop_bridge",
    workspaces: ["audio_video"],
    readiness: "adapter_missing",
    capabilities: [
      capability("create", "video.create"),
      capability("edit", "video.edit"),
      capability("handoff", "artifact.handoff"),
    ],
  },
];
