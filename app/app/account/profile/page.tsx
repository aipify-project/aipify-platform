import { redirect } from "next/navigation";

/** Profile placeholder is hidden from nav; deep links go to account security. */
export default function AccountProfilePage() {
  redirect("/app/account/security");
}
