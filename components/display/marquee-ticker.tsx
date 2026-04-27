"use client";

import { useMemo } from "react";

type Props = {
  text: string;
  /** detik siklus penuh gulir */
  durationSec: number;
};

/**
 * teks berjalan (duplikat isi agar transisi mulus) — neubrutalism.
 */
export function MarqueeTicker({ text, durationSec }: Props) {
  const safe = useMemo(() => {
    const t = (text || "")
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(" · ");
    return t.replace(/\s+/g, " ").trim() || "—";
  }, [text]);
  const seg = useMemo(() => `${safe}  ·  `, [safe]);
  return (
    <div className="pointer-events-none select-none border-t-4 border-black bg-yellow-300 py-2 text-zinc-900 dark:border-zinc-100 dark:bg-amber-400 dark:text-black">
      <div className="overflow-hidden">
        <div
          className="inline-flex w-[max-content] min-w-full animate-marquee-x whitespace-nowrap font-bold"
          style={{ animationDuration: `${Math.max(8, durationSec)}s` }}
        >
          <span className="pr-4">{seg}</span>
          <span className="pr-4" aria-hidden>
            {seg}
          </span>
        </div>
      </div>
    </div>
  );
}
