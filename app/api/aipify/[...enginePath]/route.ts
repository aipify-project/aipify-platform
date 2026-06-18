import { NextResponse } from "next/server";
import {
  handleAipifyEngineActions,
  handleAipifyEngineCard,
  handleAipifyEngineDashboard,
} from "@/lib/aipify/api-route-handlers";

const ENDPOINT_SUFFIXES = new Set(["dashboard", "card", "actions"]);

function splitEnginePath(enginePath: string[] | undefined) {
  if (!enginePath?.length) return null;
  const suffix = enginePath[enginePath.length - 1];
  if (!ENDPOINT_SUFFIXES.has(suffix)) return null;
  return {
    suffix,
    slugParts: enginePath.slice(0, -1),
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ enginePath: string[] }> }
) {
  const { enginePath } = await context.params;
  const parsed = splitEnginePath(enginePath);
  if (!parsed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (parsed.suffix === "dashboard") {
    return handleAipifyEngineDashboard(parsed.slugParts);
  }
  if (parsed.suffix === "card") {
    return handleAipifyEngineCard(parsed.slugParts);
  }

  return NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ enginePath: string[] }> }
) {
  const { enginePath } = await context.params;
  const parsed = splitEnginePath(enginePath);
  if (!parsed || parsed.suffix !== "actions") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return handleAipifyEngineActions(parsed.slugParts, request);
}
