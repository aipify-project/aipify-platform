export const AIPIFY_BRAND = {
  pulse: {
    defaultOpacity: 0.18,
    hoverOpacity: 0.34,
    sizes: {
      xs: 20,
      sm: 28,
      md: 36,
      lg: 48,
    },
    colors: {
      mono: "#7c3aed",
      gradientFrom: "#6d28d9",
      gradientTo: "#a78bfa",
    },
  },
  orb: {
    sizes: {
      sm: 32,
      md: 48,
      lg: 64,
    },
    gradient: {
      from: "#6366f1",
      via: "#7c3aed",
      to: "#8b5cf6",
    },
  },
  platform: {
    version: "1.0",
  },
  sidebarMark: {
    pulseSize: 22,
    pulseOpacity: 0.28,
    pulseHoverOpacity: 0.5,
    textOpacity: 0.42,
    textHoverOpacity: 0.72,
  },
} as const;

export type AipifyPulseSize = keyof typeof AIPIFY_BRAND.pulse.sizes;
export type AipifyOrbSize = keyof typeof AIPIFY_BRAND.orb.sizes;
export type AipifyOrbStatus = "online" | "thinking" | "offline";
