import { AipifyLoader } from "@/components/ui/aipify-loader";

/**
 * Soft-navigation placeholder for `/app/dashboard` — animation only; sr-only accessibility label.
 */
export default function AppWorkspaceDashboardLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
      <AipifyLoader centered size="sm" />
      <span className="sr-only">Aipify</span>
    </div>
  );
}
