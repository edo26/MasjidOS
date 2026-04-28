"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { MarqueeTicker } from "@/components/display/marquee-ticker";
import { SiteHeader } from "@/components/layout/site-header";
import { MediaSlideshow } from "@/components/media/media-slideshow";
import { YoutubeEmbedFrame } from "@/components/media/youtube-embed-frame";
import { CriticalAdzanOverlay } from "@/components/prayer/critical-adzan-overlay";
import { ClockHms } from "@/components/prayer/clock-hms";
import { PrayerCountdown } from "@/components/prayer/prayer-countdown";
import { PrayerTimeGrid } from "@/components/prayer/prayer-time-grid";
import { NeoButton } from "@/components/neo/neo-button";
import { NeoCard } from "@/components/neo/neo-card";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { useCriticalBeep, useAdzanMomentBeep } from "@/hooks/useCriticalBeep";
import { useFullscreen } from "@/hooks/useFullscreen";
import { usePrayerData } from "@/hooks/usePrayerData";
import { useMasjidStore } from "@/store/masjid-store";
import type { UiPrayerId } from "@/types/masjidos";
import { labelPrayer, ORDER, urgencyFromSeconds } from "@/utils/prayer-logic";

const MARQUEE_PAD = "pb-14";

function parseSimPrayerId(v: string | null): UiPrayerId {
  if (!v) return "maghrib";
  const lower = v.toLowerCase() as UiPrayerId;
  return ORDER.includes(lower) ? lower : "maghrib";
}

/**
 * mode display / TV: jadwal, hitung mundur, media, marquee, fullscreen.
 * Query `?simulasi=kritis` memaksa tampilan seperti &lt;1 menit sebelum adzan (untuk uji dari /admin).
 */
export function DisplayClient() {
  const searchParams = useSearchParams();
  const simMode = searchParams.get("simulasi") === "kritis";
  const simSeconds = useMemo(() => {
    const n = parseInt(searchParams.get("detik") ?? "45", 10);
    if (Number.isNaN(n)) return 45;
    return Math.min(59, Math.max(1, n));
  }, [searchParams]);
  const simPrayerId = useMemo(
    () => parseSimPrayerId(searchParams.get("shalat")),
    [searchParams]
  );
  const hideMenuQ = searchParams.get("sembunyi_menu") === "1";

  const [simTickLeft, setSimTickLeft] = useState(simSeconds);
  /** Setelah hitungan sim 0: tampilan biasa + beep selesai (~2s) lalu ulang dari detik awal. */
  const [simPostAdzanCooldown, setSimPostAdzanCooldown] = useState(false);
  const simZeroHandledRef = useRef(false);

  useEffect(() => {
    if (!simMode) {
      setSimPostAdzanCooldown(false);
      simZeroHandledRef.current = false;
      return;
    }
    if (simTickLeft > 0) {
      simZeroHandledRef.current = false;
      return;
    }
    if (simZeroHandledRef.current) {
      return;
    }
    simZeroHandledRef.current = true;
    setSimPostAdzanCooldown(true);
    const t = window.setTimeout(() => {
      setSimPostAdzanCooldown(false);
      setSimTickLeft(simSeconds);
      simZeroHandledRef.current = false;
    }, 2200);
    return () => {
      clearTimeout(t);
      simZeroHandledRef.current = false;
    };
  }, [simMode, simTickLeft, simSeconds]);

  useEffect(() => {
    if (!simMode) {
      return;
    }
    setSimTickLeft(simSeconds);
  }, [simMode, simSeconds]);

  useEffect(() => {
    if (!simMode) {
      return;
    }
    const id = window.setInterval(() => {
      setSimTickLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [simMode, simSeconds]);

  const p = usePrayerData();
  const cfg = useMasjidStore((s) => s.config);
  const [on, goFs] = useFullscreen();
  const [showHeader, setShowHeader] = useState(!hideMenuQ);

  const focus =
    simMode ? simTickLeft > 0 && !simPostAdzanCooldown : p.focusCountdown;
  const secondsLeft = simMode ? simTickLeft : p.secondsLeft;
  const urgency = simMode ? urgencyFromSeconds(simTickLeft) : p.urgency;
  const nextLabel = simMode ? labelPrayer(simPrayerId) : p.nextLabel;

  useCriticalBeep(cfg.adzanBeep, simMode ? simTickLeft : p.secondsLeft);
  useAdzanMomentBeep(cfg.adzanBeep, simMode ? simTickLeft : p.secondsLeft);

  const showMarq = cfg.marquee.enabled && cfg.marquee.text.trim().length > 0;
  const nextIdGrid = simMode ? simPrayerId : p.nextId;
  const showCriticalOverlay =
    urgency === "critical" &&
    secondsLeft > 0 &&
    !(simMode && simPostAdzanCooldown);

  return (
    <div
      className={`relative min-h-dvh w-full ${
        showMarq ? MARQUEE_PAD : ""
      } ${focus ? "bg-amber-200/90 dark:bg-slate-900" : "bg-amber-50 dark:bg-slate-950"}`}
    >
      <CriticalAdzanOverlay
        visible={showCriticalOverlay}
        nextLabel={nextLabel}
        secondsLeft={secondsLeft}
        mosqueName={cfg.mosqueName}
        simMode={simMode}
      />
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
                  nextId={nextIdGrid}
                />
              </NeoCard>
            )}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          {focus && !showCriticalOverlay ? (
            <motion.div
              key="cd"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-4"
            >
              <PrayerCountdown
                nextLabel={nextLabel}
                secondsLeft={secondsLeft}
                urgency={urgency}
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
          ) : showCriticalOverlay ? null : (
            <p className="text-center text-sm font-bold text-zinc-700 dark:text-zinc-300">
              Fokus hitung mundur (≤ {Math.round(cfg.countdownFocusSec / 60)} menit) —
              media kembang setelah waktu
            </p>
          )}
        </AnimatePresence>
        {!simMode && p.error ? (
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
