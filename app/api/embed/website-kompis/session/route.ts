import { NextResponse } from "next/server";
import {
  buildWebsiteKompisCorsHeaders,
  parseWebsiteKompisRequestOriginHostname,
} from "@/lib/marketing/website-kompis-embed-origin";
import {
  issueWebsiteKompisEmbedSessionForRequest,
  websiteKompisPublicSecurityErrorResponse,
} from "@/lib/marketing/website-kompis-public-security-gate";

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  const originHostname = parseWebsiteKompisRequestOriginHostname(origin);
  if (!origin || !originHostname) {
    return new NextResponse(null, { status: 403 });
  }

  return new NextResponse(null, {
    status: 204,
    headers: buildWebsiteKompisCorsHeaders(origin),
  });
}

export async function POST(request: Request) {
  let body: { installId?: unknown } = {};
  try {
    body = (await request.json()) as { installId?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const result = await issueWebsiteKompisEmbedSessionForRequest(request, body);
  if (!result.ok) {
    return websiteKompisPublicSecurityErrorResponse(result);
  }

  return NextResponse.json(
    {
      embedSession: result.embedSession,
      expiresAt: result.expiresAt,
    },
    {
      status: 200,
      headers: result.corsHeaders,
    },
  );
}
