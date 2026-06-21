import { redirect } from "next/navigation";
import { COMPANION_EXPERIENCE_ROUTE } from "@/lib/app/companion";

export default function LegacySupportAssistantRedirect() {
  redirect(COMPANION_EXPERIENCE_ROUTE);
}
