import type { ActionLevel } from "./levels";

export const RISK_LEVEL_STYLES: Record<ActionLevel, string> = {
  0: "bg-sky-100 text-sky-900",
  1: "bg-emerald-100 text-emerald-900",
  2: "bg-amber-100 text-amber-900",
  3: "bg-orange-100 text-orange-900",
  4: "bg-rose-100 text-rose-900",
};
