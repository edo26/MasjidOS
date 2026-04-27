"use client";

import { useEffect, useState } from "react";

import { formatClock, formatDateId, nowTz } from "@/utils/prayer-logic";

/**
 * jam lokal WIB (memperbarui per detik).
 */
export function ClockHms() {
  const [t, setT] = useState(() => nowTz());
  useEffect(() => {
    const id = setInterval(() => setT(nowTz()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div>
      <p className="font-display text-5xl font-black tabular-nums tracking-tight sm:text-6xl">
        {formatClock(t)}
      </p>
      <p className="mt-1 text-sm font-bold uppercase sm:text-base">
        {formatDateId(t)} · WIB
      </p>
    </div>
  );
}
