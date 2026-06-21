import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Building2,
  Handshake,
  Layers,
  Lock,
  Package,
  Plug,
  Rocket,
  Scale,
  Settings,
  Shield,
  Sparkles,
} from "lucide-react";
import type { PublicKnowledgeCategoryId } from "@/lib/marketing/knowledge/types";

const CATEGORY_ICONS: Record<PublicKnowledgeCategoryId, LucideIcon> = {
  "getting-started": Rocket,
  companion: Sparkles,
  "knowledge-center": BookOpen,
  "trust-center": Shield,
  governance: Scale,
  "business-packs": Package,
  "growth-partners": Handshake,
  integrations: Plug,
  enterprise: Building2,
  security: Lock,
  operations: Settings,
  "business-operating-system": Layers,
};

type KnowledgeIconProps = {
  categoryId: PublicKnowledgeCategoryId;
  className?: string;
};

export default function KnowledgeIcon({ categoryId, className = "h-5 w-5" }: KnowledgeIconProps) {
  const Icon = CATEGORY_ICONS[categoryId] ?? BookOpen;
  return <Icon className={className} aria-hidden="true" />;
}

export function getCategoryIcon(categoryId: PublicKnowledgeCategoryId): LucideIcon {
  return CATEGORY_ICONS[categoryId] ?? BookOpen;
}
