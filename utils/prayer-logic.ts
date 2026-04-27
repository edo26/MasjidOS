import type { JadwalRow, UiPrayerId } from "@/types/masjidos";
import { APP_TZ, nowTz, parseTimeOnDate, type Dayjs } from "@/lib/dayjs";
import type { CountdownUrgency } from "@/types/masjidos";

/** Urutan 5 waktu dalam hari. */
const ORDER: UiPrayerId[] = [
  "subuh",
  "dzuhur",
  "ashar",
  "maghrib",
  "isya",
];

const LABEL: Record<UiPrayerId, string> = {
  subuh: "Subuh",
  dzuhur: "Dzuhur",
  ashar: "Ashar",
  maghrib: "Maghrib",
  isya: "Isya",
};

/**
 * label UI untuk kunci waktu.
 */
export function labelPrayer(id: UiPrayerId): string {
  return LABEL[id];
}

/**
 * mengambil string HH:mm per id dari jadwal baris.
 */
function timeForRow(row: JadwalRow, id: UiPrayerId): string {
  return row[id];
}

/**
 * membangun momen Dayjs utk waktu shalat hari T tertentu.
 */
export function prayerMoment(row: JadwalRow, id: UiPrayerId): Dayjs {
  return parseTimeOnDate(row.date, timeForRow(row, id), APP_TZ);
}

export type DayPair = { today: JadwalRow; tomorrow: JadwalRow };

type NextResult = { id: UiPrayerId; at: Dayjs; secondsLeft: number };

/**
 * hitung waktu shalat berikut + sisa detik, termasuk lompatan ke subuh (besok) setelah isya.
 */
export function getNextPrayer(
  now: Dayjs,
  { today, tomorrow }: DayPair
): NextResult {
  const upcoming: { id: UiPrayerId; at: Dayjs }[] = [];

  for (const id of ORDER) {
    const at = prayerMoment(today, id);
    if (at.isAfter(now, "second")) {
      upcoming.push({ id, at });
    }
  }
  for (const id of ORDER) {
    const at = prayerMoment(tomorrow, id);
    if (at.isAfter(now, "second")) {
      upcoming.push({ id, at });
    }
  }

  if (upcoming.length === 0) {
    const at = prayerMoment(tomorrow, "subuh");
    return { id: "subuh", at, secondsLeft: Math.max(0, at.diff(now, "second")) };
  }

  const first = upcoming.reduce((a, b) =>
    a.at.isBefore(b.at) ? a : b
  );

  const secondsLeft = Math.max(0, first.at.diff(now, "second", true) | 0);
  return { id: first.id, at: first.at, secondsLeft };
}

/**
 * menentukan waktu shalat "aktif" (sesi setelah waktu lalu, sebelum berikut).
 */
export function getActivePrayer(
  now: Dayjs,
  { today, tomorrow }: DayPair
): { id: UiPrayerId; label: string } | null {
  const firstToday = prayerMoment(today, "subuh");
  if (now.isBefore(firstToday, "second")) {
    return null;
  }

  const candidates: { id: UiPrayerId; at: Dayjs }[] = ORDER.map((id) => ({
    id,
    at: prayerMoment(today, id),
  })).filter((p) => p.at.isSameOrBefore(now, "second"));

  if (candidates.length === 0) {
    return { id: "isya", label: LABEL.isya };
  }

  const last = candidates.reduce((a, b) =>
    a.at.isAfter(b.at) ? a : b
  );
  return { id: last.id, label: LABEL[last.id] };
}

/**
 * mengklasifikasikan urgensi tampilan hitung mundur.
 */
export function urgencyFromSeconds(sec: number): CountdownUrgency {
  if (sec < 60) return "critical";
  if (sec < 300) return "warning";
  if (sec < 900) return "normal";
  return "calm";
}

/**
 * format sisa waktu "HH:MM:SS".
 */
export function formatHms(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  return [h, m, r].map((n) => String(n).padStart(2, "0")).join(":");
}

/**
 * cek bila tampilan display harus memakai mode fokus hitung mundur.
 */
export function shouldFocusCountdown(
  secondsLeft: number,
  focusSec: number
): boolean {
  return secondsLeft <= focusSec;
}

/**
 * waktu tampil untuk header (WIB).
 */
export function formatClock(d: Dayjs = nowTz()): string {
  return d.format("HH:mm:ss");
}

/**
 * label tanggal singkat lokal.
 */
export function formatDateId(d: Dayjs = nowTz()): string {
  return d.format("dddd, DD MMMM YYYY");
}

export { APP_TZ, nowTz, ORDER, LABEL };
export type { Dayjs, NextResult };
