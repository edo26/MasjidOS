"use client";

import { useTimeBasedTheme } from "@/hooks/useTimeBasedTheme";
import { useMasjidStore } from "@/store/masjid-store";

/**
 * bridge klien: menerapkan tema otomatis menurut jam (tanpa me-render anak).
 */
export function TimeBasedThemeBridge() {
  const a = useMasjidStore((s) => s.config.themeAuto);
  const lf = useMasjidStore((s) => s.config.themeLightFrom);
  const df = useMasjidStore((s) => s.config.themeDarkFrom);
  useTimeBasedTheme(a, lf, df);
  return null;
}
