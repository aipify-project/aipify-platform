import Link from "next/link";
import { resolveAppHref } from "@/lib/app/route-aliases";

type DevicesIntegrationsSubnavProps = {
  active: "hub" | "printers";
  labels: {
    hub: string;
    printers: string;
    settings: string;
  };
};

export function DevicesIntegrationsSubnav({ active, labels }: DevicesIntegrationsSubnavProps) {
  const items = [
    { id: "hub" as const, href: "/app/settings/devices", label: labels.hub },
    { id: "printers" as const, href: "/app/settings/devices/printers", label: labels.printers },
  ];

  return (
    <div className="space-y-3">
      <Link href={resolveAppHref("/app/settings")} className="text-sm text-indigo-600 hover:underline">
        {labels.settings}
      </Link>
      <nav className="flex gap-4 border-b border-gray-200 px-1 text-sm">
        {items.map((item) =>
          item.id === active ? (
            <span key={item.id} className="border-b-2 border-indigo-600 py-3 font-medium text-indigo-600">
              {item.label}
            </span>
          ) : (
            <Link key={item.id} href={item.href} className="py-3 text-gray-500 hover:text-gray-700">
              {item.label}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
