import { toYoutubeEmbedUrl } from "@/utils/youtube-embed";

type Props = { src: string; title?: string; autoplay?: boolean };

/**
 * iframe YouTube 16/9; autoplay memutar bisu (wajib agar kebijakan browser mengizinkan).
 */
export function YoutubeEmbedFrame({
  src,
  title = "Livestream",
  autoplay = true,
}: Props) {
  const url = toYoutubeEmbedUrl(src, { autoplay });
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border-[3px] border-black shadow-neo dark:border-zinc-100">
      <iframe
        className="absolute left-0 top-0 h-full w-full"
        src={url}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
