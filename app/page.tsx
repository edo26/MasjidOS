"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { MediaSlideshow } from "@/components/media/media-slideshow";
import { YoutubeEmbedFrame } from "@/components/media/youtube-embed-frame";
import { CriticalAdzanOverlay } from "@/components/prayer/critical-adzan-overlay";
import { ClockHms } from "@/components/prayer/clock-hms";
import { PrayerCountdown } from "@/components/prayer/prayer-countdown";
import { PrayerTimeGrid } from "@/components/prayer/prayer-time-grid";
import { NeoCard } from "@/components/neo/neo-card";
import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { useCriticalBeep, useAdzanMomentBeep } from "@/hooks/useCriticalBeep";
import { usePrayerData } from "@/hooks/usePrayerData";
import { useMasjidStore } from "@/store/masjid-store";

/**
 * beranda: jam, jadwal, hitung mundur, media ringkas.
 */
export default function HomePage() {
  const p = usePrayerData();
  const cfg = useMasjidStore((s) => s.config);
  useCriticalBeep(cfg.adzanBeep, p.secondsLeft);
  useAdzanMomentBeep(cfg.adzanBeep, p.secondsLeft);
  const showCritical = !p.loading && p.urgency === "critical" && p.secondsLeft > 0;

  return (
    <PageShell>
      <CriticalAdzanOverlay
        visible={showCritical}
        nextLabel={p.nextLabel}
        secondsLeft={p.secondsLeft}
        mosqueName={cfg.mosqueName}
      />
      <SiteHeader
        title="MasjidOS"
        subtitle={`${cfg.mosqueName} · ${cfg.cityLabel} — jadwal myQuran, zona WIB.`}
      />
      <div className="mb-6 grid gap-6 lg:grid-cols-2">
        <NeoCard className="bg-cyan-100 dark:bg-cyan-950/40">
          {p.loading ? <SkeletonBlock h="h-24" /> : <ClockHms />}
        </NeoCard>
        <div>
          {p.loading ? (
            <SkeletonBlock h="h-32" className="mb-2" />
          ) : showCritical ? (
            <NeoCard className="flex min-h-[8rem] items-center justify-center bg-red-100 p-4 text-center dark:bg-red-950/50">
              <p className="text-sm font-bold">
                Peringatan &lt; 1 menit menuju adzan — tampilan layar penuh aktif
              </p>
            </NeoCard>
          ) : (
            <PrayerCountdown
              nextLabel={p.nextLabel}
              secondsLeft={p.secondsLeft}
              urgency={p.urgency}
            />
          )}
        </div>
      </div>
      {p.error ? (
        <p className="mb-4 rounded border-2 border-red-600 bg-red-200 p-2 font-bold text-red-900 dark:border-red-400 dark:bg-red-900/30 dark:text-red-100">
          {p.error}
        </p>
      ) : null}
      {p.loading ? (
        <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonBlock h="h-24" />
          <SkeletonBlock h="h-24" />
          <SkeletonBlock h="h-24" />
        </div>
      ) : (
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-black uppercase">Hari ini</h2>
          <p className="mb-3 text-sm font-bold">{p.todayRow.tanggal}</p>
          <PrayerTimeGrid
            row={p.todayRow}
            activeId={p.active?.id ?? null}
            nextId={p.nextId}
          />
        </div>
      )}
      <section>
        <h2 className="mb-2 text-xl font-black uppercase">Media & info</h2>
        {cfg.livestream.enabled ? (
          <YoutubeEmbedFrame
            src={cfg.livestream.url}
            title="Siaran"
            autoplay={cfg.livestream.youtubeAutoplay}
          />
        ) : (
          <MediaSlideshow
            items={cfg.mediaPlaylist}
            defaultSlideSec={cfg.defaultSlideSec}
          />
        )}
      </section>
    </PageShell>
  );
}
