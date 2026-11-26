import { AipifyLoader } from "@/components/ui/aipify-loader";

/**
 * Soft-navigation placeholder for `/partners/**` — keeps the shell visible while
 * the next RSC page streams. Animation only; no customer-facing loading copy.
 */
export default function PartnersPortalLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
      <AipifyLoader centered size="sm" />
      <span className="sr-only">Aipify</span>
    </div>
  );
}
