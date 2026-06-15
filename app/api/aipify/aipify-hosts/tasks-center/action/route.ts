import { NextResponse } from "next/server";
import {
  assignAipifyHostsTask,
  createAipifyHostsTask,
  createAipifyHostsTaskFromTemplate,
  initiateAipifyHostsPlaybook,
  updateAipifyHostsTaskStatus,
} from "@/lib/core/aipify-hosts-tasks-center";
import { parseAipifyHostsTasksCenterActionResult } from "@/lib/aipify/aipify-hosts-tasks-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      title?: string;
      description?: string;
      property_id?: string;
      category?: string;
      priority?: string;
      assignee_role?: string;
      assignee_name?: string;
      due_date?: string;
      scheduled_for?: string;
      recurrence?: string;
      task_id?: string;
      status?: string;
      playbook_key?: string;
      template_key?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "create_task":
        if (!body.title?.trim()) {
          return NextResponse.json({ error: "title required" }, { status: 400 });
        }
        data = await createAipifyHostsTask(supabase, {
          title: body.title.trim(),
          description: body.description,
          propertyId: body.property_id,
          category: body.category,
          priority: body.priority,
          assigneeRole: body.assignee_role,
          assigneeName: body.assignee_name,
          dueDate: body.due_date,
          scheduledFor: body.scheduled_for,
          recurrence: body.recurrence,
        });
        break;
      case "update_status":
        if (!body.task_id || !body.status) {
          return NextResponse.json({ error: "task_id and status required" }, { status: 400 });
        }
        data = await updateAipifyHostsTaskStatus(supabase, body.task_id, body.status);
        break;
      case "assign_task":
        if (!body.task_id || !body.assignee_role) {
          return NextResponse.json({ error: "task_id and assignee_role required" }, { status: 400 });
        }
        data = await assignAipifyHostsTask(supabase, body.task_id, body.assignee_role, body.assignee_name);
        break;
      case "initiate_playbook":
        if (!body.playbook_key) {
          return NextResponse.json({ error: "playbook_key required" }, { status: 400 });
        }
        data = await initiateAipifyHostsPlaybook(supabase, body.playbook_key, body.property_id);
        break;
      case "create_from_template":
        if (!body.template_key) {
          return NextResponse.json({ error: "template_key required" }, { status: 400 });
        }
        data = await createAipifyHostsTaskFromTemplate(supabase, body.template_key, body.property_id);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsTasksCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
