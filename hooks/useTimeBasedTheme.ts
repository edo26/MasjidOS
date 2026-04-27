"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { nowTz } from "@/lib/dayjs";

type Bounds = { lightFrom: string; darkFrom: string };

/**
 * mem-parsing "HH:mm" ke menit 0-1439.
 */
function toMinutes(s: string): number {
  const [h, m] = s.split(":").map((n) => parseInt(n, 10) || 0);
  return h * 60 + m;
}

/**
 * jika waktu lokal WIB jatuh pada rentang "siang" (terang) berdasarkan batas bawah jam.
 */
function wantLight(mins: number, { lightFrom, darkFrom }: Bounds): boolean {
  const a = toMinutes(lightFrom);
  const b = toMinutes(darkFrom);
  if (a < b) {
    return mins >= a && mins < b;
  }
  return mins >= a || mins < b;
}

/**
 * menyelaraskan next-themes dengan jadwal terang/gelap (WIB) bila themeAuto diaktifkan.
 */
export function useTimeBasedTheme(
  active: boolean,
  lightFrom: string,
  darkFrom: string
): void {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || !active) {
      return;
    }
    const apply = () => {
      const d = nowTz();
      const mins = d.hour() * 60 + d.minute();
      const light = wantLight(mins, { lightFrom, darkFrom });
      setTheme(light ? "light" : "dark");
    };
    apply();
    const t = setInterval(apply, 30_000);
    return () => clearInterval(t);
  }, [mounted, active, lightFrom, darkFrom, setTheme]);
}

export { toMinutes, wantLight };
