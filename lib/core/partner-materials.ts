/**
 * Partner Sales Materials Center — Phase 336.
 */

import type { RpcClient } from "./rpc-client";
import type { PartnerMaterialsFilters } from "@/lib/partner-materials/types";

export async function getPartnerMaterials(
  supabase: RpcClient,
  filters: PartnerMaterialsFilters = {},
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_materials", {
    p_category: filters.category ?? null,
    p_language: filters.language ?? null,
    p_format: filters.format ?? null,
    p_industry: filters.industry ?? null,
    p_business_pack: filters.business_pack ?? null,
    p_version: filters.version ?? null,
    p_search: filters.search ?? null,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerMaterialsCategories(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_materials_categories");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerMaterialsFavorites(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_materials_favorites");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function getPartnerMaterialsRecommended(
  supabase: RpcClient,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("get_partner_materials_recommended");
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function togglePartnerMaterialFavorite(
  supabase: RpcClient,
  materialId: string,
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("toggle_partner_material_favorite", {
    p_material_id: materialId,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}

export async function recordPartnerMaterialDownload(
  supabase: RpcClient,
  materialId: string,
  actionType = "download",
): Promise<Record<string, unknown>> {
  const { data, error } = await supabase.rpc("record_partner_material_download", {
    p_material_id: materialId,
    p_action_type: actionType,
  });
  if (error) throw new Error(error.message);
  return (data as Record<string, unknown>) ?? {};
}
