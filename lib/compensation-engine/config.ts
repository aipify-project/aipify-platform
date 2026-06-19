export const CMP614_SECTIONS = [
  { key: "overview", href: "/app/compensation" },
  { key: "employees", href: "/app/compensation/employees" },
  { key: "compensationPlans", href: "/app/compensation/plans" },
  { key: "commissions", href: "/app/compensation/commissions" },
  { key: "tips", href: "/app/compensation/tips" },
  { key: "bonuses", href: "/app/compensation/bonuses" },
  { key: "adjustments", href: "/app/compensation/adjustments" },
  { key: "payrollPeriods", href: "/app/compensation/payroll-periods" },
  { key: "approvals", href: "/app/compensation/approvals" },
  { key: "payrollInput", href: "/app/compensation/payroll-input" },
  { key: "exports", href: "/app/compensation/exports" },
  { key: "reconciliation", href: "/app/compensation/reconciliation" },
  { key: "policies", href: "/app/compensation/policies" },
  { key: "reports", href: "/app/compensation/reports" },
  { key: "myCompensation", href: "/app/compensation/my-compensation" },
  { key: "exceptions", href: "/app/compensation/exceptions" },
] as const;

export type Cmp614Section = (typeof CMP614_SECTIONS)[number]["key"];

export function getCmp614ActiveSection(pathname: string): Cmp614Section {
  if (pathname === "/app/compensation" || pathname === "/app/compensation/") return "overview";
  const match = CMP614_SECTIONS.find((s) => s.key !== "overview" && pathname.startsWith(s.href));
  return match?.key ?? "overview";
}

export function cmp614SectionToRpc(section: Cmp614Section): string {
  const map: Partial<Record<Cmp614Section, string>> = {
    myCompensation: "my_compensation",
    compensationPlans: "plans",
    payrollPeriods: "payroll_periods",
    payrollInput: "payroll_input",
  };
  return map[section] ?? section.replace(/([A-Z])/g, "_$1").toLowerCase();
}

export function cmp614UsesEmployeeRpc(section: Cmp614Section): boolean {
  return section === "myCompensation";
}
