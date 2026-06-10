import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_executive_center_bundle");

  if (error || !data) {
    return new Response("Unable to generate report.", { status: 500 });
  }

  const bundle = data as Record<string, unknown>;
  const cards = (bundle.cards ?? {}) as Record<string, unknown>;
  const businessHealth = (cards.business_health ?? {}) as Record<string, number>;
  const timeSaved = (cards.time_saved ?? {}) as Record<string, number>;
  const weekly = (bundle.weekly_summary ?? {}) as Record<string, unknown>;
  const monthly = (bundle.monthly_report ?? {}) as Record<string, string>;
  const period = monthly.period ?? new Date().toLocaleDateString("en", { month: "long", year: "numeric" });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Aipify Executive Report — ${period}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; color: #111; line-height: 1.5; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.1rem; margin-top: 2rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.25rem; }
    .meta { color: #6b7280; font-size: 0.875rem; }
    ul { padding-left: 1.25rem; }
    @media print { body { margin: 1rem; } }
  </style>
</head>
<body>
  <h1>Aipify Executive Report</h1>
  <p class="meta">${period} · Generated ${new Date().toLocaleString()}</p>

  <h2>Executive Summary</h2>
  <p>Business health: <strong>${businessHealth.score ?? "—"}%</strong> (${businessHealth.delta >= 0 ? "+" : ""}${businessHealth.delta ?? 0}% trend). Customer satisfaction estimated at <strong>${cards.customer_satisfaction ?? "—"}%</strong>.</p>

  <h2>Operational Performance</h2>
  <ul>
    <li>AI actions today: ${cards.ai_activity_today ?? 0}</li>
    <li>Pending approvals: ${cards.pending_approvals ?? 0}</li>
    <li>Support trend: ${weekly.support_trend ?? "stable"}</li>
    <li>Healing effectiveness: ${weekly.healing_effectiveness ?? "stable"}</li>
  </ul>

  <h2>AI Impact</h2>
  <p>Learning discoveries this period: ${weekly.learning_discoveries ?? 0}. Revenue opportunities identified: ${cards.revenue_opportunities ?? 0}.</p>

  <h2>Time Saved</h2>
  <p>Estimated operational time saved: <strong>${timeSaved.hours ?? 0}h ${timeSaved.minutes ?? 0}m</strong>.</p>

  <h2>Growth Opportunities</h2>
  <p>${cards.revenue_opportunities ?? 0} potential upgrades and expansion signals identified.</p>

  <h2>Strategic Recommendations</h2>
  <ul>
    ${Array.isArray(weekly.priorities) ? (weekly.priorities as string[]).map((p) => `<li>${p}</li>`).join("") : "<li>Review executive center for latest priorities.</li>"}
  </ul>

  <p class="meta" style="margin-top:3rem;">Aipify Executive Center · Internal use only</p>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
