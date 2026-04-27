"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { nowTz } from "@/lib/dayjs";
import { loadJadwalFromApi, type JadwalPair } from "@/services/jadwal-client";
import { useMasjidStore } from "@/store/masjid-store";
import type { CountdownUrgency, JadwalRow, UiPrayerId } from "@/types/masjidos";
import {
  getActivePrayer,
  getNextPrayer,
  labelPrayer,
  shouldFocusCountdown,
  urgencyFromSeconds,
  type DayPair,
} from "@/utils/prayer-logic";

type PrayerLive = {
  nextId: UiPrayerId;
  nextLabel: string;
  active: { id: UiPrayerId; label: string } | null;
  secondsLeft: number;
  urgency: CountdownUrgency;
  focusCountdown: boolean;
  todayRow: JadwalRow;
  jadwalPair: JadwalPair | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

/**
 * hook utama: jadwal polling, waktu lokal, next + aktif, urgensi, fokus hitung mundur.
 */
export function usePrayerData(): PrayerLive {
  const kotaId = useMasjidStore((s) => s.config.kotaId);
  const focusSec = useMasjidStore((s) => s.config.countdownFocusSec);
  const pollMs = useMasjidStore((s) => s.config.jadwalPollMs);
  const [pair, setPair] = useState<JadwalPair | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secVersion, setSecVersion] = useState(0);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await loadJadwalFromApi(kotaId);
      setPair(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }, [kotaId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => void refresh(), pollMs);
    return () => clearInterval(id);
  }, [refresh, pollMs]);

  useEffect(() => {
    const id = window.setInterval(
      () => setSecVersion((n) => n + 1),
      1000
    );
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    void secVersion;
    const now = nowTz();
    if (!pair) {
      return {
        nextId: "subuh" as const,
        nextLabel: labelPrayer("subuh"),
        active: null,
        secondsLeft: 0,
        urgency: "calm" as CountdownUrgency,
        focusCountdown: false,
        todayRow: {
          date: now.format("YYYY-MM-DD"),
          tanggal: "",
          subuh: "—",
          dzuhur: "—",
          ashar: "—",
          maghrib: "—",
          isya: "—",
        },
        jadwalPair: pair,
        loading,
        error,
        refresh,
      };
    }
    const dayPair: DayPair = { today: pair.today, tomorrow: pair.tomorrow };
    const n = getNextPrayer(now, dayPair);
    const active = getActivePrayer(now, dayPair);
    const urgency = urgencyFromSeconds(n.secondsLeft);
    const focusCountdown = shouldFocusCountdown(n.secondsLeft, focusSec);

    return {
      nextId: n.id,
      nextLabel: labelPrayer(n.id),
      active,
      secondsLeft: n.secondsLeft,
      urgency,
      focusCountdown,
      todayRow: pair.today,
      jadwalPair: pair,
      loading,
      error,
      refresh,
    };
  }, [pair, loading, error, refresh, focusSec, secVersion]);
}
