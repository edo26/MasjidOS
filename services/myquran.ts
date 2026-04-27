import type { JadwalRow } from "@/types/masjidos";
import { APP_TZ, dayjs, nowTz } from "@/lib/dayjs";

type ApiJadwal = {
  tanggal: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  date: string;
};

type ApiEnvelope = { status: boolean; data: { jadwal: ApiJadwal; lokasi?: string } };

/**
 * memetakan jadwal API ke baris internal dengan tanggal YYYY-MM-DD.
 */
function mapRow(j: ApiJadwal): JadwalRow {
  return {
    date: j.date,
    tanggal: j.tanggal,
    subuh: j.subuh,
    dzuhur: j.dzuhur,
    ashar: j.ashar,
    maghrib: j.maghrib,
    isya: j.isya,
  };
}

/**
 * mem-fetch jadwal sholat untuk id kota + tanggal (string YYYY-MM-DD) via fetch.
 */
export async function fetchJadwal(
  kotaId: number,
  date: string
): Promise<JadwalRow> {
  const base = "https://api.myquran.com/v1/sholat/jadwal";
  const res = await fetch(`${base}/${kotaId}/${date}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    throw new Error(`Gagal jadwal: ${res.status}`);
  }
  const body = (await res.json()) as ApiEnvelope;
  if (!body.status || !body.data?.jadwal) {
    throw new Error("Jadwal tidak tersedia");
  }
  return mapRow(body.data.jadwal);
}

/**
 * mem-fetch hari ini + besok (WIB) untuk transisi pasca-Isya.
 */
export async function fetchTodayTomorrow(kotaId: number): Promise<{
  today: JadwalRow;
  tomorrow: JadwalRow;
}> {
  const t = nowTz();
  const d0 = t.format("YYYY-MM-DD");
  const d1 = t.add(1, "day").format("YYYY-MM-DD");
  const [today, tomorrow] = await Promise.all([
    fetchJadwal(kotaId, d0),
    fetchJadwal(kotaId, d1),
  ]);
  return { today, tomorrow };
}

/**
 * menebak apakah perlu pindah hari batas tengah malam (helper UI).
 */
export function clientNowDateWib(): string {
  return dayjs().tz(APP_TZ).format("YYYY-MM-DD");
}
