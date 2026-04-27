import { PageShell } from "@/components/layout/page-shell";
import { SkeletonBlock } from "@/components/ui/skeleton-block";

/**
 * rute fallback saat pemuatan: skeleton neubrutalism.
 */
export default function Loading() {
  return (
    <PageShell>
      <SkeletonBlock h="h-12" className="mb-4" />
      <div className="grid gap-4 sm:grid-cols-2">
        <SkeletonBlock h="h-32" />
        <SkeletonBlock h="h-32" />
      </div>
      <div className="mt-6 grid gap-2 sm:grid-cols-3">
        <SkeletonBlock h="h-20" />
        <SkeletonBlock h="h-20" />
        <SkeletonBlock h="h-20" />
      </div>
    </PageShell>
  );
}
