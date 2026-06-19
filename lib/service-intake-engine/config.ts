export const SERVICE_INTAKE_SECTIONS = [
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
  form: (id: string) => `/app/services/forms/${encodeURIComponent(id)}`,
  submission: (id: string) => `/app/services/submissions/${encodeURIComponent(id)}`,
} as const;

export function isServiceIntakePath(pathname: string): boolean {
  return SERVICE_INTAKE_SECTIONS.some((s) => pathname.startsWith(s.href));
}
