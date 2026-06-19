"use client";

import { AipifyMetricWidget } from "@/components/ui/aipify-metric-widget";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

export type CommandCenterSnapshotItem = {
  id: string;
  label: string;
  value: string | number;
  hint?: string;
};

type Props = {
  items: CommandCenterSnapshotItem[];
};

/** Dense executive snapshot row — replaces empty space at top of Command Center. */
export function AipifyCommandCenterSnapshot({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section aria-label="Organization snapshot" className={AipifyShellClasses.widgetGrid}>
      {items.map((item) => (
        <AipifyMetricWidget key={item.id} label={item.label} value={item.value} hint={item.hint} />
      ))}
    </section>
  );
}
