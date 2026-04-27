import type { MasjidConfig } from "@/types/masjidos";
import seed from "@/config/seed-masjid.json";

const B = seed as MasjidConfig;

/**
 * memastikan seluruh field konfigurasi terisi (migrasi seed dari penyimpanan lama).
 */
export function ensureMasjidConfig(c: MasjidConfig | undefined | null): MasjidConfig {
  if (!c) {
    return { ...B };
  }
  return {
    ...B,
    ...c,
    livestream: { ...B.livestream, ...c.livestream },
    marquee: { ...B.marquee, ...c.marquee },
  };
}
