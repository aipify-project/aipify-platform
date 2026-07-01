import { NextResponse } from "next/server";
import {
  PublicCompanionAskValidationError,
  askPublicPlatformCompanion,
} from "@/lib/marketing/public-companion-ask";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const response = await askPublicPlatformCompanion(body as Parameters<typeof askPublicPlatformCompanion>[0]);
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof PublicCompanionAskValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
