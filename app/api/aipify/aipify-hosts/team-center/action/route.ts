import { NextResponse } from "next/server";
import {
  removeAipifyHostsTeamMember,
  revokeAipifyHostsTeamInvitation,
  sendAipifyHostsTeamInvitation,
  updateAipifyHostsTeamMemberProperties,
  updateAipifyHostsTeamMemberRole,
} from "@/lib/core/aipify-hosts-team-center";
import { parseAipifyHostsTeamCenterActionResult } from "@/lib/aipify/aipify-hosts-team-center";
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
      email?: string;
      role_key?: string;
      property_ids?: string[];
      member_id?: string;
      invitation_id?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "send_invitation":
        if (!body.email?.trim() || !body.role_key) {
          return NextResponse.json({ error: "email and role_key required" }, { status: 400 });
        }
        data = await sendAipifyHostsTeamInvitation(
          supabase,
          body.email.trim(),
          body.role_key,
          body.property_ids ?? [],
        );
        break;
      case "update_role":
        if (!body.member_id || !body.role_key) {
          return NextResponse.json({ error: "member_id and role_key required" }, { status: 400 });
        }
        data = await updateAipifyHostsTeamMemberRole(supabase, body.member_id, body.role_key);
        break;
      case "update_properties":
        if (!body.member_id) {
          return NextResponse.json({ error: "member_id required" }, { status: 400 });
        }
        data = await updateAipifyHostsTeamMemberProperties(
          supabase,
          body.member_id,
          body.property_ids ?? [],
        );
        break;
      case "revoke_invitation":
        if (!body.invitation_id) {
          return NextResponse.json({ error: "invitation_id required" }, { status: 400 });
        }
        data = await revokeAipifyHostsTeamInvitation(supabase, body.invitation_id);
        break;
      case "remove_member":
        if (!body.member_id) {
          return NextResponse.json({ error: "member_id required" }, { status: 400 });
        }
        data = await removeAipifyHostsTeamMember(supabase, body.member_id);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsTeamCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
