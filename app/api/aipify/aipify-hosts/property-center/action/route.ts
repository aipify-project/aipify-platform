import { NextResponse } from "next/server";
import {
  archiveAipifyHostsProperty,
  assignAipifyHostsPropertyTeam,
  updateAipifyHostsPropertyProfile,
} from "@/lib/core/aipify-hosts-property-center";
import { parseAipifyHostsPropertyCenterActionResult } from "@/lib/aipify/aipify-hosts-property-center/parse";
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
      property_id?: string;
      payload?: Record<string, unknown>;
      role_key?: string;
      assignee_name?: string;
      assignee_contact?: string;
    };

    if (!body.property_id) return NextResponse.json({ error: "property_id required" }, { status: 400 });

    let data: Record<string, unknown>;
    switch (body.action) {
      case "update_profile":
        data = await updateAipifyHostsPropertyProfile(supabase, body.property_id, body.payload ?? {});
        break;
      case "archive":
        data = await archiveAipifyHostsProperty(supabase, body.property_id);
        break;
      case "assign_team":
        if (!body.role_key || !body.assignee_name) {
          return NextResponse.json({ error: "role_key and assignee_name required" }, { status: 400 });
        }
        data = await assignAipifyHostsPropertyTeam(
          supabase,
          body.property_id,
          body.role_key,
          body.assignee_name,
          body.assignee_contact,
        );
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsPropertyCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
