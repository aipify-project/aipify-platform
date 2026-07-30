import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { WebsiteStagingFixtureArchiveResult, WebsiteStagingFixtureCreateResult } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export type WebsiteStagingFixtureRpcResult<T> =
  | { ok: true; value: T }
  | { ok: false; errorCode: string; rawMessage: string };

export async function createWebsiteStagingFixture(
  supabase: SupabaseClient,
  input: {
    environmentId: string;
    fixtureKey: string;
    locale: string;
    internalReason: string;
    confirmation: boolean;
    idempotencyKey: string;
  },
): Promise<WebsiteStagingFixtureRpcResult<WebsiteStagingFixtureCreateResult>> {
  const { data, error } = await supabase.rpc("create_website_staging_fixture", {
    p_environment_id: input.environmentId,
    p_fixture_key: input.fixtureKey,
    p_locale: input.locale,
    p_internal_reason: input.internalReason,
    p_confirmation: input.confirmation,
    p_idempotency_key: input.idempotencyKey,
  });
  if (error) {
    return { ok: false, errorCode: "create_fixture_failed", rawMessage: error.message };
  }
  const row = asRecord(data);
  return {
    ok: true,
    value: {
      id: String(row.id ?? ""),
      environmentId: String(row.environment_id ?? ""),
      fixtureKey: typeof row.fixture_key === "string" ? row.fixture_key : "",
      pagePath: typeof row.page_path === "string" ? row.page_path : "",
      locale: typeof row.locale === "string" ? row.locale : "en",
      status: (row.status as WebsiteStagingFixtureCreateResult["status"]) ?? "active",
      created: row.created === true,
      idempotentReplay: row.idempotent_replay === true,
    },
  };
}

export async function archiveWebsiteStagingFixture(
  supabase: SupabaseClient,
  input: { fixtureId: string; confirmation: boolean; internalReason: string },
): Promise<WebsiteStagingFixtureRpcResult<WebsiteStagingFixtureArchiveResult>> {
  const { data, error } = await supabase.rpc("archive_website_staging_fixture", {
    p_fixture_id: input.fixtureId,
    p_confirmation: input.confirmation,
    p_internal_reason: input.internalReason,
  });
  if (error) {
    return { ok: false, errorCode: "archive_fixture_failed", rawMessage: error.message };
  }
  const row = asRecord(data);
  return {
    ok: true,
    value: {
      id: String(row.id ?? ""),
      status: (row.status as WebsiteStagingFixtureArchiveResult["status"]) ?? "archived",
      idempotentReplay: row.idempotent_replay === true,
    },
  };
}
