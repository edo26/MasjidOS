import Link from "next/link";
import { type ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { NeoButton } from "@/components/neo/neo-button";

type Props = { title: string; right?: ReactNode; subtitle?: string };

/**
 * header situs: nav mode display & admin, slot kanan.
 */
export function SiteHeader({ title, subtitle, right }: Props) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b-4 border-black pb-4 dark:border-zinc-100 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-4xl font-black tracking-tight sm:text-5xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 max-w-2xl text-sm font-bold text-zinc-700 dark:text-zinc-300">
            {subtitle}
          </p>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {right}
        <Link href="/">
          <NeoButton variant="secondary">Home</NeoButton>
        </Link>
        <Link href="/display">
          <NeoButton>TV / Display</NeoButton>
        </Link>
        <Link href="/admin">
          <NeoButton variant="secondary">Admin</NeoButton>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
