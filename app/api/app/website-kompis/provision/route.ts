import { NextResponse } from "next/server";
import { requestWebsiteKompisSiteProvision } from "@/lib/website-kompis-connection/provision-request";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let domainId: unknown;
  let confirmation: unknown;
  try {
    const body = (await request.json()) as { domainId?: unknown; confirmation?: unknown };
    domainId = body.domainId;
    confirmation = body.confirmation;
  } catch {
    domainId = undefined;
    confirmation = undefined;
  }

  const result = await requestWebsiteKompisSiteProvision(
    {
      rpc: async (_fn, args) => {
        const call = supabase.rpc as unknown as (
          fn: "provision_website_kompis_site",
          rpcArgs: { p_domain_id: string; p_confirmation: true },
        ) => PromiseLike<{ data: unknown; error: { message: string } | null }>;
        return call("provision_website_kompis_site", args);
      },
    },
    { domainId, confirmation },
  );
  if (!result.ok) {
    return NextResponse.json({ ok: false, code: result.code }, { status: result.httpStatus });
  }
  return NextResponse.json(
    {
      ok: true,
      installationId: result.installationId,
      domain: result.domain,
      created: result.created,
    },
    { status: result.httpStatus },
  );
}
