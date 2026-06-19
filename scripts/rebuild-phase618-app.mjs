#!/usr/bin/env node
/**
 * Atomic rebuild for Phase 618 application layer + config patches.
 * Run: node scripts/rebuild-phase618-app.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const w = (rel, content) => {
  const full = path.join(root, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content);
  return rel;
};

const files = {
  "lib/service-intake-engine/config.ts": `export const SERVICE_INTAKE_SECTIONS = [
  { key: "forms", href: "/app/services/forms", rpc: "forms" },
  { key: "submissions", href: "/app/services/submissions", rpc: "submissions" },
  { key: "consents", href: "/app/services/consents", rpc: "consents" },
  { key: "serviceDelivery", href: "/app/services/service-delivery", rpc: "service_delivery" },
] as const;

export type ServiceIntakeSection = (typeof SERVICE_INTAKE_SECTIONS)[number]["key"];

export function getServiceIntakeActiveSection(pathname: string): ServiceIntakeSection {
  const match = SERVICE_INTAKE_SECTIONS.find((s) => pathname.startsWith(s.href));
  return match?.key ?? "forms";
}

export function serviceIntakeSectionToRpc(section: ServiceIntakeSection): string {
  return SERVICE_INTAKE_SECTIONS.find((s) => s.key === section)?.rpc ?? section;
}

export const SERVICE_INTAKE_DETAIL_ROUTES = {
  form: (id: string) => \`/app/services/forms/\${encodeURIComponent(id)}\`,
  submission: (id: string) => \`/app/services/submissions/\${encodeURIComponent(id)}\`,
} as const;

export function isServiceIntakePath(pathname: string): boolean {
  return SERVICE_INTAKE_SECTIONS.some((s) => pathname.startsWith(s.href));
}
`,
  "lib/service-intake-engine/parse.ts": fs.readFileSync(
    path.join(root, "lib/service-payments-engine/parse.ts"),
    "utf8"
  ), // placeholder replaced below
};

// parse.ts - hand written (can't read from payments)
files["lib/service-intake-engine/parse.ts"] = `export type ServiceIntakeCenter = {
  found: boolean;
  error?: string;
  section?: string;
  engine?: string;
  principle?: string;
  privacy_note?: string;
  stats?: Record<string, number | string>;
  records?: Record<string, unknown>[];
  forms?: Record<string, unknown>[];
  submissions?: Record<string, unknown>[];
  consents?: Record<string, unknown>[];
  service_delivery?: Record<string, unknown>[];
  routes?: Record<string, string>;
};

export type ServiceIntakeDetail = {
  found: boolean;
  error?: string;
  entity_type?: string;
  entity_key?: string;
  record?: Record<string, unknown>;
  related?: Record<string, unknown>[];
  readiness?: Record<string, unknown>;
};

export type Int618BookingReadiness = {
  found: boolean;
  error?: string;
  booking_key?: string;
  ready?: boolean;
  blocked_reasons?: string[];
  principle?: string;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asArray(raw: unknown): Record<string, unknown>[] {
  return Array.isArray(raw) ? (raw as Record<string, unknown>[]) : [];
}

export function parseServiceIntakeCenter(raw: unknown): ServiceIntakeCenter {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    section: typeof row.section === "string" ? row.section : undefined,
    engine: typeof row.engine === "string" ? row.engine : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    stats: (asRecord(row.stats) ?? {}) as Record<string, number | string>,
    records: asArray(row.records),
    forms: asArray(row.forms),
    submissions: asArray(row.submissions),
    consents: asArray(row.consents),
    service_delivery: asArray(row.service_delivery),
    routes: asRecord(row.routes) as Record<string, string> | undefined,
  };
}

export function parseServiceIntakeDetail(raw: unknown): ServiceIntakeDetail {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    entity_type: typeof row.entity_type === "string" ? row.entity_type : undefined,
    entity_key: typeof row.entity_key === "string" ? row.entity_key : undefined,
    record: asRecord(row.record) ?? undefined,
    related: asArray(row.related),
    readiness: asRecord(row.readiness) ?? undefined,
  };
}

export function parseInt618BookingReadiness(raw: unknown): Int618BookingReadiness {
  const row = asRecord(raw) ?? {};
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    booking_key: typeof row.booking_key === "string" ? row.booking_key : undefined,
    ready: typeof row.ready === "boolean" ? row.ready : undefined,
    blocked_reasons: Array.isArray(row.blocked_reasons) ? (row.blocked_reasons as string[]) : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
  };
}
`;

Object.assign(files, {
  "lib/service-intake-engine/labels.ts": `import type { Translator } from "@/lib/i18n/translate";
import type { ServiceIntakeSection } from "./config";
export type ServiceIntakeLabels = {
  title: string; subtitle: string; loading: string; empty: string; refresh: string; principle: string; privacyNote: string; noRecords: string; companionAdvisor: string;
  sections: Record<ServiceIntakeSection, string>;
  stats: { activeForms: string; pendingSubmissions: string; consentsRequired: string; deliveryTasksOpen: string; readinessBlocked: string };
  detail: { back: string; overview: string; notFound: string };
  entityTypes: { form: string; submission: string };
  readiness: { ready: string; blocked: string; principle: string };
};
export function buildServiceIntakeLabels(t: Translator): ServiceIntakeLabels {
  const p = "customerApp.serviceIntake";
  return {
    title: t(\`\${p}.title\`), subtitle: t(\`\${p}.subtitle\`), loading: t(\`\${p}.loading\`), empty: t(\`\${p}.empty\`), refresh: t(\`\${p}.refresh\`), principle: t(\`\${p}.principle\`), privacyNote: t(\`\${p}.privacyNote\`), noRecords: t(\`\${p}.noRecords\`), companionAdvisor: t(\`\${p}.companionAdvisor\`),
    sections: { forms: t(\`\${p}.sections.forms\`), submissions: t(\`\${p}.sections.submissions\`), consents: t(\`\${p}.sections.consents\`), serviceDelivery: t(\`\${p}.sections.serviceDelivery\`) },
    stats: { activeForms: t(\`\${p}.stats.activeForms\`), pendingSubmissions: t(\`\${p}.stats.pendingSubmissions\`), consentsRequired: t(\`\${p}.stats.consentsRequired\`), deliveryTasksOpen: t(\`\${p}.stats.deliveryTasksOpen\`), readinessBlocked: t(\`\${p}.stats.readinessBlocked\`) },
    detail: { back: t(\`\${p}.detail.back\`), overview: t(\`\${p}.detail.overview\`), notFound: t(\`\${p}.detail.notFound\`) },
    entityTypes: { form: t(\`\${p}.entityTypes.form\`), submission: t(\`\${p}.entityTypes.submission\`) },
    readiness: { ready: t(\`\${p}.readiness.ready\`), blocked: t(\`\${p}.readiness.blocked\`), principle: t(\`\${p}.readiness.principle\`) },
  };
}
`,
  "lib/service-intake-engine/advisor.ts": `export function detectServiceIntakeAdvisorIntent(message: string): boolean {
  return /\\b(service intake|intake form|consent|submission|service delivery|booking readiness)\\b/i.test(message.toLowerCase());
}
export function getServiceIntakeAdvisorRoute(): string {
  return "/app/services/forms";
}
`,
  "lib/service-intake-engine/index.ts": `export { SERVICE_INTAKE_SECTIONS, SERVICE_INTAKE_DETAIL_ROUTES, getServiceIntakeActiveSection, serviceIntakeSectionToRpc, isServiceIntakePath, type ServiceIntakeSection } from "./config";
export { buildServiceIntakeLabels, type ServiceIntakeLabels } from "./labels";
export { parseServiceIntakeCenter, parseServiceIntakeDetail, parseInt618BookingReadiness, type ServiceIntakeCenter, type ServiceIntakeDetail, type Int618BookingReadiness } from "./parse";
export { detectServiceIntakeAdvisorIntent, getServiceIntakeAdvisorRoute } from "./advisor";
`,
  "lib/service-intake-engine/section-page.tsx": `import { ServiceIntakePanel } from "@/components/app/service-intake";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import type { ServiceIntakeSection } from "@/lib/service-intake-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
export async function ServiceIntakeSectionPage({ activeSection }: { activeSection: ServiceIntakeSection }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceIntake");
  const t = createTranslator(dict);
  return <ServiceIntakePanel labels={buildServiceIntakeLabels(t)} activeSection={activeSection} />;
}
`,
  "lib/service-intake-engine/detail-page.tsx": `import { ServiceIntakeDetailPanel } from "@/components/app/service-intake";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
export async function ServiceIntakeDetailPage({ entityType, entityKey }: { entityType: "form" | "submission"; entityKey: string }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "serviceIntake");
  const t = createTranslator(dict);
  return <ServiceIntakeDetailPanel labels={buildServiceIntakeLabels(t)} entityType={entityType} entityKey={entityKey} />;
}
`,
});

// Panel, Nav, Detail, Shell - read from embedded minimal versions
files["components/app/service-intake/ServiceIntakePanel.tsx"] = fs.readFileSync(
  path.join(root, "components/app/service-payments/ServicePaymentsPanel.tsx"),
  "utf8"
)
  .replace(/ServicePayments/g, "ServiceIntake")
  .replace(/service-payments-engine/g, "service-intake-engine")
  .replace(/servicePaymentsSectionToRpc/g, "serviceIntakeSectionToRpc")
  .replace(/\/api\/services\/payments/g, "/api/services/intake")
  .replace(/pickRows\(center \?\? \{ found: false \}, activeSection\)/g, "pickRows(center ?? { found: false }, activeSection)")
  .replace(/if \(section === "overview"\) return \[\.\.\.\(center\.payments \?\? \[\]\), \.\.\.\(center\.deposits \?\? \[\]\)\];[\s\S]*?return center\.records \?\? \[\];/,
    `if (center.records?.length) return center.records;
  if (section === "forms") return center.forms ?? [];
  if (section === "submissions") return center.submissions ?? [];
  if (section === "consents") return center.consents ?? [];
  if (section === "serviceDelivery") return center.service_delivery ?? [];
  return [];`)
  .replace(/item\.record_title \?\? item\.customer_label \?\? item\.booking_key/g, "item.record_title ?? item.form_title ?? item.customer_label ?? item.record_key")
  .replace(/if \(item\.location_label\) parts\.push[\s\S]*?if \(item\.amount != null\) parts\.push[\s\S]*?return parts\.join/g,
    `if (item.service_label) parts.push(String(item.service_label));
  if (item.customer_label) parts.push(String(item.customer_label));
  if (item.record_status) parts.push(String(item.record_status));
  return parts.join`)
  .replace(/\{activeSection === "overview" \? \([\s\S]*?\) : null\}/,
    `{activeSection === "forms" ? (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.activeForms} value={stats.active_forms ?? 0} />
            <StatCard label={labels.stats.pendingSubmissions} value={stats.pending_submissions ?? 0} />
            <StatCard label={labels.stats.consentsRequired} value={stats.consents_required ?? 0} />
            <StatCard label={labels.stats.deliveryTasksOpen} value={stats.delivery_tasks_open ?? 0} />
            <StatCard label={labels.stats.readinessBlocked} value={stats.readiness_blocked ?? 0} />
          </div>
        </section>
      ) : null}`)
  .replace(/\{activeSection !== "overview" \? \([\s\S]*?\) : null\}/, "")
  .replace(/labels\.checkout\.verificationRequired/g, "labels.readiness.principle")
  .replace(/typeof item\.payment_status === "string"[\s\S]*?: undefined/g, "typeof item.status_label === \"string\" ? item.status_label : undefined");

files["components/app/service-intake/ServiceIntakeNav.tsx"] = fs
  .readFileSync(path.join(root, "components/app/service-payments/ServicePaymentsNav.tsx"), "utf8")
  .replace(/ServicePayments/g, "ServiceIntake")
  .replace(/service-payments-engine/g, "service-intake-engine")
  .replace(/SERVICE_PAYMENTS_SECTIONS/g, "SERVICE_INTAKE_SECTIONS")
  .replace(/getServicePaymentsActiveSection/g, "getServiceIntakeActiveSection")
  .replace(/Service payments sections/g, "Service intake sections");

files["components/app/service-intake/ServiceIntakeDetailPanel.tsx"] = `"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseServiceIntakeDetail } from "@/lib/service-intake-engine";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
export function ServiceIntakeDetailPanel({ labels, entityType, entityKey }: { labels: ServiceIntakeLabels; entityType: "form" | "submission"; entityKey: string }) {
  const [detail, setDetail] = useState(parseServiceIntakeDetail(null));
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ entityType, entityKey });
    const res = await fetch(\`/api/services/intake/detail?\${params.toString()}\`);
    setDetail(res.ok ? parseServiceIntakeDetail(await res.json()) : parseServiceIntakeDetail({ found: false }));
    setLoading(false);
  }, [entityType, entityKey]);
  useEffect(() => { void load(); }, [load]);
  const backHref = entityType === "form" ? "/app/services/forms" : "/app/services/submissions";
  if (loading) return (<div className="flex min-h-[320px] items-center justify-center"><AipifyLoader centered /><span className="sr-only">{labels.loading}</span></div>);
  if (!detail.found || !detail.record) return (<div className="space-y-4"><Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">← {labels.detail.back}</Link><div className="rounded-2xl border border-amber-200 bg-amber-50 p-6"><p className="font-medium">{labels.detail.notFound}</p></div></div>);
  const record = detail.record;
  const ready = detail.readiness?.ready === true;
  return (<div className="space-y-6"><Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">← {labels.detail.back}</Link><div><p className="text-xs uppercase text-zinc-500">{entityType === "form" ? labels.entityTypes.form : labels.entityTypes.submission}</p><h2 className="mt-1 text-xl font-semibold">{String(record.record_title ?? entityKey)}</h2></div>{detail.readiness ? (<div className={\`rounded-2xl border px-5 py-4 text-sm \${ready ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}\`}><p className="font-medium">{ready ? labels.readiness.ready : labels.readiness.blocked}</p></div>) : null}</div>);
}
`;

files["components/app/service-intake/ServiceIntakeShell.tsx"] = `import type { ReactNode } from "react";
import { ServiceIntakeNav } from "./ServiceIntakeNav";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
export function ServiceIntakeShell({ labels, children }: { labels: ServiceIntakeLabels; children: ReactNode }) {
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1><p className="mt-2 text-gray-600">{labels.subtitle}</p></div><ServiceIntakeNav labels={labels.sections} />{children}</div>);
}
`;

files["components/app/service-intake/index.ts"] = `export { ServiceIntakePanel } from "./ServiceIntakePanel";
export { ServiceIntakeNav } from "./ServiceIntakeNav";
export { ServiceIntakeDetailPanel } from "./ServiceIntakeDetailPanel";
export { ServiceIntakeShell } from "./ServiceIntakeShell";
`;

const page = (section) => `import { ServiceIntakeSectionPage } from "@/lib/service-intake-engine/section-page";
export default function Page() { return <ServiceIntakeSectionPage activeSection="${section}" />; }
`;
files["app/app/services/forms/page.tsx"] = page("forms");
files["app/app/services/submissions/page.tsx"] = page("submissions");
files["app/app/services/consents/page.tsx"] = page("consents");
files["app/app/services/service-delivery/page.tsx"] = page("serviceDelivery");
files["app/app/services/forms/layout.tsx"] = `import type { ReactNode } from "react"; export default function L({ children }: { children: ReactNode }) { return <>{children}</>; }`;
files["app/app/services/submissions/layout.tsx"] = files["app/app/services/forms/layout.tsx"];
files["app/app/services/consents/layout.tsx"] = files["app/app/services/forms/layout.tsx"];
files["app/app/services/service-delivery/layout.tsx"] = files["app/app/services/forms/layout.tsx"];
files["app/app/services/forms/[templateId]/page.tsx"] = `import { ServiceIntakeDetailPage } from "@/lib/service-intake-engine/detail-page";
export default async function Page({ params }: { params: Promise<{ templateId: string }> }) {
  const { templateId } = await params; return <ServiceIntakeDetailPage entityType="form" entityKey={templateId} />;
}`;
files["app/app/services/submissions/[submissionId]/page.tsx"] = `import { ServiceIntakeDetailPage } from "@/lib/service-intake-engine/detail-page";
export default async function Page({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = await params; return <ServiceIntakeDetailPage entityType="submission" entityKey={submissionId} />;
}`;

files["app/api/services/intake/route.ts"] = `import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  try {
    const section = new URL(request.url).searchParams.get("section") ?? "forms";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_organization_service_intake_center", { p_section: section });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to load Service Intake Center" }, { status: 500 }); }
}`;

files["app/api/services/intake/detail/route.ts"] = `import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  try {
    const sp = new URL(request.url).searchParams;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_organization_service_intake_detail", { p_entity_type: sp.get("entityType") ?? "", p_entity_key: sp.get("entityKey") ?? "" });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to load Service Intake detail" }, { status: 500 }); }
}`;

files["app/api/services/bookings/readiness/route.ts"] = `import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
export async function GET(request: Request) {
  try {
    const bookingKey = new URL(request.url).searchParams.get("bookingKey") ?? "";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("int618_booking_readiness", { p_booking_key: bookingKey });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch { return NextResponse.json({ error: "Failed to load booking readiness" }, { status: 500 }); }
}`;

const created = Object.entries(files).map(([rel, content]) => w(rel, content));

// Patch split-config
const splitPath = path.join(root, "lib/i18n/customer-app-split-config.ts");
let split = fs.readFileSync(splitPath, "utf8");
if (!split.includes('"serviceIntake"')) {
  split = split.replace('"servicePayments",\n  "systemHealth",', '"servicePayments",\n  "serviceIntake",\n  "systemHealth",');
  fs.writeFileSync(splitPath, split);
  created.push("lib/i18n/customer-app-split-config.ts (patched)");
}

// Patch ServicesAreaChrome
const chromePath = path.join(root, "components/app/service-network/ServicesAreaChrome.tsx");
const chrome = `"use client";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ServiceNetworkNav } from "./ServiceNetworkNav";
import { ServicePaymentsNav } from "@/components/app/service-payments";
import { ServiceIntakeShell } from "@/components/app/service-intake";
import type { ServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import type { ServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { isServiceIntakePath } from "@/lib/service-intake-engine/config";

export function ServicesAreaChrome({ networkLabels, paymentsLabels, intakeLabels, children }: { networkLabels: ServiceNetworkLabels; paymentsLabels: ServicePaymentsLabels; intakeLabels: ServiceIntakeLabels; children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/app/services/payments")) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{paymentsLabels.title}</h1>
          <p className="mt-2 text-gray-600">{paymentsLabels.subtitle}</p>
        </div>
        <ServicePaymentsNav labels={paymentsLabels.sections} />
        {children}
      </div>
    );
  }
  if (isServiceIntakePath(pathname)) {
    return <ServiceIntakeShell labels={intakeLabels}>{children}</ServiceIntakeShell>;
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{networkLabels.title}</h1>
        <p className="mt-2 text-gray-600">{networkLabels.subtitle}</p>
      </div>
      <ServiceNetworkNav labels={networkLabels.sections} />
      {children}
    </div>
  );
}
`;
fs.writeFileSync(chromePath, chrome);
created.push("components/app/service-network/ServicesAreaChrome.tsx (patched)");

// Patch services layout
const layoutPath = path.join(root, "app/app/services/layout.tsx");
fs.writeFileSync(
  layoutPath,
  `import type { ReactNode } from "react";
import { ServicesAreaChrome } from "@/components/app/service-network/ServicesAreaChrome";
import { buildServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { buildServicePaymentsLabels } from "@/lib/service-payments-engine/labels";
import { buildServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ServicesLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const [networkDict, paymentsDict, intakeDict] = await Promise.all([
    getCustomerAppDictionaryForModule(locale, "serviceNetwork"),
    getCustomerAppDictionaryForModule(locale, "servicePayments"),
    getCustomerAppDictionaryForModule(locale, "serviceIntake"),
  ]);
  const networkLabels = buildServiceNetworkLabels(createTranslator(networkDict));
  const paymentsLabels = buildServicePaymentsLabels(createTranslator(paymentsDict));
  const intakeLabels = buildServiceIntakeLabels(createTranslator(intakeDict));
  return (
    <div className="mx-auto max-w-7xl p-6">
      <ServicesAreaChrome networkLabels={networkLabels} paymentsLabels={paymentsLabels} intakeLabels={intakeLabels}>
        {children}
      </ServicesAreaChrome>
    </div>
  );
}
`
);
created.push("app/app/services/layout.tsx (patched)");

const serviceIntakeBlock = `,
  "serviceIntake": {
    "title": "Service Intake",
    "subtitle": "Forms, submissions, consents, and service delivery readiness — governed intake before appointments proceed.",
    "principle": "Required intake and consents must be complete before service delivery begins.",
    "privacyNote": "Intake data respects organization, location, provider, and customer scopes.",
    "loading": "Loading",
    "empty": "Service Intake Center is not available for this organization.",
    "refresh": "Refresh",
    "noRecords": "No records in this section yet.",
    "companionAdvisor": "Companion Service Intake Advisor",
    "sections": { "forms": "Intake Forms", "submissions": "Submissions", "consents": "Consents", "serviceDelivery": "Service Delivery" },
    "stats": { "activeForms": "Active forms", "pendingSubmissions": "Pending submissions", "consentsRequired": "Consents required", "deliveryTasksOpen": "Delivery tasks open", "readinessBlocked": "Readiness blocked" },
    "detail": { "back": "Back to list", "overview": "Overview", "notFound": "This intake record could not be found." },
    "entityTypes": { "form": "Intake form", "submission": "Submission" },
    "readiness": { "ready": "Booking intake is ready", "blocked": "Booking intake is blocked", "principle": "Booking readiness is evaluated server-side before service delivery." }
  }`;

for (const loc of ["en", "no", "sv", "da"]) {
  const dash = path.join(root, `locales/${loc}/customer-app/dashboard.json`);
  let d = fs.readFileSync(dash, "utf8");
  if (!d.includes('"serviceIntake"')) {
    d = d.replace(/\n}\s*$/, `${serviceIntakeBlock}\n}\n`);
    fs.writeFileSync(dash, d);
    created.push(`locales/${loc}/customer-app/dashboard.json (patched)`);
  }
  const nav = path.join(root, `locales/${loc}/customer-app/navigation.json`);
  let n = fs.readFileSync(nav, "utf8");
  if (!n.includes('"serviceIntake"')) {
    n = n.replace(/("servicePayments": "[^"]+")(\s*\n)/, `$1,\n    "serviceIntake": "Service Intake"$2`);
    fs.writeFileSync(nav, n);
    created.push(`locales/${loc}/customer-app/navigation.json (patched)`);
  }
}

console.log("Created/updated", created.length, "paths");
spawnSync("node", ["scripts/generate-phase617-migration.mjs"], { cwd: root, stdio: "inherit" });
spawnSync("node", ["scripts/generate-phase618-migration.mjs"], { cwd: root, stdio: "inherit" });
spawnSync("rm", ["-rf", ".next", "tsconfig.tsbuildinfo"], { cwd: root, stdio: "inherit" });
const tc = spawnSync("npm", ["run", "typecheck"], { cwd: root, encoding: "utf8" });
if (tc.stdout) console.log(tc.stdout);
if (tc.stderr) console.error(tc.stderr);
console.log("typecheck exit:", tc.status);
spawnSync("git", ["add", "-A", "lib/service-intake-engine", "components/app/service-intake", "app/app/services/forms", "app/app/services/submissions", "app/app/services/consents", "app/app/services/service-delivery", "app/api/services/intake", "app/api/services/bookings", "scripts/generate-phase618-migration.mjs", "scripts/rebuild-phase618-app.mjs", "components/app/service-network/ServicesAreaChrome.tsx", "app/app/services/layout.tsx", "lib/i18n/customer-app-split-config.ts", "supabase/migrations/20261861800000_service_intake_forms_consents_delivery_readiness_engine_phase618.sql"], { cwd: root, stdio: "inherit" });
process.exit(tc.status ?? 0);
