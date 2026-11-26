import { NextRequest, NextResponse } from "next/server";
import {
  archiveSupportTemplate,
  createSupportTemplate,
  listEditableSupportTemplates,
  updateSupportTemplate,
} from "@/lib/platform-portal/support-center/template-store";
import type { SupportReplyTemplateCategory } from "@/lib/platform-portal/support-center/reply-templates";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** List editable starter + workspace templates (in-process; Core persist gated). */
export async function GET() {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }
  return NextResponse.json(
    {
      ok: true,
      persistConfigured: false,
      items: listEditableSupportTemplates(),
    },
    { headers: NO_STORE },
  );
}

/** Create / update / archive template workspace rows. */
export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
  }

  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "validation" }, { status: 400, headers: NO_STORE });
  }

  if (body.action === "create") {
    const result = createSupportTemplate({
      name: String(body.name ?? ""),
      category: String(body.category ?? "intake") as SupportReplyTemplateCategory,
      subject: String(body.subject ?? ""),
      body: String(body.body ?? ""),
      locale: typeof body.locale === "string" ? body.locale : "no",
    });
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE });
    }
    return NextResponse.json(result, { headers: NO_STORE });
  }

  if (body.action === "update") {
    const result = updateSupportTemplate(String(body.id ?? ""), {
      name: typeof body.name === "string" ? body.name : undefined,
      category:
        typeof body.category === "string"
          ? (body.category as SupportReplyTemplateCategory)
          : undefined,
      subject: typeof body.subject === "string" ? body.subject : undefined,
      body: typeof body.body === "string" ? body.body : undefined,
      active: typeof body.active === "boolean" ? body.active : undefined,
    });
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "not_found" ? 404 : 400, headers: NO_STORE },
      );
    }
    return NextResponse.json(result, { headers: NO_STORE });
  }

  if (body.action === "archive") {
    const result = archiveSupportTemplate(String(body.id ?? ""));
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.error === "not_found" ? 404 : 400, headers: NO_STORE },
      );
    }
    return NextResponse.json(result, { headers: NO_STORE });
  }

  return NextResponse.json({ error: "unknown_action" }, { status: 400, headers: NO_STORE });
}
