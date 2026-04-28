"use client";

import { useEffect, useRef } from "react";

import { playAdzanBeep, playAdzanArrivedBeep } from "@/utils/adzan-beep";

/**
 * memicu beep ringan di bawah 60dtk, terjadwal per 15dtk, sekali bila mungkin.
 */
export function useCriticalBeep(
  adzanOn: boolean,
  secondsLeft: number
): void {
  const played = useRef<number | null>(null);
  useEffect(() => {
    if (!adzanOn || secondsLeft >= 60 || secondsLeft <= 0) {
      return;
    }
    if (secondsLeft % 15 !== 0) {
      return;
    }
    if (played.current === secondsLeft) {
      return;
    }
    played.current = secondsLeft;
    playAdzanBeep();
  }, [adzanOn, secondsLeft]);
}

/**
 * satu kali beep panjang saat hitungan mencapai adzan (0 atau lompat ke jadwal berikutnya).
 */
export function useAdzanMomentBeep(
  adzanOn: boolean,
  secondsLeft: number
): void {
  const prev = useRef<number | null>(null);
  useEffect(() => {
    if (!adzanOn) {
      prev.current = secondsLeft;
      return;
    }
    const p = prev.current;
    const s = secondsLeft;
    if (p !== null && p > 0 && s === 0) {
      playAdzanArrivedBeep(1.65);
    } else if (p !== null && p > 0 && p <= 5 && s > p + 30) {
      playAdzanArrivedBeep(1.65);
    }
    prev.current = s;
  }, [adzanOn, secondsLeft]);
}
