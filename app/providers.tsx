"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";

import { TimeBasedThemeBridge } from "@/components/theme/time-based-theme-bridge";
import { useMasjidStore } from "@/store/masjid-store";

/**
 * provider tema next-themes untuk seluruh app + jembatan jadwal terang/gelap.
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useMasjidStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TimeBasedThemeBridge />
      {children}
    </ThemeProvider>
  );
}
