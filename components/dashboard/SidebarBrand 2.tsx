type SidebarBrandProps = {
  appName: string;
  companyName: string;
  plan: string;
};

export default function SidebarBrand({
  appName,
  companyName,
  plan,
}: SidebarBrandProps) {
  return (
    <div className="border-b border-gray-200 px-5 py-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white shadow-sm">
          A
        </span>
        <div className="min-w-0">
          <p className="truncate text-base font-bold tracking-tight text-gray-900">
            {appName}
          </p>
          <p className="truncate text-sm font-medium text-gray-600">
            {companyName}
          </p>
        </div>
      </div>
      <span className="mt-3 inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 ring-1 ring-violet-100">
        {plan}
      </span>
    </div>
  );
}
