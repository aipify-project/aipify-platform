/**
 * Contract for CSP messages + sales materials SQL/RPC V3 (PREPARED_ONLY until Staging apply).
 * App code must call these RPCs only after Core reports backend_ready / found.
 */

export const CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_PATH =
  "docs/platform/sql-candidates/csp_selgere_complete_messages_materials_avatar_v3.sql" as const;

/** sha256 of the V3 candidate file at package freeze — recompute after any edit. */
export const CSP_MESSAGES_MATERIALS_SQL_CANDIDATE_SHA256 =
  "5c8654390c3c26239b4a97c5ade9b6669bccbf1cb753c5d4b7c93847ea73092c" as const;

export const CSP_MESSAGES_MATERIALS_REQUIRED_TABLES = [
  "csp_partner_messages",
  "csp_partner_message_recipients",
  "csp_sales_materials",
  "csp_sales_material_versions",
] as const;

export const CSP_MESSAGES_MATERIALS_REQUIRED_RPCS = [
  "csp_list_partner_messages",
  "csp_send_partner_message",
  "csp_mark_partner_message_read",
  "csp_list_sales_materials",
  "csp_upsert_sales_material",
  "csp_publish_sales_material",
  "csp_withdraw_sales_material",
  "csp_set_partner_avatar_url",
] as const;

/** Portal statuses that may list/send/read messages and see published materials. */
export const CSP_MESSAGES_MATERIALS_PORTAL_STATUSES = [
  "approved",
  "active",
  "certified",
  "in_academy",
] as const;

export const CSP_MESSAGES_MATERIALS_ERROR_CODES = [
  "unauthorized",
  "forbidden",
  "partner_not_found",
  "partner_not_active",
  "partner_id_required",
  "message_id_required",
  "material_id_required",
  "invalid_direction",
  "invalid_body",
  "invalid_subject",
  "invalid_payload",
  "invalid_avatar_url",
  "not_found",
  "send_failed",
] as const;

export type CspMessagesMaterialsRpcName = (typeof CSP_MESSAGES_MATERIALS_REQUIRED_RPCS)[number];

export type CspPartnerMessageListResponse = {
  found: boolean;
  backend_ready?: boolean;
  error?: string;
  messages?: Array<{
    id: string;
    thread_id: string;
    partner_id: string;
    direction: "admin_to_partner" | "partner_to_admin";
    subject: string | null;
    body: string;
    delivery_status: string;
    created_at: string;
    read_at: string | null;
    created_by_auth_user_id: string | null;
  }>;
};

export type CspSalesMaterialListResponse = {
  found: boolean;
  backend_ready?: boolean;
  error?: string;
  materials?: Array<{
    id: string;
    material_key: string;
    category: string;
    product_keys: string[];
    locales: string[];
    title: string;
    description: string | null;
    asset_path: string;
    mime_hint: string | null;
    version: string;
    published: boolean;
    published_at: string | null;
    withdrawn_at: string | null;
    updated_at: string;
  }>;
};

/** Fail-closed until Staging apply proves these RPCs exist. */
export function isCspMessagesMaterialsBackendReady(flags: {
  hasMessagesTable: boolean;
  hasMaterialsTable: boolean;
  hasListMessagesRpc: boolean;
  hasListMaterialsRpc: boolean;
}): boolean {
  return (
    flags.hasMessagesTable &&
    flags.hasMaterialsTable &&
    flags.hasListMessagesRpc &&
    flags.hasListMaterialsRpc
  );
}
