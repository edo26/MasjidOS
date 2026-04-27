import type { JadwalRow } from "@/types/masjidos";

export type JadwalPair = { today: JadwalRow; tomorrow: JadwalRow };

type ApiOk = { status: true; data: JadwalPair };

/**
 * memuat jadwal hari ini + besok dari API route lokal.
 */
export async function loadJadwalFromApi(kotaId: number): Promise<JadwalPair> {
  const res = await fetch(`/api/jadwal?kota=${kotaId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Gagal memuat jadwal");
  }
  const j = (await res.json()) as ApiOk;
  return j.data;
}
