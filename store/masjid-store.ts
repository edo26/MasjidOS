import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { MasjidConfig } from "@/types/masjidos";
import seed from "@/config/seed-masjid.json";
import { ensureMasjidConfig } from "@/utils/ensure-masjid-config";

const DEFAULT: MasjidConfig = seed as MasjidConfig;

/**
 * menggabungkan sebagian properti (deep untuk objek tersarang) ke konfigurasi penuh.
 */
function applyPartial(base: MasjidConfig, p: Partial<MasjidConfig>): MasjidConfig {
  return ensureMasjidConfig({
    ...base,
    ...p,
    livestream: { ...base.livestream, ...p.livestream },
    marquee: p.marquee
      ? { ...base.marquee, ...p.marquee }
      : base.marquee,
  } as MasjidConfig);
}

type State = {
  config: MasjidConfig;
  /** menimpa seluruh konfigurasi (dari impor / admin). */
  setConfig: (c: MasjidConfig) => void;
  /** perbarui properti sebagian. */
  patchConfig: (p: Partial<MasjidConfig>) => void;
};

/**
 * state global: pengaturan masjid, persist ke localStorage.
 */
export const useMasjidStore = create<State>()(
  persist(
    (set) => ({
      config: DEFAULT,
      setConfig: (c) => set({ config: ensureMasjidConfig(c) }),
      patchConfig: (p) =>
        set((s) => ({ config: applyPartial(s.config, p) })),
    }),
    {
      name: "masjidos-config-v1",
      skipHydration: true,
      partialize: (s) => ({ config: s.config }),
      merge: (persisted, current) => {
        const p = (persisted as { config?: MasjidConfig } | null)?.config;
        return {
          ...(current as State),
          config: ensureMasjidConfig(p),
        };
      },
    }
  )
);

export { DEFAULT as defaultMasjidConfig };
