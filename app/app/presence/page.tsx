import { redirect } from "next/navigation";

/** Presence routes to Command Center — single Aipify Core interface (Phase 26). */
export default function AppPresenceRedirectPage() {
  redirect("/app/command-center");
}
