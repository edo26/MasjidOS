import { type ReactNode } from "react";

type Props = { children: ReactNode; className?: string; as?: "div" | "section" };

/**
 * kontainer kartu gaya neubrutalism: border tebal, bayangan tajam.
 */
export function NeoCard({ children, className = "", as: Tag = "div" }: Props) {
  return (
    <Tag
      className={`rounded-2xl border-[3px] border-black bg-amber-100 p-4 shadow-neo dark:border-zinc-100 dark:bg-slate-800 ${className}`}
    >
      {children}
    </Tag>
  );
}
