import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";

type Props = {
  label: string;
  value: string | number;
  hint?: string;
  trend?: string;
  className?: string;
};

/** Premium metric tile for dashboards and command centers. */
export function AipifyMetricWidget({ label, value, hint, trend, className = "" }: Props) {
  return (
    <div className={`${AipifyShellClasses.metricWidget} ${className}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-aipify-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-aipify-text">{value}</p>
      {hint ? <p className="mt-1 text-xs text-aipify-text-secondary">{hint}</p> : null}
      {trend ? <p className="mt-1 text-xs font-medium text-aipify-accent">{trend}</p> : null}
    </div>
  );
}
