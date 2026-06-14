import type { SupabaseClient } from "@supabase/supabase-js";
import { parseExecutiveCenterBundle } from "@/lib/platform/executive-center";
import { parseSinceLastLoginEngineBundle } from "@/lib/since-last-login";
import type { CommandBarLabels, CommandBarPortal, CommandBarRecommendation } from "./types";

function scopeForPortal(portal: CommandBarPortal): string {
  if (portal === "customer") return "customer";
  if (portal === "super_admin") return "platform_executive";
  return "platform_admin";
}

function dedupeRecommendations(items: CommandBarRecommendation[]): CommandBarRecommendation[] {
  return items
    .filter((item, index, list) => list.findIndex((entry) => entry.id === item.id) === index)
    .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
    .slice(0, 6);
}

export async function fetchCommandBarRecommendations(
  supabase: SupabaseClient,
  portal: CommandBarPortal,
  labels: CommandBarLabels
): Promise<CommandBarRecommendation[]> {
  const recommendations: CommandBarRecommendation[] = [];

  const { data: sllData } = await supabase.rpc("get_since_last_login_engine", {
    p_scope: scopeForPortal(portal),
    p_touch_login: false,
  });

  if (sllData) {
    const parsed = parseSinceLastLoginEngineBundle(sllData);
    if (parsed?.items?.length) {
      for (const item of parsed.items.slice(0, 4)) {
        recommendations.push({
          id: item.id,
          label: item.summary_text,
          href: item.deep_link,
          priority: item.priority,
        });
      }
    }
  }

  if (portal === "platform" || portal === "super_admin") {
    const { data: execData } = await supabase.rpc("get_executive_center_bundle");
    if (execData) {
      const bundle = parseExecutiveCenterBundle(execData);
      const pending = bundle.cards.pending_approvals;
      if (pending > 0) {
        recommendations.push({
          id: "rec-pending-approvals",
          label: `${labels.recommendations.pendingApprovals} (${pending})`,
          href: "/platform/actions",
          priority: 1,
        });
      }

      const hasFailedAttention = (bundle.requires_attention ?? []).some(
        (item) =>
          item.href.includes("failed") ||
          item.message.toLowerCase().includes("failed") ||
          item.message.toLowerCase().includes("workflow")
      );
      if (hasFailedAttention) {
        recommendations.push({
          id: "rec-failed-automations",
          label: labels.recommendations.failedAutomations,
          href: "/platform/actions/failed",
          priority: 2,
        });
      }
    }

    if (portal === "super_admin") {
      const { data: superData } = await supabase.rpc("get_super_admin_control_center");
      if (superData && typeof superData === "object") {
        const gpPending = (superData as Record<string, unknown>).growth_partner_applications_pending;
        if (typeof gpPending === "number" && gpPending > 0) {
          recommendations.push({
            id: "rec-growth-partners",
            label: labels.recommendations.growthPartnerApplications,
            href: "/platform/pilot-operations",
            priority: 2,
          });
        }
      }
    }

    recommendations.push({
      id: "rec-executive-summary",
      label: labels.recommendations.executiveSummary,
      href: "/platform/executive",
      priority: 5,
    });
  }

  if (portal === "customer") {
    const { data: approvalsData } = await supabase.rpc("get_customer_approvals_center");
    if (approvalsData && typeof approvalsData === "object") {
      const approvals = (approvalsData as Record<string, unknown>).approvals;
      if (Array.isArray(approvals)) {
        const pendingCount = approvals.filter(
          (item) => (item as Record<string, unknown>).status === "pending"
        ).length;
        if (pendingCount > 0) {
          recommendations.push({
            id: "rec-pending-approvals",
            label: `${labels.recommendations.pendingApprovals} (${pendingCount})`,
            href: "/app/approvals",
            priority: 1,
          });
        }
      }
    }

    recommendations.push({
      id: "rec-executive-summary",
      label: labels.recommendations.executiveSummary,
      href: "/app/executive",
      priority: 5,
    });
  }

  return dedupeRecommendations(recommendations);
}
