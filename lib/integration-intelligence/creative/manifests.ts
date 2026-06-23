import type { CreativeProviderManifest } from "./types";

const STUDIO_VIEW_PERMISSION = "aipify_studio_creative_intelligence.view";
const BRIDGE_VIEW_PERMISSION = "aipify_desktop_companion_creative_bridge.view";

function readCapability(
  capability_key: CreativeProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  permission: string | null = STUDIO_VIEW_PERMISSION,
) {
  return {
    capability_key,
    operation: "read" as const,
    adapter_available: false,
    approval_required: false,
    reversible: true,
    risk_level: 1 as const,
    entity,
    required_permission: permission,
  };
}

function writeCapability(
  capability_key: CreativeProviderManifest["capabilities"][number]["capability_key"],
  entity: string,
  options?: { irreversible?: boolean; permission?: string | null },
) {
  const irreversible = options?.irreversible ?? false;
  return {
    capability_key,
    operation: "write" as const,
    adapter_available: false,
    approval_required: true,
    reversible: !irreversible,
    risk_level: (irreversible ? 3 : 2) as 2 | 3,
    entity,
    required_permission: options?.permission ?? STUDIO_VIEW_PERMISSION,
  };
}

/** Blueprint-derived creative provider manifests — capability IDs originate here, not in Core orchestrator. */
export const CREATIVE_PROVIDER_MANIFESTS: readonly CreativeProviderManifest[] = [
  {
    provider_key: "canva",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.canva",
    source_engine: "studio_byol",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.canva",
    capabilities: [
      readCapability("design.read", "design"),
      readCapability("brand_kit.read", "brand_kit"),
      {
        capability_key: "media.export",
        operation: "write",
        adapter_available: true,
        approval_required: true,
        reversible: false,
        risk_level: 2,
        entity: "artifact",
        required_permission: STUDIO_VIEW_PERMISSION,
      },
      writeCapability("design.from_template", "design"),
      writeCapability("presentation.create", "presentation"),
    ],
  },
  {
    provider_key: "adobe_firefly",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.adobe_firefly",
    source_engine: "studio_byol",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.adobe_firefly",
    capabilities: [
      readCapability("design.read", "design"),
      writeCapability("image.generate", "image"),
      writeCapability("image.edit", "image"),
    ],
  },
  {
    provider_key: "openai_images",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.openai_images",
    source_engine: "studio_byol",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.openai_images",
    capabilities: [
      writeCapability("image.generate", "image"),
      writeCapability("image.edit", "image"),
    ],
  },
  {
    provider_key: "google_imagen",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.google_imagen",
    source_engine: "studio_byol",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.google_imagen",
    capabilities: [writeCapability("image.generate", "image")],
  },
  {
    provider_key: "photoshop",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.photoshop",
    source_engine: "bridge_app",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.photoshop",
    capabilities: [
      readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION),
      writeCapability("image.edit", "image", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("media.export", "media", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "illustrator",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.illustrator",
    source_engine: "bridge_app",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.illustrator",
    capabilities: [
      readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION),
      writeCapability("image.edit", "image", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("media.export", "media", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "lightroom",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.lightroom",
    source_engine: "bridge_app",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.lightroom",
    capabilities: [
      readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION),
      writeCapability("image.edit", "image", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("media.export", "media", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "premiere",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.premiere",
    source_engine: "bridge_app",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.premiere",
    capabilities: [
      readCapability("design.read", "video", BRIDGE_VIEW_PERMISSION),
      writeCapability("video.create", "video", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("video.edit", "video", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("media.export", "media", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "indesign",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.indesign",
    source_engine: "bridge_app",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.indesign",
    capabilities: [
      readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION),
      writeCapability("presentation.create", "presentation", { permission: BRIDGE_VIEW_PERMISSION }),
      writeCapability("media.export", "media", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "figma",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.figma",
    source_engine: "bridge_app",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.figma",
    capabilities: [
      readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION),
      writeCapability("design.create", "design", { permission: BRIDGE_VIEW_PERMISSION }),
    ],
  },
  {
    provider_key: "blender",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.blender",
    source_engine: "bridge_app",
    implementation_status: "specification_only",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.blender",
    capabilities: [readCapability("design.read", "design", BRIDGE_VIEW_PERMISSION)],
  },
  {
    provider_key: "studio_image_generation",
    display_name_key: "customerApp.companionPlatformKnowledge.creative.providers.studio_image_generation",
    source_engine: "studio_module",
    implementation_status: "partial",
    search_terms_key: "customerApp.companionPlatformKnowledge.creative.searchTerms.studio_image_generation",
    capabilities: [
      writeCapability("image.generate", "image"),
      writeCapability("image.edit", "image"),
      writeCapability("media.export", "media"),
    ],
  },
];
