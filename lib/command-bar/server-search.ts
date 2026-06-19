import type { SupabaseClient } from "@supabase/supabase-js";
import { PLATFORM_ADMIN_NAV } from "@/lib/platform/nav-config";
import { searchUniversalForCommandBar } from "@/lib/universal-search-operations";
import { searchActivityForCommandBar } from "@/lib/activity-operations";
import { searchKnowledgeGraphForCommandBar } from "@/lib/knowledge-graph-operations";
import { searchIntegrationHubForCommandBar } from "@/lib/integration-hub-operations";
import { searchMarketplaceForCommandBar } from "@/lib/marketplace-operations";
import { searchSimulationForCommandBar } from "@/lib/simulation-operations";
import { searchExecutionForCommandBar } from "@/lib/execution-operations";
import { searchCompanionPresenceForCommandBar } from "@/lib/companion-presence-operations";
import { searchEvolutionForCommandBar } from "@/lib/evolution-operations";
import { searchOrganizationForCommandBar } from "@/lib/organization-operations";
import type { CommandBarLabels, CommandBarPortal, CommandBarSearchResult } from "./types";

type SearchInput = {
  supabase: SupabaseClient;
  portal: CommandBarPortal;
  query: string;
  labels?: CommandBarLabels;
};

function matchesQuery(value: string, query: string): boolean {
  return value.toLowerCase().includes(query.toLowerCase());
}

function category(labels: CommandBarLabels | undefined, key: keyof CommandBarLabels["categories"]): string {
  return labels?.categories[key] ?? key;
}

async function searchPlatformCustomers(
  supabase: SupabaseClient,
  query: string,
  labels?: CommandBarLabels
): Promise<CommandBarSearchResult[]> {
  const { data, error } = await supabase.rpc("list_platform_customers");
  if (error || !Array.isArray(data)) return [];

  return (data as Array<{ id: string; name: string; slug: string }>)
    .filter(
      (row) =>
        matchesQuery(row.name ?? "", query) ||
        matchesQuery(row.slug ?? "", query)
    )
    .slice(0, 8)
    .map((row) => ({
      id: `customer-${row.id}`,
      label: row.name,
      description: row.slug,
      href: `/platform/customers/${row.id}`,
      category: category(labels, "customers"),
    }));
}

async function searchPlatformSupportTickets(
  supabase: SupabaseClient,
  query: string,
  labels?: CommandBarLabels
): Promise<CommandBarSearchResult[]> {
  const { data, error } = await supabase.rpc("list_platform_support_queue");
  if (error || !Array.isArray(data)) return [];

  return (data as Array<{
    id: string;
    subject?: string;
    customer_name?: string;
    customer_email?: string;
    status?: string;
  }>)
    .filter(
      (row) =>
        matchesQuery(row.subject ?? "", query) ||
        matchesQuery(row.customer_name ?? "", query) ||
        matchesQuery(row.customer_email ?? "", query) ||
        matchesQuery(row.status ?? "", query)
    )
    .slice(0, 6)
    .map((row) => ({
      id: `support-${row.id}`,
      label: row.subject ?? "Support ticket",
      description: row.customer_name ?? row.customer_email,
      href: `/platform/support?case=${encodeURIComponent(row.id)}`,
      category: category(labels, "support"),
    }));
}

async function searchCustomerTeamMembers(
  supabase: SupabaseClient,
  query: string,
  labels?: CommandBarLabels
): Promise<CommandBarSearchResult[]> {
  const { data, error } = await supabase.rpc("get_customer_team_center");
  if (error || !data || typeof data !== "object") return [];

  const members = (data as Record<string, unknown>).members;
  if (!Array.isArray(members)) return [];

  return (members as Array<{ id: string; name?: string; email?: string; role?: string }>)
    .filter(
      (row) =>
        matchesQuery(row.name ?? "", query) ||
        matchesQuery(row.email ?? "", query) ||
        matchesQuery(row.role ?? "", query)
    )
    .slice(0, 6)
    .map((row) => ({
      id: `user-${row.id}`,
      label: row.name ?? row.email ?? "Team member",
      description: row.role,
      href: `/app/settings/team?member=${encodeURIComponent(row.id)}`,
      category: category(labels, "users"),
    }));
}

async function searchKnowledge(
  supabase: SupabaseClient,
  query: string,
  labels?: CommandBarLabels
): Promise<CommandBarSearchResult[]> {
  const { data, error } = await supabase.rpc("search_organization_knowledge", {
    p_filters: { query, limit: 8, status: "published" },
  });
  if (error || !Array.isArray(data)) return [];

  return (data as Array<{ id: string; title?: string; slug?: string; category_slug?: string }>).map(
    (row) => ({
      id: `knowledge-${row.id}`,
      label: row.title ?? row.slug ?? "Knowledge article",
      description: row.category_slug,
      href: row.slug
        ? `/app/knowledge-center-engine?article=${encodeURIComponent(row.slug)}`
        : "/app/knowledge-center-engine",
      category: category(labels, "knowledge"),
    })
  );
}

async function searchSkills(
  query: string,
  labels?: CommandBarLabels
): Promise<CommandBarSearchResult[]> {
  try {
    const { SKILL_REGISTRY } = await import("@/lib/core/skills/registry");
    return Object.values(SKILL_REGISTRY)
      .filter(
        (skill) =>
          matchesQuery(skill.name, query) ||
          matchesQuery(skill.description ?? "", query) ||
          matchesQuery(skill.id, query)
      )
      .slice(0, 6)
      .map((skill) => ({
        id: `skill-${skill.id}`,
        label: skill.name,
        description: skill.description,
        href: skill.layers.includes("platform")
          ? `/platform/skills?skill=${encodeURIComponent(skill.id)}`
          : `/app/skills?skill=${encodeURIComponent(skill.id)}`,
        category: category(labels, "skills"),
      }));
  } catch {
    return [];
  }
}

