"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { NeoCard } from "@/components/neo/neo-card";
import type { MediaItem } from "@/types/masjidos";

type Props = {
  items: MediaItem[];
  defaultSlideSec: number;
};

/**
 * putar image/poster video bergantian — durasi per item.
 */
export function MediaSlideshow({ items, defaultSlideSec }: Props) {
  const [i, setI] = useState(0);
  const list = useMemo(
    () => (items.length ? items : []),
    [items]
  );
  const cur = list[i % (list.length || 1)];

  useEffect(() => {
    if (!list.length) {
      return;
    }
    const dur = (() => {
      if (cur.type === "image" || cur.type === "poster") {
        return (cur.durationSec || defaultSlideSec) * 1000;
      }
      return (defaultSlideSec * 2) * 1000;
    })();
    const t = setTimeout(() => setI((n) => n + 1), Math.max(3000, dur));
    return () => clearTimeout(t);
  }, [cur, list, defaultSlideSec, i]);

  if (!list.length) {
    return (
      <NeoCard className="flex min-h-[220px] items-center justify-center bg-zinc-200 dark:bg-zinc-700">
        <p className="font-bold">Tambahkan media di Admin</p>
      </NeoCard>
    );
  }

  if (cur.type === "video") {
    return (
      <NeoCard className="overflow-hidden p-0">
        <video
          className="h-full max-h-[min(50vh,420px)] w-full bg-black object-contain"
          src={cur.url}
          autoPlay
          muted
          playsInline
          loop
        />
        {cur.title ? (
          <p className="p-2 text-center text-sm font-bold">{cur.title}</p>
        ) : null}
      </NeoCard>
    );
  }

  const src = cur.type === "poster" ? cur.imageUrl : cur.url;
  if (src.startsWith("data:")) {
    return (
      <NeoCard className="overflow-hidden p-0">
        {/* gambar unggahan lokal (data URL) — tanpa next/image */}
        <div className="flex min-h-[min(50vh,420px)] w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
          {/* data URL tidak memakai next/image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={cur.title ?? "Slide"}
            className="max-h-[min(50vh,420px)] w-full object-contain"
          />
        </div>
        {cur.title ? (
          <p className="p-2 text-center text-sm font-bold">{cur.title}</p>
        ) : null}
      </NeoCard>
    );
  }
  return (
    <NeoCard className="overflow-hidden p-0">
      <div className="relative h-[min(50vh,420px)] w-full">
        <Image
          src={src}
          alt={cur.title ?? "Slide"}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 800px"
          unoptimized
        />
      </div>
      {cur.title ? (
        <p className="p-2 text-center text-sm font-bold">{cur.title}</p>
      ) : null}
    </NeoCard>
  );
}
