/**
 * Pure adapter that merges Website CMS context onto the legacy V4
 * `KompisWebsiteContext` shape (see `lib/kompis-operator/website-context.ts`).
 * Kept dependency-free (no Supabase, no server-only) so it stays easy to
 * unit test and so `lib/website-cms` never imports from `lib/kompis-operator`.
 */

import type { WebsiteCmsContext } from "./types";

export type V4WebsiteContextInput = {
  deliveryActive: boolean;
  acknowledgementOk: boolean;
  draftCapability: boolean;
  previewCapability: boolean;
};

export type V4WebsiteContextPatch = {
  authoritativePageModel: boolean;
  draftCapability: boolean;
  previewCapability: boolean;
  publishCapability: boolean;
  rollbackCapability: boolean;
  currentVersion: string | null;
  lastPublishAt: string | null;
  publishUnavailableReason: string | null;
  rollbackUnavailableReason: string | null;
};

const DEFAULT_PUBLISH_UNAVAILABLE_REASON = "no_authoritative_website_cms_publish_path_v4";
const DEFAULT_ROLLBACK_UNAVAILABLE_REASON = "no_authoritative_website_version_rollback_path_v4";

/**
 * Once a `customer_websites` row exists, the CMS becomes the authoritative
 * page model and V4's "no publish path" placeholders are cleared in favor of
 * capability-specific reasons (or `null` once the action is actually usable).
 */
export function mergeWebsiteCmsIntoV4Context(
  cms: WebsiteCmsContext,
  v4: V4WebsiteContextInput,
): V4WebsiteContextPatch {
  const websiteExists = cms.available && Boolean(cms.website);

  if (!websiteExists) {
    return {
      authoritativePageModel: false,
      draftCapability: v4.draftCapability,
      previewCapability: v4.previewCapability,
      publishCapability: false,
      rollbackCapability: false,
      currentVersion: null,
      lastPublishAt: null,
      publishUnavailableReason: DEFAULT_PUBLISH_UNAVAILABLE_REASON,
      rollbackUnavailableReason: DEFAULT_ROLLBACK_UNAVAILABLE_REASON,
    };
  }

  const deliveryReady = cms.acknowledgementOk && v4.deliveryActive;
  const publishCapability = cms.capabilities.publishCapability && deliveryReady;
  const hasPublishedVersion = Boolean(cms.website?.currentVersionId);
  const rollbackCapability = cms.capabilities.rollbackCapability && deliveryReady && hasPublishedVersion;

  return {
    authoritativePageModel: true,
    draftCapability: true,
    previewCapability: true,
    publishCapability,
    rollbackCapability,
    currentVersion: cms.currentVersion?.id ?? null,
    lastPublishAt: cms.currentVersion?.createdAt ?? null,
    publishUnavailableReason: publishCapability
      ? null
      : !deliveryReady
        ? "delivery_or_acknowledgement_not_ready"
        : "website_publish_capability_not_ready",
    rollbackUnavailableReason: rollbackCapability
      ? null
      : !deliveryReady
        ? "delivery_or_acknowledgement_not_ready"
        : !hasPublishedVersion
          ? "no_published_version_to_rollback"
          : "website_rollback_capability_not_ready",
  };
}
