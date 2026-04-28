"use client";

import { useMemo, useState } from "react";

import { SiteHeader } from "@/components/layout/site-header";
import { PageShell } from "@/components/layout/page-shell";
import { NeoButton } from "@/components/neo/neo-button";
import { NeoCard } from "@/components/neo/neo-card";
import type { MasjidConfig, UiPrayerId } from "@/types/masjidos";
import { useMasjidStore, defaultMasjidConfig } from "@/store/masjid-store";
import { readFileAsDataUrl } from "@/utils/read-file-data-url";
import { ensureMasjidConfig } from "@/utils/ensure-masjid-config";
import { ORDER, labelPrayer } from "@/utils/prayer-logic";

/**
 * halaman admin: menyesuaikan JSON konfigurasi lokal (localStorage + ekspor/impor).
 */
export default function AdminPage() {
  const { config, setConfig, patchConfig } = useMasjidStore();
  const [raw, setRaw] = useState(() => JSON.stringify(config, null, 2));
  const [err, setErr] = useState<string | null>(null);
  const uploadedLocal = config.mediaPlaylist.filter(
    (it) =>
      it.type === "image" && "url" in it && it.url.startsWith("data:")
  );

  const [simPrayer, setSimPrayer] = useState<UiPrayerId>("maghrib");
  const [simDetik, setSimDetik] = useState(45);
  const [simHideMenu, setSimHideMenu] = useState(true);
  const simPreviewUrl = useMemo(() => {
    const d = Math.min(59, Math.max(1, simDetik));
    const q = new URLSearchParams({
      simulasi: "kritis",
      shalat: simPrayer,
      detik: String(d),
    });
    if (simHideMenu) q.set("sembunyi_menu", "1");
    return `/display?${q.toString()}`;
  }, [simPrayer, simDetik, simHideMenu]);

  const applyJson = () => {
    setErr(null);
    try {
      const o = ensureMasjidConfig(
        JSON.parse(raw) as MasjidConfig
      );
      setConfig(o);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "JSON error");
    }
  };

  const exportFile = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "masjidos-config.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <PageShell>
      <SiteHeader
        title="Admin"
        subtitle="Konfigurasi disimpan di browser (localStorage). Ekspor untuk backup."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <NeoCard className="bg-cyan-100 dark:bg-cyan-950/30">
          <h2 className="text-lg font-black uppercase">Pengaturan cepat</h2>
          <label className="mt-2 block text-sm font-bold">Nama masjid</label>
          <input
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.mosqueName}
            onChange={(e) => patchConfig({ mosqueName: e.target.value })}
          />
          <label className="mt-2 block text-sm font-bold">ID kota (myQuran)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.kotaId}
            onChange={(e) => patchConfig({ kotaId: parseInt(e.target.value, 10) || 1301 })}
          />
          <label className="mt-2 block text-sm font-bold">Label lokasi</label>
          <input
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.cityLabel}
            onChange={(e) => patchConfig({ cityLabel: e.target.value })}
          />
          <label className="mt-2 block text-sm font-bold">
            Fokus hitung mundur (detik sebelum waktu)
          </label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.countdownFocusSec}
            onChange={(e) =>
              patchConfig({ countdownFocusSec: parseInt(e.target.value, 10) || 600 })
            }
          />
          <label className="mt-2 block text-sm font-bold">Jeda polling (ms)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.jadwalPollMs}
            onChange={(e) =>
              patchConfig({ jadwalPollMs: Math.max(15000, parseInt(e.target.value, 10) || 45000) })
            }
          />
          <label className="mt-2 flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={config.adzanBeep}
              onChange={(e) => patchConfig({ adzanBeep: e.target.checked })}
            />
            Beep jika &lt; 1 menit
          </label>
          <label className="mt-2 flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={config.livestream.enabled}
              onChange={(e) =>
                patchConfig({ livestream: { ...config.livestream, enabled: e.target.checked } })
              }
            />
            Tampilkan livestream
          </label>
          {config.livestream.enabled ? (
            <>
              <label className="mt-2 block text-sm font-bold">URL (YouTube / embed)</label>
              <input
                className="mt-1 w-full rounded-lg border-2 border-black p-2 font-mono text-sm dark:border-zinc-200 dark:bg-slate-800"
                value={config.livestream.url}
                onChange={(e) =>
                  patchConfig({ livestream: { ...config.livestream, url: e.target.value } })
                }
              />
              <label className="mt-2 flex items-center gap-2 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={config.livestream.youtubeAutoplay}
                  onChange={(e) =>
                    patchConfig({
                      livestream: {
                        ...config.livestream,
                        youtubeAutoplay: e.target.checked,
                      },
                    })
                  }
                />
                Autoplay (mute) saat /display
              </label>
            </>
          ) : null}
        </NeoCard>
        <NeoCard className="bg-rose-100 dark:bg-rose-950/30">
          <h2 className="text-lg font-black uppercase">Tema (WIB)</h2>
          <p className="mb-2 text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Terang antara jam bawah; mulai &quot;gelap&quot; pada batas ke dua (default 06:00
            s/d sebelum 18:00 = siang).
          </p>
          <label className="flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={config.themeAuto}
              onChange={(e) => patchConfig({ themeAuto: e.target.checked })}
            />
            Tema terang / gelap otomatis
          </label>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold">Mulai terang (HH:MM)</label>
              <input
                className="mt-1 w-full rounded-lg border-2 border-black p-2 font-mono dark:border-zinc-200 dark:bg-slate-800"
                value={config.themeLightFrom}
                onChange={(e) => patchConfig({ themeLightFrom: e.target.value })}
                pattern="[0-9]{2}:[0-9]{2}"
                placeholder="06:00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold">Mulai gelap (HH:MM)</label>
              <input
                className="mt-1 w-full rounded-lg border-2 border-black p-2 font-mono dark:border-zinc-200 dark:bg-slate-800"
                value={config.themeDarkFrom}
                onChange={(e) => patchConfig({ themeDarkFrom: e.target.value })}
                placeholder="18:00"
              />
            </div>
          </div>
        </NeoCard>
        <NeoCard className="bg-fuchsia-100 dark:bg-fuchsia-950/30">
          <h2 className="text-lg font-black uppercase">Teks berjalan (/display)</h2>
          <label className="mt-1 flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={config.marquee.enabled}
              onChange={(e) =>
                patchConfig({ marquee: { ...config.marquee, enabled: e.target.checked } })
              }
            />
            Tampilkan marquee
          </label>
          <label className="mt-2 block text-sm font-bold">Isi teks (pisah dengan |)</label>
          <textarea
            className="mt-1 min-h-[4rem] w-full rounded-lg border-2 border-black p-2 text-sm font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.marquee.text}
            onChange={(e) =>
              patchConfig({ marquee: { ...config.marquee, text: e.target.value } })
            }
          />
          <label className="mt-2 block text-sm font-bold">Durasi satu siklus (detik)</label>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
            value={config.marquee.durationSec}
            min={8}
            onChange={(e) =>
              patchConfig({
                marquee: {
                  ...config.marquee,
                  durationSec: Math.max(8, parseInt(e.target.value, 10) || 40),
                },
              })
            }
          />
        </NeoCard>
        <NeoCard className="bg-lime-100 dark:bg-lime-950/20">
          <h2 className="text-lg font-black uppercase">Halaman /display</h2>
          <label className="mt-1 flex items-center gap-2 font-bold">
            <input
              type="checkbox"
              checked={config.showJadwalOnDisplay}
              onChange={(e) => patchConfig({ showJadwalOnDisplay: e.target.checked })}
            />
            Tampilkan grid jadwal shalat
          </label>
        </NeoCard>
        <NeoCard className="bg-orange-100 dark:bg-orange-950/30 lg:col-span-2">
          <h2 className="text-lg font-black uppercase">
            Simulasi &lt; 1 menit sebelum adzan
          </h2>
          <p className="mt-1 text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Layar penuh merah dengan <strong>lingkaran mundur</strong> (tersisa dalam satu menit
            terakhir) dan jam digital di tengah — sama seperti di TV saat fase kritis nyata. Media /
            slideshow tertutup overlay. Pratinjau memakai pengaturan masjid Anda; beep kritis
            mengikuti opsi &quot;Beep jika &lt; 1 menit&quot; seperti di produksi. Saat 0: beep panjang
            ~1,6 dtk, lalu tampilan biasa; hitungan simulasi otomatis mulai lagi (~2 dtk).
          </p>
          <div className="mt-3 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-bold">Shalat berikutnya</label>
              <select
                className="mt-1 rounded-lg border-2 border-black bg-white p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
                value={simPrayer}
                onChange={(e) => setSimPrayer(e.target.value as UiPrayerId)}
              >
                {ORDER.map((id) => (
                  <option key={id} value={id}>
                    {labelPrayer(id)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold">Sisa detik (1–59)</label>
              <input
                type="number"
                min={1}
                max={59}
                className="mt-1 w-24 rounded-lg border-2 border-black p-2 font-bold dark:border-zinc-200 dark:bg-slate-800"
                value={simDetik}
                onChange={(e) =>
                  setSimDetik(Math.min(59, Math.max(1, parseInt(e.target.value, 10) || 45)))
                }
              />
            </div>
            <label className="mt-6 flex items-center gap-2 font-bold sm:mt-8">
              <input
                type="checkbox"
                checked={simHideMenu}
                onChange={(e) => setSimHideMenu(e.target.checked)}
              />
              Sembunyikan bar menu Display (lebih mirip TV)
            </label>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <NeoButton
              onClick={() => window.open(simPreviewUrl, "_blank", "noopener,noreferrer")}
            >
              Buka /display (tab baru)
            </NeoButton>
            <a
              href={simPreviewUrl}
              className="inline-flex items-center text-sm font-bold underline"
            >
              {simPreviewUrl}
            </a>
          </div>
          <div className="mt-4">
            <p className="mb-1 text-xs font-bold uppercase text-zinc-600 dark:text-zinc-400">
              Pratinjau di halaman ini
            </p>
            <iframe
              title="Pratinjau mode kritis sebelum adzan"
              className="h-[min(70vh,560px)] w-full rounded-xl border-4 border-black dark:border-zinc-300"
              src={simPreviewUrl}
            />
          </div>
        </NeoCard>
        <NeoCard className="bg-sky-100 dark:bg-sky-950/30 lg:col-span-2">
          <h2 className="text-lg font-black uppercase">Unggah gambar lokal</h2>
          <p className="mb-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Disimpan di browser (data URL) — maks. ±1,5MB per file. Tampil di slideshow
            /display. Klik baris bawah untuk hapus.
          </p>
          <input
            type="file"
            accept="image/*"
            className="mb-2 w-full text-sm font-bold"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) {
                return;
              }
              if (!f.type.startsWith("image/")) {
                return;
              }
              const max = 1.5 * 1024 * 1024;
              if (f.size > max) {
                window.alert("Berkas terlalu besar (maks. 1,5MB).");
                e.target.value = "";
                return;
              }
              try {
                const url = await readFileAsDataUrl(f);
                const id =
                  typeof crypto !== "undefined" && "randomUUID" in crypto
                    ? crypto.randomUUID()
                    : `up-${Date.now()}`;
                patchConfig({
                  mediaPlaylist: [
                    ...config.mediaPlaylist,
                    {
                      id,
                      type: "image" as const,
                      url,
                      durationSec: 8,
                      title: f.name,
                    },
                  ],
                });
              } catch {
                window.alert("Gagal memproses gambar.");
              }
              e.target.value = "";
            }}
          />
          <ul className="mt-2 space-y-1">
            {uploadedLocal.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center justify-between gap-2 border-2 border-black/20 bg-white/50 px-2 py-1 font-mono text-xs dark:border-zinc-500 dark:bg-slate-800/40"
                >
                  <span className="truncate">{it.title ?? it.id}</span>
                  <NeoButton
                    variant="danger"
                    className="shrink-0 px-2 py-1 text-xs"
                    onClick={() =>
                      patchConfig({
                        mediaPlaylist: config.mediaPlaylist.filter(
                          (x) => x.id !== it.id
                        ),
                      })
                    }
                  >
                    Hapus
                  </NeoButton>
                </li>
              ))}
            {uploadedLocal.length === 0 ? (
              <li className="text-sm font-bold text-zinc-600 dark:text-zinc-400">
                Belum ada gambar unggahan.
              </li>
            ) : null}
          </ul>
        </NeoCard>
        <NeoCard className="bg-yellow-100 dark:bg-amber-950/20 lg:col-span-2">
          <h2 className="text-lg font-black uppercase">JSON lanjutan</h2>
          <p className="mb-2 text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Sunting playlist (gambar, video). Contoh:{" "}
            <a
              className="underline"
              href="https://api.myquran.com/v1/sholat/kota/semua"
              target="_blank"
              rel="noreferrer"
            >
              daftar ID kota
            </a>
            .
          </p>
          <textarea
            className="h-64 w-full rounded-lg border-2 border-black p-2 font-mono text-xs dark:border-zinc-200 dark:bg-slate-800"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
          {err ? <p className="mt-1 text-sm font-bold text-red-700">{err}</p> : null}
          <div className="mt-2 flex flex-wrap gap-2">
            <NeoButton onClick={applyJson}>Terapkan JSON</NeoButton>
            <NeoButton
              variant="secondary"
              onClick={() => {
                setRaw(JSON.stringify(config, null, 2));
                setErr(null);
              }}
            >
              Muat ulang dari simpanan
            </NeoButton>
            <NeoButton variant="secondary" onClick={exportFile}>
              Ekspor
            </NeoButton>
            <NeoButton
              variant="danger"
              onClick={() => {
                setConfig({ ...defaultMasjidConfig });
                setRaw(JSON.stringify(defaultMasjidConfig, null, 2));
              }}
            >
              Reset ke default
            </NeoButton>
          </div>
        </NeoCard>
      </div>
    </PageShell>
  );
}
