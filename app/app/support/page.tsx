import { redirect } from "next/navigation";

/** Support hub — default to history (canonical APP route). */
export default function SupportHubPage() {
  redirect("/app/support/history");
}
