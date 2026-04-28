import { Suspense } from "react";

import { DisplayClient } from "./display-client";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

function DisplayFallback() {
  return (
    <div className="min-h-dvh bg-amber-50 p-6 dark:bg-slate-950 sm:p-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <SkeletonBlock h="h-10" className="max-w-md" />
        <SkeletonBlock h="h-48" />
        <SkeletonBlock h="h-64" />
      </div>
    </div>
  );
}

/**
 * Halaman /display — konten utama di-wrap Suspense untuk useSearchParams (mode simulasi).
 */
export default function DisplayPage() {
  return (
    <Suspense fallback={<DisplayFallback />}>
      <DisplayClient />
    </Suspense>
  );
}
