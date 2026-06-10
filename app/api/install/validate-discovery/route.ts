import { NextResponse } from "next/server";
import {
  BUSINESS_TYPES,
  HUMAN_VALIDATION_PROMPT,
  type BusinessType,
  type HumanValidationAction,
} from "@/lib/install";
import { createClient } from "@/lib/supabase/server";

const VALIDATION_ACTIONS: HumanValidationAction[] = [
  "approve",
  "modify",
  "reject",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const installationId = body.installation_id as string | undefined;
    const action = body.action as HumanValidationAction | undefined;

    if (!installationId) {
      return NextResponse.json(
        { error: "installation_id is required" },
        { status: 400 }
      );
    }

    if (!action || !VALIDATION_ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid validation action" }, { status: 400 });
    }

    const confirmedBusinessType = body.confirmed_business_type as
      | BusinessType
      | undefined;
    if (
      confirmedBusinessType &&
      !(BUSINESS_TYPES as readonly string[]).includes(confirmedBusinessType)
    ) {
      return NextResponse.json(
        { error: "Invalid business type" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc(
      "validate_installation_discovery",
      {
        p_installation_id: installationId,
        p_action: action,
        p_overrides: {
          confirmed_business_type: confirmedBusinessType,
          confirmed_workflows: body.confirmed_workflows,
          confirmed_systems: body.confirmed_systems,
          notes: typeof body.notes === "string" ? body.notes : undefined,
          prompt: HUMAN_VALIDATION_PROMPT,
        },
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Validation failed" },
      { status: 500 }
    );
  }
}
