import { NextResponse } from "next/server";
import {
  getRolePermissionMatrixAudit,
  getRolePermissionMatrixRole,
  parseRolePermissionMatrixAudit,
  parseRolePermissionMatrixRoleDetail,
} from "@/lib/role-permission-matrix";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "audit";

    if (section === "audit") {
      const limit = Number(url.searchParams.get("limit") ?? 50);
      const data = await getRolePermissionMatrixAudit(supabase, limit);
      return NextResponse.json(parseRolePermissionMatrixAudit(data) ?? { found: false });
    }

    if (section === "role") {
      const roleKey = url.searchParams.get("role_key");
      if (!roleKey) return NextResponse.json({ error: "role_key required" }, { status: 400 });
      const data = await getRolePermissionMatrixRole(supabase, roleKey);
      return NextResponse.json(parseRolePermissionMatrixRoleDetail(data) ?? { found: false });
    }

    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load section";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
