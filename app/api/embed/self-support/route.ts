import { NextResponse } from "next/server";
import { validateEmbedRequest } from "@/lib/embed/validation";

export async function POST(request: Request) {
  const validation = validateEmbedRequest(request.headers, "self_support");

  if (!validation.ok) {
    return NextResponse.json({ error: validation.reason }, { status: 401 });
  }

  return NextResponse.json(
    {
      message:
        "Embedded self-support widget scaffold. Route generation through lib/intelligence/ — model-agnostic, never provider-branded.",
      context: {
        installation_id: validation.context.installation_id,
        domain: validation.context.domain,
      },
      future_channels: ["email", "messaging", "voice"],
      endpoints: {
        ask: "/api/self-support/ask",
        feedback: "/api/self-support/feedback",
      },
    },
    { status: 501 }
  );
}
