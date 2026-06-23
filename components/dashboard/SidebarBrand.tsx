import { AipifySidebarTypography } from "@/lib/design";

type SidebarBrandProps = {
  companyName: string;
  shellLabel: string;
};

export default function SidebarBrand({ companyName, shellLabel }: SidebarBrandProps) {
  return (
    <div className="border-b border-aipify-border px-5 py-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-sm">
          A
        </span>
        <div className="min-w-0 flex-1">
          <p className={AipifySidebarTypography.workspaceTitle} title={companyName}>
            {companyName}
          </p>
          <p className={`mt-1 ${AipifySidebarTypography.workspaceDescription}`} title={shellLabel}>
            {shellLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SidebarBrandLegacy({
  appName,
  companyName,
  plan,
  subtitle,
}: {
  appName: string;
  companyName: string;
  plan: string;
  subtitle?: string;
}) {
  return (
    <div className="border-b border-gray-200 px-5 py-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-sm">
          A
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight text-gray-900">{appName}</p>
          <p className="truncate text-sm font-medium text-gray-600">{companyName}</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {subtitle ? (
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            {subtitle}
          </span>
        ) : null}
        <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
          {plan}
        </span>
      </div>
    </div>
  );
}
