import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  parseDesktopChatHistory,
  parseDesktopNotifications,
  resolveDesktopChatIntent,
} from "@/lib/aipify/desktop";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 30);
    const { data, error } = await supabase.rpc("get_desktop_chat_history", { p_limit: limit });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopChatHistory(data));
  } catch {
    return NextResponse.json({ error: "Failed to load chat history" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { message } = (await request.json()) as { message?: string };
    if (!message?.trim()) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    await supabase.rpc("append_desktop_chat_message", {
      p_role: "user",
      p_content: message.trim(),
    });

    const { data: notifData } = await supabase.rpc("get_desktop_notifications", {
      p_limit: 10,
      p_status: null,
    });
    const notifications = parseDesktopNotifications(notifData);
    const result = resolveDesktopChatIntent(message, {
      notifications,
      lastNotification: notifications[0] ?? null,
    });

    if (result.reminder) {
      await supabase.rpc("create_desktop_reminder", {
        p_patch: {
          title: result.reminder.title,
          due_at: result.reminder.due_at,
          reminder_type: result.reminder.reminder_type,
        },
      });
    }

    await supabase.rpc("append_desktop_chat_message", {
      p_role: "assistant",
      p_content: result.reply,
      p_intent: result.intent,
      p_action_href: result.action_href ?? null,
    });

    return NextResponse.json({
      intent: result.intent,
      reply: result.reply,
      action_href: result.action_href ?? null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
