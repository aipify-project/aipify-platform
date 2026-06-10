import { NextResponse } from "next/server";
import { detectPlatformFromHints } from "@/lib/install/platforms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const hints = Array.isArray(body.hints)
      ? (body.hints as unknown[]).filter((h): h is string => typeof h === "string")
      : [];

    const url = typeof body.url === "string" ? body.url : undefined;
    const combined = url ? [...hints, url] : hints;

    const result = detectPlatformFromHints(combined);

    if (!result.confident || !result.platform) {
      return NextResponse.json({
        detected: null,
        confident: false,
        message: "Could not determine platform automatically. Please select manually.",
        ask_customer: true,
      });
    }

    return NextResponse.json({
      detected: result.platform,
      confident: true,
      ask_customer: false,
    });
  } catch {
    return NextResponse.json(
      { error: "Platform detection failed" },
      { status: 500 }
    );
  }
}
