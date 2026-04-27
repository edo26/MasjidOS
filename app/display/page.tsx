"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { MarqueeTicker } from "@/components/display/marquee-ticker";
import { SiteHeader } from "@/components/layout/site-header";
import { MediaSlideshow } from "@/components/media/media-slideshow";
import { YoutubeEmbedFrame } from "@/components/media/youtube-embed-frame";
import { ClockHms } from "@/components/prayer/clock-hms";
import { PrayerCountdown } from "@/components/prayer/prayer-countdown";
import { PrayerTimeGrid } from "@/components/prayer/prayer-time-grid";
import { NeoButton } from "@/components/neo/neo-button";
import { NeoCard } from "@/components/neo/neo-card";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { useCriticalBeep } from "@/hooks/useCriticalBeep";
import { useFullscreen } from "@/hooks/useFullscreen";
import { usePrayerData } from "@/hooks/usePrayerData";
import { useMasjidStore } from "@/store/masjid-store";

const MARQUEE_PAD = "pb-14";

/**
 * mode display / TV: jadwal, hitung mundur, media, marquee, fullscreen.
 */
export default function DisplayPage() {
  const p = usePrayerData();
  const cfg = useMasjidStore((s) => s.config);
  const [on, goFs] = useFullscreen();
  const [showHeader, setShowHeader] = useState(true);
  useCriticalBeep(cfg.adzanBeep, p.secondsLeft);
  const focus = p.focusCountdown;
  const showMarq = cfg.marquee.enabled && cfg.marquee.text.trim().length > 0;

  return (
    <div
      className={`relative min-h-dvh w-full ${
        showMarq ? MARQUEE_PAD : ""
      } ${
        focus ? "bg-amber-200/90 dark:bg-slate-900" : "bg-amber-50 dark:bg-slate-950"
      }`}
    >
      <div
        className={`${
          showHeader ? "block" : "hidden"
        } border-b-4 border-black dark:border-zinc-100 px-4 py-3 sm:px-8`}
      >
        <div className="mx-auto max-w-7xl">
          <SiteHeader
            title="Display"
            right={
              <NeoButton
                variant="secondary"
                onClick={() => setShowHeader((v) => !v)}
              >
                {showHeader ? "Sembunyi" : "Menu"}
              </NeoButton>
            }
          />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-2xl font-black">{cfg.mosqueName}</p>
            <p className="text-sm font-bold">
              {cfg.cityLabel} · {p.todayRow.tanggal}
            </p>
          </div>
          <div className="text-right">
            <ClockHms />
            <NeoButton className="mt-2" onClick={goFs}>
              {on ? "Keluar layar penuh" : "Layar penuh (kiosk)"}
            </NeoButton>
          </div>
        </div>

        {cfg.showJadwalOnDisplay ? (
          <div className="mb-4">
            <h2 className="mb-1 text-sm font-extrabold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Jadwal waktu shalat
            </h2>
            {p.loading ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                <SkeletonBlock h="h-20" />
                <SkeletonBlock h="h-20" />
                <SkeletonBlock h="h-20" />
                <SkeletonBlock h="h-20" />
                <SkeletonBlock h="h-20" />
              </div>
            ) : (
              <NeoCard className="bg-amber-50/80 p-2 dark:bg-slate-800/60 sm:p-3">
                <PrayerTimeGrid
                  row={p.todayRow}
                  activeId={p.active?.id ?? null}
                  nextId={p.nextId}
                />
              </NeoCard>
            )}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {focus ? (
            <motion.div
              key="cd"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <PrayerCountdown
                nextLabel={p.nextLabel}
                secondsLeft={p.secondsLeft}
                urgency={p.urgency}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
        <AnimatePresence>
          {!focus ? (
            <motion.div
              key="md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {cfg.livestream.enabled ? (
                <YoutubeEmbedFrame
                  src={cfg.livestream.url}
                  title="Live"
                  autoplay={cfg.livestream.youtubeAutoplay}
                />
              ) : (
                <MediaSlideshow
                  items={cfg.mediaPlaylist}
                  defaultSlideSec={cfg.defaultSlideSec}
                />
              )}
            </motion.div>
          ) : (
            <p className="text-center text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Fokus hitung mundur (≤ {Math.round(cfg.countdownFocusSec / 60)} menit) —
              media kembang setelah waktu
            </p>
          )}
        </AnimatePresence>
        {p.error ? (
          <p className="mt-3 font-bold text-red-700 dark:text-red-300">
            {p.error}
          </p>
        ) : null}
      </div>

      {showMarq ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 print:hidden">
          <MarqueeTicker
            text={cfg.marquee.text}
            durationSec={cfg.marquee.durationSec}
          />
        </div>
      ) : null}
    </div>
  );
}
