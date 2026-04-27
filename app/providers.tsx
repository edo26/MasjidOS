"use client";

import { ThemeProvider } from "next-themes";
import { type ReactNode } from "react";

import { TimeBasedThemeBridge } from "@/components/theme/time-based-theme-bridge";

/**
 * provider tema next-themes untuk seluruh app + jembatan jadwal terang/gelap.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <TimeBasedThemeBridge />
      {children}
    </ThemeProvider>
  );
}
