import { type ReactNode } from "react";

/**
 * lebar maks + padding untuk halaman dashboard biasa.
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-4 py-6 sm:px-6">
      {children}
    </div>
  );
}
