import type { Dayjs } from "@/lib/dayjs";

/**
 * Tipe jadwal 5 waktu dari API (nama field myquran).
 */
export type ApiPrayerKey =
  | "subuh"
  | "dzuhur"
  | "ashar"
  | "maghrib"
  | "isya";

/**
 * Kunci tampilan UI (Indonesia) untuk 5 waktu shalat.
 */
export type UiPrayerId = ApiPrayerKey;

/** Item media dalam playlist. */
export type MediaItem =
  | { id: string; type: "image"; url: string; durationSec: number; title?: string }
  | { id: string; type: "video"; url: string; title?: string }
  | { id: string; type: "poster"; imageUrl: string; durationSec: number; title?: string };

/**
 * konfigurasi masjid (disinkron ke local storage / admin).
 */
export type MasjidConfig = {
  mosqueName: string;
  /** ID kota myquran, lihat: https://api.myquran.com/v1/sholat/kota/semua */
  kotaId: number;
  cityLabel: string;
  /** Tampil fokus hitung mundur bila tersisa ≤ N detik (utama: mode display). */
  countdownFocusSec: number;
  /** Beep sesaat bila tersisa < 60s (boleh dimatikan). */
  adzanBeep: boolean;
  livestream: {
    enabled: boolean;
    /** URL embed YouTube atau halaman live */
    url: string;
    /**
     * Autoplay (mute) untuk YouTube; browser mewajibkan muted agar autoplay jalan.
     */
    youtubeAutoplay: boolean;
  };
  /** Tema gelap/terang otomatis menurut jam (WIB). */
  themeAuto: boolean;
  /** Batas bawah: modus terang (inklusif) */
  themeLightFrom: string;
  /** Mulai modus gelap (inklusif) */
  themeDarkFrom: string;
  /** Teks berjalan di /display. */
  marquee: {
    enabled: boolean;
    text: string;
    /** detik per satu siklus penuh (makin kecil = makin cepat) */
    durationSec: number;
  };
  /** Tampil grid jadwal waktu shalat di /display */
  showJadwalOnDisplay: boolean;
  mediaPlaylist: MediaItem[];
  /** Detik per slide bila bukan image duration */
  defaultSlideSec: number;
  /** Polling jadwal (ms) */
  jadwalPollMs: number;
};

export type JadwalRow = {
  date: string;
  subuh: string;
  dzuhur: string;
  ashar: string;
  maghrib: string;
  isya: string;
  tanggal: string;
};

export type CountdownUrgency = "calm" | "normal" | "warning" | "critical";

export type NextPrayerInfo = {
  id: UiPrayerId;
  label: string;
  at: Dayjs;
  secondsLeft: number;
};

export type ActivePrayerInfo = {
  id: UiPrayerId;
  label: string;
} | null;
