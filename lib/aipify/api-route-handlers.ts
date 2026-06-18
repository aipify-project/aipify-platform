import "server-only";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  AIPIFY_API_CARD_PARSERS,
  AIPIFY_API_DASHBOARD_PARSERS,
  AIPIFY_API_ENGINE_RPC,
  type AipifyApiRpcEndpoint,
} from "@/lib/aipify/api-route-registry.generated";

function engineSlugFromPath(enginePath: string[] | undefined): string | null {
  if (!enginePath?.length) return null;
  return enginePath.join("/");
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null };
  return { supabase, user };
}

async function runParsedGet(
  engineSlug: string,
  endpoint: AipifyApiRpcEndpoint,
  loadParser: (slug: string) => (() => Promise<(data: unknown) => unknown>) | undefined
) {
  const { supabase, user } = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const load = loadParser(engineSlug);
  if (!load) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await supabase.rpc(endpoint.rpc);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const parse = await load();
  return NextResponse.json(parse(data));
}

export async function handleAipifyEngineDashboard(enginePath: string[] | undefined) {
  const engineSlug = engineSlugFromPath(enginePath);
  if (!engineSlug) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const config = AIPIFY_API_ENGINE_RPC[engineSlug]?.dashboard;
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    return await runParsedGet(engineSlug, config, (slug) => AIPIFY_API_DASHBOARD_PARSERS[slug]);
  } catch {
    return NextResponse.json({ error: config.errorMessage }, { status: 500 });
  }
}

export async function handleAipifyEngineCard(enginePath: string[] | undefined) {
  const engineSlug = engineSlugFromPath(enginePath);
  if (!engineSlug) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const config = AIPIFY_API_ENGINE_RPC[engineSlug]?.card;
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    return await runParsedGet(engineSlug, config, (slug) => AIPIFY_API_CARD_PARSERS[slug]);
  } catch {
    return NextResponse.json({ error: config.errorMessage }, { status: 500 });
  }
}

export async function handleAipifyEngineActions(
  enginePath: string[] | undefined,
  request: Request
) {
  const engineSlug = engineSlugFromPath(enginePath);
  if (!engineSlug) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const config = AIPIFY_API_ENGINE_RPC[engineSlug]?.actions;
  if (!config) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const { supabase, user } = await requireUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc(config.rpc, { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: config.errorMessage }, { status: 500 });
  }
}
