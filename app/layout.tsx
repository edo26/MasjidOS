import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { Providers } from "./providers";
import "./globals.css";

const dm = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-dm-sans",
  display: "swap",
});

/**
 * root layout: font + theme provider.
 */
export const metadata: Metadata = {
  title: "MasjidOS — Sistem Informasi Masjid",
  description:
    "Jadwal shalat, hitung mundur, dan tampilan media untuk masjid (WIB, open source).",
  openGraph: { title: "MasjidOS", description: "Mosque Information System" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${dm.variable} min-h-dvh font-display`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
