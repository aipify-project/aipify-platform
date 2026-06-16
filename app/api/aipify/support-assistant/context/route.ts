import { NextResponse } from "next/server";
import { parseSupportAssistantContext } from "@/lib/app-portal/support-assistant";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";

type ContextBody = {
  question_asked?: string;
  article_id?: string;
  article_title?: string;
  related_module?: string;
  user_language?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ContextBody;
    const locale = await getLocale();

    const { data, error } = await supabase.rpc("prepare_app_portal_support_assistant_context", {
      p_question_asked: body.question_asked ?? "",
      p_article_id: body.article_id ?? null,
      p_article_title: body.article_title ?? null,
      p_related_module: body.related_module ?? null,
      p_user_language: body.user_language ?? locale,
      p_context_payload: {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSupportAssistantContext(data));
  } catch {
    return NextResponse.json({ error: "Failed to prepare support context" }, { status: 500 });
  }
}
