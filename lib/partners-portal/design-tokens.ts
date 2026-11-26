/**
 * Seller portal visual tokens — Light Enterprise + wide app-shell layout.
 * Scope: /partners presentation only. No business-rule changes.
 */

export const SELLER_PORTAL_LAYOUT = {
  /** Fixed desktop sidebar width (within 232–268). */
  sidebarWidthPx: 256,
  sidebarWidthClass: "w-[256px]",
  /** Content area horizontal padding. */
  contentPadClass: "px-6 py-6 lg:px-8 lg:py-7",
  /** Topbar height target. */
  topbarMinClass: "min-h-16",
  /** Soft lavender-tinted canvas for the work area. */
  workCanvasClass: "bg-[#F6F4FB]",
  surfaceClass: "bg-white",
  radiusCard: "rounded-2xl",
  radiusControl: "rounded-xl",
  shadowCard: "shadow-[0_1px_2px_rgba(30,24,60,0.04),0_8px_24px_rgba(30,24,60,0.04)]",
  borderClass: "border border-[#E8E4F2]",
  focusRing: "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2",
} as const;

export const SELLER_PORTAL_TONES = {
  primary: {
    soft: "bg-[#F3EDFF] text-[#5538D3] ring-[#D3C7FF]",
    solid: "bg-[#7C3AED] text-white",
  },
  success: {
    soft: "bg-[#E8F7F0] text-[#146C43] ring-[#B7E4CF]",
    solid: "bg-[#059669] text-white",
  },
  warning: {
    soft: "bg-[#FFF4E5] text-[#945A15] ring-[#F5D4A3]",
    solid: "bg-[#D97706] text-white",
  },
  danger: {
    soft: "bg-[#FEECEC] text-[#B42318] ring-[#F5C2C0]",
    solid: "bg-[#DC2626] text-white",
  },
  info: {
    soft: "bg-[#E8EEFC] text-[#3E5ED6] ring-[#C9D4F8]",
    solid: "bg-[#4F6BED] text-white",
  },
  neutral: {
    soft: "bg-[#F4F6FB] text-[#5F6788] ring-[#E6E9F5]",
    solid: "bg-[#64748B] text-white",
  },
} as const;

export type SellerPortalTone = keyof typeof SELLER_PORTAL_TONES;
