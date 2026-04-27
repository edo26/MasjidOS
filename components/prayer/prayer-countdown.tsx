"use client";

import { motion, type Variants } from "framer-motion";

import { NeoCard } from "@/components/neo/neo-card";
import type { CountdownUrgency } from "@/types/masjidos";
import { formatHms } from "@/utils/prayer-logic";

type Props = {
  nextLabel: string;
  secondsLeft: number;
  urgency: CountdownUrgency;
  compact?: boolean;
};

const ubg: Record<CountdownUrgency, string> = {
  calm: "bg-sky-200 dark:bg-sky-800",
  normal: "bg-amber-100 dark:bg-amber-900/40",
  warning: "bg-amber-300 dark:bg-amber-700/60",
  critical: "bg-red-400 dark:bg-red-800",
};

const cardMotion: Variants = {
  critical: {
    boxShadow: [
      "6px 6px 0 0 #000",
      "10px 10px 0 0 #000",
      "6px 6px 0 0 #000",
    ],
    scale: [1, 1.01, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
  },
  rest: { boxShadow: "6px 6px 0 0 #000" },
};

/**
 * tampilan hitung mundur besar + gaya membedakan fase tersisa.
 */
export function PrayerCountdown({
  nextLabel,
  secondsLeft,
  urgency,
  compact = false,
}: Props) {
  const hms = formatHms(secondsLeft);
  return (
    <motion.div
      variants={cardMotion}
      animate={urgency === "critical" ? "critical" : "rest"}
    >
      <NeoCard
        className={`${
          compact ? "p-3" : "p-6"
        } ${ubg[urgency]} ${
          urgency === "critical"
            ? "animate-pulse border-red-700 dark:border-amber-200"
            : ""
        }`}
      >
        <p className="text-sm font-extrabold uppercase">
          Menuju {nextLabel}
        </p>
        <p
          className={`mt-2 font-display font-black tabular-nums text-black dark:text-white ${
            compact ? "text-4xl sm:text-5xl" : "text-5xl sm:text-7xl"
          } ${urgency === "critical" ? "animate-bounce" : ""}`}
        >
          {hms}
        </p>
        {urgency === "critical" ? (
          <p className="mt-1 text-sm font-bold text-red-900 dark:text-amber-100">
            Segera menuju shaf — kurang dari 1 menit
          </p>
        ) : null}
      </NeoCard>
    </motion.div>
  );
}
