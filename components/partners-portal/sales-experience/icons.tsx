import {
  BadgeCheck,
  Clock,
  Ear,
  GraduationCap,
  Link2,
  MessageCircle,
  Package,
  Search,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { GuidanceIconKey } from "./types";

const ICONS: Record<GuidanceIconKey, LucideIcon> = {
  search: Search,
  message: MessageCircle,
  listen: Ear,
  present: BadgeCheck,
  link: Link2,
  follow: Clock,
  product: Package,
  need: Users,
  commission: Wallet,
  learn: GraduationCap,
};

export function GuidanceIcon({ name, className }: { name: GuidanceIconKey; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden />;
}
