import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  hasPublicCompanionVisitorContext,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";

export const WEBSITE_KOMPIS_INSTALL_CONFIG_READ_RPC =
  "get_website_kompis_install_config" as const;

export const WEBSITE_KOMPIS_PUBLIC_INSTALL_CONFIG_RPC =
  "get_website_kompis_public_install_config" as const;

export const WEBSITE_KOMPIS_INSTALL_CONFIG_UPDATE_RPC =
  "update_website_kompis_install_config" as const;

export type WebsiteKompisInstallConfigRpcResult = {
  ok: boolean;
  install_id?: string;
  config?: Record<string, unknown>;
  normalized_config?: Record<string, unknown>;
  updated_at?: string | null;
  updated_by?: string | null;
};

export type LoadWebsiteKompisInstallConfigFromStorageOptions = {
  supabase?: Pick<SupabaseClient, "rpc">;
};

function parseRpcResult(data: unknown): WebsiteKompisInstallConfigRpcResult | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const record = data as Record<string, unknown>;
  return {
    ok: record.ok === true,
    install_id: typeof record.install_id === "string" ? record.install_id : undefined,
    config:
      record.config && typeof record.config === "object" && !Array.isArray(record.config)
        ? (record.config as Record<string, unknown>)
        : undefined,
    normalized_config:
      record.normalized_config &&
      typeof record.normalized_config === "object" &&
      !Array.isArray(record.normalized_config)
        ? (record.normalized_config as Record<string, unknown>)
        : undefined,
    updated_at:
      typeof record.updated_at === "string" || record.updated_at === null
        ? (record.updated_at as string | null)
        : undefined,
    updated_by:
      typeof record.updated_by === "string" || record.updated_by === null
        ? (record.updated_by as string | null)
        : undefined,
  };
}

export async function loadWebsiteKompisInstallConfigFromStorage(
  visitorContext: PublicCompanionVisitorContext,
  options: LoadWebsiteKompisInstallConfigFromStorageOptions = {},
): Promise<unknown> {
  if (!hasPublicCompanionVisitorContext(visitorContext)) {
    return null;
  }

  let supabase = options.supabase;
  if (!supabase) {
    try {
      supabase = createPublicAnonSupabaseClient();
    } catch {
      return null;
    }
  }

  const { data, error } = await supabase.rpc(WEBSITE_KOMPIS_PUBLIC_INSTALL_CONFIG_RPC, {
    p_install_id: visitorContext.installId,
    p_domain: visitorContext.domain,
  });

  if (error) {
    return null;
  }

  const parsed = parseRpcResult(data);
  if (!parsed?.ok) {
    return null;
  }

  return parsed.config ?? {};
}

export async function loadWebsiteKompisInstallConfigForApp(
  supabase: Pick<SupabaseClient, "rpc">,
  installId: string,
): Promise<WebsiteKompisInstallConfigRpcResult | null> {
  const { data, error } = await supabase.rpc(WEBSITE_KOMPIS_INSTALL_CONFIG_READ_RPC, {
    p_install_id: installId,
  });

  if (error) {
    return null;
  }

  return parseRpcResult(data);
}

export async function updateWebsiteKompisInstallConfigInStorage(
  supabase: Pick<SupabaseClient, "rpc">,
  installId: string,
  patch: Record<string, unknown>,
): Promise<WebsiteKompisInstallConfigRpcResult | null> {
  const { data, error } = await supabase.rpc(WEBSITE_KOMPIS_INSTALL_CONFIG_UPDATE_RPC, {
    p_install_id: installId,
    p_patch: patch,
  });

  if (error) {
    throw new Error(error.message);
  }

  return parseRpcResult(data);
}
