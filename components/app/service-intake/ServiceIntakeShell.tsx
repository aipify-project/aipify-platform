import type { ReactNode } from "react";
import { ServiceIntakeNav } from "./ServiceIntakeNav";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";
export function ServiceIntakeShell({ labels, children }: { labels: ServiceIntakeLabels; children: ReactNode }) {
  return (<div className="space-y-6"><div><h1 className="text-2xl font-bold text-gray-900">{labels.title}</h1><p className="mt-2 text-gray-600">{labels.subtitle}</p></div><ServiceIntakeNav labels={labels.sections} />{children}</div>);
}
