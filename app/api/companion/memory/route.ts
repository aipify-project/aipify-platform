import { NextResponse } from "next/server";
import {
  createCompanionUserMemory,
  deleteCompanionUserMemory,
  exportCompanionUserMemory,
  getCompanionUserMemory,
  updateCompanionUserMemory,
  updateCompanionUserMemorySettings,
} from "@/lib/core/companion-memory-context";
import { parseCompanionMemoryCenter } from "@/lib/companion-memory-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") ?? undefined;
    const data = await getCompanionUserMemory(supabase, search);
    const parsed = parseCompanionMemoryCenter(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load companion memory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "export") {
      const exported = await exportCompanionUserMemory(supabase);
      return NextResponse.json(exported);
    }
    if (body.action === "enable") {
      const data = await updateCompanionUserMemorySettings(supabase, { memory_enabled: true });
      return NextResponse.json(parseCompanionMemoryCenter(data));
    }

    const data = await createCompanionUserMemory(supabase, body);
    return NextResponse.json(parseCompanionMemoryCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save companion memory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const data = await deleteCompanionUserMemory(supabase, id);
    return NextResponse.json(parseCompanionMemoryCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete companion memory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { id?: string; patch?: Record<string, unknown> };
    if (!body.patch) return NextResponse.json({ error: "patch required" }, { status: 400 });

    if (!body.id) {
      const data = await updateCompanionUserMemorySettings(supabase, body.patch);
      return NextResponse.json(parseCompanionMemoryCenter(data));
    }

    const data = await updateCompanionUserMemory(supabase, body.id, body.patch);
    return NextResponse.json(parseCompanionMemoryCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update companion memory";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