function searchPlatformModules(query: string, labels?: CommandBarLabels): CommandBarSearchResult[] {
  const navKeywords: Record<string, string[]> = {
    executive: ["executive", "center", "briefing"],
    overview: ["overview", "dashboard", "home"],
    customers: ["customers", "customer", "tenants"],
    subscriptions: ["subscriptions", "plans"],
    billing: ["billing", "payment"],
    invoices: ["invoices", "invoice"],
    paymentProviders: ["payment", "providers", "stripe"],
    installations: ["installations", "install"],
    installEngine: ["install engine", "install", "wizard"],
    updates: ["updates", "maintenance"],
    trust: ["trust", "security", "audit"],
    impact: ["impact", "metrics", "proof"],
    presencePilot: ["presence", "pilot"],
    pilotOperations: ["growth partner", "pilot", "operations"],
    pilotInstall: ["pilot", "install", "unonight"],
    metrics: ["metrics", "mrr", "revenue"],
    stats: ["stats", "statistics"],
    support: ["support", "tickets", "queue"],
    automations: ["automations", "workflows"],
    intelligence: ["intelligence", "learning", "brain"],
    actions: ["actions", "approvals"],
    skills: ["skills", "marketplace"],
    system: ["system", "status", "health"],
  };

  return PLATFORM_ADMIN_NAV.filter((item) => {
    const keywords = navKeywords[item.id] ?? [item.id];
    return keywords.some((keyword) => matchesQuery(keyword, query));
  })
    .slice(0, 4)
    .map((item) => ({
      id: `module-${item.id}`,
      label: (navKeywords[item.id]?.[0] ?? item.id).replace(/\b\w/g, (c) => c.toUpperCase()),
      href: item.href,
      category: category(labels, "modules"),
    }));
}

function searchDeepLinks(
  portal: CommandBarPortal,
  query: string,
  labels?: CommandBarLabels
): CommandBarSearchResult[] {
  const q = encodeURIComponent(query);

  if (portal === "platform" || portal === "super_admin") {
    return [
      {
        id: "nav-subscriptions-search",
        label: `Subscriptions — ${query}`,
        href: `/platform/subscriptions?q=${q}`,
        category: category(labels, "subscriptions"),
      },
      {
        id: "nav-automations-search",
        label: `Automations — ${query}`,
        href: `/platform/automations?q=${q}`,
        category: category(labels, "automations"),
      },
      {
        id: "nav-actions-search",
        label: `Actions — ${query}`,
        href: `/platform/actions?q=${q}`,
        category: category(labels, "actions"),
      },
      {
        id: "nav-growth-partners-search",
        label: `Growth Partners — ${query}`,
        href: `/platform/pilot-operations?q=${q}`,
        category: category(labels, "growthPartners"),
      },
    ];
  }

  return [
    {
      id: "nav-support-search",
      label: `Support — ${query}`,
      href: `/app/support?q=${q}`,
      category: category(labels, "support"),
    },
    {
      id: "nav-automations-search",
      label: `Automations — ${query}`,
      href: `/app/adaptive-automation?q=${q}`,
      category: category(labels, "automations"),
    },
    {
      id: "nav-actions-search",
      label: `Actions — ${query}`,
      href: `/app/approvals?q=${q}`,
      category: category(labels, "actions"),
    },
  ];
}

export async function searchCommandBar({
  supabase,
  portal,
  query,
  labels,
}: SearchInput): Promise<CommandBarSearchResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const tasks: Array<Promise<CommandBarSearchResult[]>> = [];

  if (portal === "platform" || portal === "super_admin") {
    tasks.push(searchPlatformCustomers(supabase, q, labels));
    tasks.push(searchPlatformSupportTickets(supabase, q, labels));
    tasks.push(Promise.resolve(searchPlatformModules(q, labels)));
  }

  if (portal === "customer") {
    tasks.push(searchCustomerTeamMembers(supabase, q, labels));
    tasks.push(searchUniversalForCommandBar(supabase, q));
    tasks.push(searchActivityForCommandBar(supabase, q));
    tasks.push(searchKnowledgeGraphForCommandBar(supabase, q));
    tasks.push(searchIntegrationHubForCommandBar(supabase, q));
    tasks.push(searchMarketplaceForCommandBar(supabase, q));
    tasks.push(searchSimulationForCommandBar(supabase, q));
    tasks.push(searchExecutionForCommandBar(supabase, q));
    tasks.push(searchCompanionPresenceForCommandBar(supabase, q));
    tasks.push(searchEvolutionForCommandBar(supabase, q));
    tasks.push(searchOrganizationForCommandBar(supabase, q));
  }

  if (portal === "customer" || portal === "platform" || portal === "super_admin") {
    tasks.push(searchKnowledge(supabase, q, labels));
  }

  tasks.push(searchSkills(q, labels));
  tasks.push(Promise.resolve(searchDeepLinks(portal, q, labels)));

  const batches = await Promise.all(tasks);
  const seen = new Set<string>();
  const results: CommandBarSearchResult[] = [];

  for (const batch of batches) {
    for (const item of batch) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      results.push(item);
    }
  }

  return results.slice(0, 16);
}
