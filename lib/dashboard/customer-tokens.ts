/** Premium SaaS accent — softer than legacy blue-600 → violet-600. */
export const CUSTOMER_ACCENT = {
  gradient: "bg-gradient-to-r from-indigo-500 to-violet-500",
  gradientHover: "hover:from-indigo-600 hover:to-violet-600",
  gradientButton: `bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600`,
  gradientActiveNav: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm",
  cardSurface:
    "border-indigo-100/80 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/40",
  cardGlow: "bg-indigo-200/20",
  dot: "bg-indigo-400",
  badge: "text-indigo-600/90",
} as const;
