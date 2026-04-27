/**
 * placeholder loading neubrutalism: blok bergaris tegas.
 */
export function SkeletonBlock({
  className = "",
  h = "h-8",
}: {
  className?: string;
  h?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl border-2 border-zinc-400 bg-zinc-200 ${h} w-full dark:border-zinc-600 dark:bg-zinc-800 ${className}`}
    />
  );
}
