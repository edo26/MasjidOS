"use client";

import { useEffect, useRef } from "react";

import { playAdzanBeep } from "@/utils/adzan-beep";

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
