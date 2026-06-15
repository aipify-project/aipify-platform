import type { AppNavLink } from "@/lib/app/build-nav";

export type NavSearchEntry = AppNavLink & {
  groupId: string;
  groupLabel: string;
  description: string;
};
