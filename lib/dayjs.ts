import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import type { Dayjs } from "dayjs";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/** Zona waktu WIB (default Indonesia). */
export const APP_TZ = "Asia/Jakarta";

/**
 * mengembalikan "sekarang" dalam zona aplikasi.
 */
export function nowTz(): Dayjs {
  return dayjs().tz(APP_TZ);
}

/**
 * mem-parsing string jam "HH:mm" ke Dayjs hari D untuk zona tertentu.
 */
export function parseTimeOnDate(date: string, hhmm: string, tz: string): Dayjs {
  return dayjs.tz(`${date} ${hhmm}`, "YYYY-MM-DD HH:mm", tz);
}

export { dayjs };
export type { Dayjs };
