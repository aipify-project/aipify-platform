export type CommandBriefIconTone =
  | "brand"
  | "critical"
  | "attention"
  | "success"
  | "info"
  | "restricted"
  | "verified"
  | "waiting";

export function commandBriefIconTileClass(tone: CommandBriefIconTone): string {
  switch (tone) {
    case "critical":
      return "bg-red-50 text-red-700 ring-red-100";
    case "attention":
      return "bg-amber-50 text-amber-800 ring-amber-100";
    case "success":
      return "bg-emerald-50 text-emerald-800 ring-emerald-100";
    case "info":
      return "bg-sky-50 text-sky-800 ring-sky-100";
    case "restricted":
      return "bg-slate-100 text-slate-700 ring-slate-200";
    case "verified":
      return "bg-emerald-50 text-emerald-800 ring-emerald-100";
    case "waiting":
      return "bg-amber-50 text-amber-800 ring-amber-100";
    case "brand":
    default:
      return "bg-violet-50 text-aipify-companion ring-violet-100";
  }
}
