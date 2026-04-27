"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { NeoButton } from "@/components/neo/neo-button";
import { useMasjidStore } from "@/store/masjid-store";

/**
 * toggle gelap/terang; dinonaktifkan bila "tema otomatis jam" aktif di admin.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const themeAuto = useMasjidStore((s) => s.config.themeAuto);
  const patchConfig = useMasjidStore((s) => s.patchConfig);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <span className="inline-block h-10 min-w-[5rem] rounded-xl border-2 border-black bg-zinc-200" />
    );
  }
  if (themeAuto) {
    return (
      <NeoButton
        variant="secondary"
        type="button"
        title="Ketuk untuk lepas auto; lalu pilih terang/gelap"
        onClick={() => patchConfig({ themeAuto: false })}
      >
        Auto (ketuk)
      </NeoButton>
    );
  }
  const dark = theme === "dark";
  return (
    <NeoButton
      variant="secondary"
      onClick={() => {
        setTheme(dark ? "light" : "dark");
        patchConfig({ themeAuto: false });
      }}
      aria-label="Ganti tema"
    >
      {dark ? "Terang" : "Gelap"}
    </NeoButton>
  );
}
