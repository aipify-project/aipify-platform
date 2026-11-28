/**
 * Short-lived signed URLs for registered product media after channel authorization.
 * Service-role is used only to mint the URL after an authz check — never for client upload bypass.
 */

import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  loadApprovedProductContent,
  type ProductContentChannel,
} from "./locale-media-core";
import { isProductMediaPath, PRODUCT_MEDIA_STORAGE_BUCKET } from "./product-media-storage-contract";
import type { CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";

export const PRODUCT_MEDIA_SIGNED_URL_TTL_SECONDS = 120;

export type ProductMediaSignedUrlResult =
  | { ok: true; url: string; path: string; expiresIn: number }
  | {
      ok: false;
      reason:
        | "path_invalid"
        | "not_listed"
        | "content_missing"
        | "path_not_registered"
        | "forbidden"
        | "storage_unavailable"
        | "error";
      detail?: string;
    };

export async function createChannelProductMediaSignedUrl(input: {
  supabase: CspRpcClient;
  productKey: string;
  locale: string;
  channel: ProductContentChannel;
  kind: "logo" | "hero";
}): Promise<ProductMediaSignedUrlResult> {
  const loaded = await loadApprovedProductContent(input.supabase, {
    productKey: input.productKey,
    locale: input.locale,
    channel: input.channel,
  });
  if (!loaded.ok) {
    if (loaded.reason === "not_listed") return { ok: false, reason: "not_listed", detail: loaded.detail };
    if (loaded.reason === "forbidden") return { ok: false, reason: "forbidden", detail: loaded.detail };
    return { ok: false, reason: "error", detail: loaded.detail };
  }
  if (loaded.content.contentMissing) {
    return { ok: false, reason: "content_missing" };
  }
  const path =
    input.kind === "logo" ? loaded.content.logoPath : loaded.content.heroPath;
  if (!path || !isProductMediaPath(path)) {
    return { ok: false, reason: "path_not_registered" };
  }

  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin.storage
      .from(PRODUCT_MEDIA_STORAGE_BUCKET)
      .createSignedUrl(path, PRODUCT_MEDIA_SIGNED_URL_TTL_SECONDS);
    if (error || !data?.signedUrl) {
      return { ok: false, reason: "storage_unavailable", detail: error?.message };
    }
    return {
      ok: true,
      url: data.signedUrl,
      path,
      expiresIn: PRODUCT_MEDIA_SIGNED_URL_TTL_SECONDS,
    };
  } catch (err) {
    return {
      ok: false,
      reason: "storage_unavailable",
      detail: err instanceof Error ? err.message : "signed_url_failed",
    };
  }
}
