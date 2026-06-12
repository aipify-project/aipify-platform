import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type EarlyAccessBody = {
  name?: string;
  company?: string;
  email?: string;
  company_size?: string;
  industry?: string;
  interest_area?: string;
  message?: string;
};

function sanitize(value: unknown, max = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as EarlyAccessBody;

    const name = sanitize(body.name, 120);
    const company = sanitize(body.company, 200);
    const email = sanitize(body.email, 254)?.toLowerCase();

    if (!name || !company || !email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Valid name, company, and email are required" }, { status: 400 });
    }

    const payload = {
      name,
      company,
      email,
      company_size: sanitize(body.company_size, 40),
      industry: sanitize(body.industry, 120),
      interest_area: sanitize(body.interest_area, 80),
      message: sanitize(body.message, 2000),
    };

    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("submit_marketing_early_access_lead", {
        p_name: payload.name,
        p_company: payload.company,
        p_email: payload.email,
        p_company_size: payload.company_size,
        p_industry: payload.industry,
        p_interest_area: payload.interest_area,
        p_message: payload.message,
      });

      if (!error && data) {
        return NextResponse.json({ ok: true, stored: true });
      }
    } catch {
      // Fall through to server log when RPC/table unavailable
    }

    // eslint-disable-next-line no-console
    console.info("[marketing:early-access]", {
      ...payload,
      message: payload.message ? `[${payload.message.length} chars]` : null,
    });

    return NextResponse.json({ ok: true, stored: false });
  } catch {
    return NextResponse.json({ error: "Failed to submit early access request" }, { status: 500 });
  }
}
