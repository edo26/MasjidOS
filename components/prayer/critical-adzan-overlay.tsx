"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId } from "react";

import { formatHms } from "@/utils/prayer-logic";

type Props = {
  /** Tampilkan overlay (fase &lt; 1 menit menuju adzan). */
  visible: boolean;
  nextLabel: string;
  secondsLeft: number;
  mosqueName?: string;
  /** Banner kecil mode uji dari /admin. */
  simMode?: boolean;
};

const R = 40;
/** Keliling lingkaran (jari-jari R). */
const CIRC = 2 * Math.PI * R;

const TRACK_W = 11;
const PROGRESS_W = 9;
/** Tik penanda tiap 15 dtk pada lingkaran 1 menit. */
const TICK_MAJORS = [0, 15, 30, 45] as const;

/**
 * Layar penuh: hitung mundur terakhir satu menit dengan progress lingkaran.
 * Satu komponen untuk produksi dan simulasi (/display?simulasi=kritis).
 */
export function CriticalAdzanOverlay({
  visible,
  nextLabel,
  secondsLeft,
  mosqueName,
  simMode = false,
}: Props) {
  const rawId = useId().replace(/:/g, "");
  const gradId = `crg-${rawId}`;
  const ringSec = Math.min(60, Math.max(0, secondsLeft));
  const progress = ringSec / 60;
  const dashFilled = progress * CIRC;
  const pct = Math.round(progress * 100);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="critical-fs"
          role="alert"
          aria-live="assertive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[200] flex flex-col overflow-hidden bg-red-500 text-black print:hidden dark:bg-red-950 dark:text-amber-50"
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.1]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, #000 0, #000 2px, transparent 2px, transparent 12px)",
              }}
            />
          </div>

          {simMode ? (
            <div className="relative z-10 shrink-0 border-b-4 border-black bg-amber-300 py-2.5 text-center text-xs font-black uppercase tracking-wide text-amber-950 dark:border-amber-400 dark:bg-amber-800 dark:text-amber-100 sm:text-sm">
              Simulasi — bukan waktu adzan sebenarnya
            </div>
          ) : null}

          <div
            className={`relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-6 sm:px-10 ${
              simMode ? "pt-2" : ""
            }`}
          >
            <div className="flex w-full max-w-xl flex-shrink-0 flex-col items-center text-center">
              {mosqueName ? (
                <p className="mb-2 line-clamp-2 text-xs font-black uppercase tracking-widest text-black/85 dark:text-amber-100/90 sm:text-sm">
                  {mosqueName}
                </p>
              ) : null}
              <h2 className="text-2xl font-black uppercase leading-tight sm:text-3xl md:text-4xl">
                Menuju {nextLabel}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm font-bold leading-snug text-black/90 sm:text-base dark:text-amber-50/95">
                Kurang dari 1 menit — segera menuju shaf
              </p>
            </div>

            <div className="relative mx-auto mt-8 flex w-full max-w-[min(92vw,28rem)] flex-shrink-0 flex-col items-center justify-center sm:mt-10">
              <p className="mb-3 text-center text-sm font-black tabular-nums sm:text-base">
                <span className="rounded-xl border-2 border-black bg-amber-100/95 px-3 py-1 text-black shadow-[3px_3px_0_#000] dark:border-amber-200 dark:bg-amber-400/30 dark:text-amber-50 dark:shadow-[3px_3px_0_#fef3c7]">
                  Sisa ±{ringSec} dtk
                  <span className="mx-2 opacity-60">·</span>
                  {pct}% dari 1 menit
                </span>
              </p>

              <motion.div
                className="relative aspect-square w-full max-w-[min(82vmin,22rem)] sm:max-w-[min(72vmin,28rem)]"
                animate={{ scale: [1, 1.012, 1] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 h-full w-full drop-shadow-[8px_8px_0_#000] dark:drop-shadow-[8px_8px_0_rgba(255,255,255,0.85)]"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#fefce8" />
                      <stop offset="45%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                  </defs>
                  <g transform="translate(50 50) rotate(-90)">
                    {/* Trek penuh 60 dtk (latar) — arc sisa terlihat kontras di atasnya */}
                    <circle
                      r={R}
                      cx={0}
                      cy={0}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={TRACK_W}
                      className="text-black/52 dark:text-zinc-950/60"
                    />
                    {/* Arc sisa waktu — gradien kuning + glow */}
                    <circle
                      r={R}
                      cx={0}
                      cy={0}
                      fill="none"
                      stroke={`url(#${gradId})`}
                      strokeWidth={PROGRESS_W}
                      strokeLinecap="round"
                      strokeDasharray={`${dashFilled} ${CIRC}`}
                      className="transition-[stroke-dasharray] duration-1000 ease-linear"
                      style={{
                        filter:
                          "drop-shadow(0 0 10px rgba(254, 243, 199, 0.75)) drop-shadow(0 0 4px rgba(250, 204, 21, 0.9))",
                      }}
                    />

                    {TICK_MAJORS.map((t) => {
                      const angle = (t / 60) * 2 * Math.PI - Math.PI / 2;
                      const cos = Math.cos(angle);
                      const sin = Math.sin(angle);
                      const rOut = R + TRACK_W / 2 + 3;
                      const rIn = R + TRACK_W / 2 - 0.5;
                      return (
                        <line
                          key={t}
                          x1={cos * rIn}
                          y1={sin * rIn}
                          x2={cos * rOut}
                          y2={sin * rOut}
                          stroke="currentColor"
                          strokeWidth={t === 0 ? 2.25 : 1.75}
                          className="text-black dark:text-amber-100"
                          opacity={0.92}
                        />
                      );
                    })}
                  </g>
                </svg>

                <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center px-4 text-center">
                  <span className="font-display text-[clamp(2.5rem,10vmin,5rem)] font-black leading-none tabular-nums tracking-tight drop-shadow-[2px_2px_0_rgba(0,0,0,0.25)] dark:drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                    {formatHms(secondsLeft)}
                  </span>
                </div>
              </motion.div>
            </div>

            <p className="mt-7 max-w-md shrink-0 text-center text-xs font-bold uppercase tracking-wide text-black/75 dark:text-amber-100/75 sm:mt-8 sm:text-sm">
              Lingkaran kuning menyusut menuju adzan (putaran = 60 detik)
            </p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
