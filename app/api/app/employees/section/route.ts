import { NextResponse } from "next/server";
import {
  getEmployeeDirectory,
  getEmployeeManagementInvitations,
  getEmployeeManagementDepartments,
  getEmployeeAccessControl,
  getEmployeeActivityLog,
  parseEmployeeDirectory,
} from "@/lib/employee-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "employees";

    if (section === "employees") {
      const data = await getEmployeeDirectory(supabase, {
        search: url.searchParams.get("search") ?? undefined,
        departmentId: url.searchParams.get("department_id") ?? undefined,
        role: url.searchParams.get("role") ?? undefined,
        status: url.searchParams.get("status") ?? undefined,
      });
      return NextResponse.json({ found: true, employees: parseEmployeeDirectory(data) });
    }
    if (section === "invitations") {
      return NextResponse.json(await getEmployeeManagementInvitations(supabase));
    }
    if (section === "departments") {
      return NextResponse.json(await getEmployeeManagementDepartments(supabase));
    }
    if (section === "access_control") {
      return NextResponse.json(await getEmployeeAccessControl(supabase));
    }
    if (section === "activity") {
      return NextResponse.json(await getEmployeeActivityLog(supabase));
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
