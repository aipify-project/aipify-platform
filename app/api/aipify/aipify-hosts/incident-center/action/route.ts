import { NextResponse } from "next/server";
import {
  assignAipifyHostsIncidentOwner,
  createAipifyHostsIncident,
  escalateAipifyHostsIncident,
  initiateAipifyHostsIncidentPlaybook,
  performAipifyHostsIncidentRecoveryAction,
  reportAipifyHostsEmergencyEvent,
  updateAipifyHostsIncidentSeverity,
  updateAipifyHostsIncidentStatus,
} from "@/lib/core/aipify-hosts-incident-center";
import { parseAipifyHostsIncidentCenterActionResult } from "@/lib/aipify/aipify-hosts-incident-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      incident_id?: string;
      incident_type?: string;
      description?: string;
      property_id?: string;
      severity?: string;
      reported_by?: string;
      status?: string;
      owner?: string;
      event_type?: string;
      action_type?: string;
      summary?: string;
      assignee_role?: string;
      playbook_key?: string;
    };

    let data: Record<string, unknown>;
    switch (body.action) {
      case "create_incident":
        if (!body.incident_type || !body.description?.trim()) {
          return NextResponse.json({ error: "incident_type and description required" }, { status: 400 });
        }
        data = await createAipifyHostsIncident(supabase, {
          incidentType: body.incident_type,
          description: body.description.trim(),
          propertyId: body.property_id,
          severity: body.severity,
          reportedBy: body.reported_by,
        });
        break;
      case "update_status":
        if (!body.incident_id || !body.status) {
          return NextResponse.json({ error: "incident_id and status required" }, { status: 400 });
        }
        data = await updateAipifyHostsIncidentStatus(supabase, body.incident_id, body.status);
        break;
      case "update_severity":
        if (!body.incident_id || !body.severity) {
          return NextResponse.json({ error: "incident_id and severity required" }, { status: 400 });
        }
        data = await updateAipifyHostsIncidentSeverity(supabase, body.incident_id, body.severity);
        break;
      case "assign_owner":
        if (!body.incident_id || !body.owner?.trim()) {
          return NextResponse.json({ error: "incident_id and owner required" }, { status: 400 });
        }
        data = await assignAipifyHostsIncidentOwner(supabase, body.incident_id, body.owner.trim());
        break;
      case "escalate":
        if (!body.incident_id) {
          return NextResponse.json({ error: "incident_id required" }, { status: 400 });
        }
        data = await escalateAipifyHostsIncident(supabase, body.incident_id);
        break;
      case "report_emergency":
        if (!body.event_type || !body.description?.trim()) {
          return NextResponse.json({ error: "event_type and description required" }, { status: 400 });
        }
        data = await reportAipifyHostsEmergencyEvent(supabase, {
          eventType: body.event_type,
          description: body.description.trim(),
          propertyId: body.property_id,
          reportedBy: body.reported_by,
        });
        break;
      case "recovery_action":
        if (!body.incident_id || !body.action_type) {
          return NextResponse.json({ error: "incident_id and action_type required" }, { status: 400 });
        }
        data = await performAipifyHostsIncidentRecoveryAction(supabase, {
          incidentId: body.incident_id,
          actionType: body.action_type,
          summary: body.summary,
          assigneeRole: body.assignee_role,
          playbookKey: body.playbook_key,
        });
        break;
      case "initiate_playbook":
        if (!body.incident_id || !body.playbook_key) {
          return NextResponse.json({ error: "incident_id and playbook_key required" }, { status: 400 });
        }
        data = await initiateAipifyHostsIncidentPlaybook(supabase, body.incident_id, body.playbook_key);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json(parseAipifyHostsIncidentCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
