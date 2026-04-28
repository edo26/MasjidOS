"use client";

import { useEffect, useState } from "react";

import type { Dayjs } from "@/lib/dayjs";
import { formatClock, formatDateId, nowTz } from "@/utils/prayer-logic";

/**
 * jam lokal WIB (memperbarui per detik).
 * Waktu nyata hanya di-set setelah mount agar HTML prerender tidak bentrok dengan hidrasi.
 */
export function ClockHms() {
  const [t, setT] = useState<Dayjs | null>(null);
  useEffect(() => {
    setT(nowTz());
    const id = setInterval(() => setT(nowTz()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <p className="font-display text-5xl font-black tabular-nums tracking-tight sm:text-6xl">
        {t ? formatClock(t) : "--:--:--"}
      </p>
      <p className="mt-1 text-sm font-bold uppercase sm:text-base">
        {t ? `${formatDateId(t)} · WIB` : "\u00A0"}
      </p>
    </div>
  );
}
