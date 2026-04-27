type EmbedOpt = { autoplay?: boolean };

/**
 * mengonversi URL YouTube (watch / short / youtu) menjadi URL embed; opsi autoplay+mute.
 */
export function toYoutubeEmbedUrl(
  input: string,
  opts: EmbedOpt = {}
): string {
  const t = input.trim();
  const base = (() => {
    if (t.includes("youtube.com/embed/")) {
      return t;
    }
    const u = (() => {
      try {
        return new URL(t);
      } catch {
        return null;
      }
    })();
    if (!u) {
      return t;
    }
    const v = u.searchParams.get("v");
    if (u.hostname.includes("youtu.be") && u.pathname.length > 1) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    if (v) {
      return `https://www.youtube.com/embed/${v}`;
    }
    return t;
  })();
  if (!base.startsWith("http")) {
    return base;
  }
  const out = new URL(base);
  if (opts.autoplay) {
    out.searchParams.set("autoplay", "1");
    out.searchParams.set("mute", "1");
    out.searchParams.set("playsinline", "1");
    if (!out.searchParams.get("modestbranding")) {
      out.searchParams.set("modestbranding", "1");
    }
  }
  return out.toString();
}
