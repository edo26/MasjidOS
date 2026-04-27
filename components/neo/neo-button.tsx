import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
};

const v: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "bg-yellow-300 hover:bg-yellow-200 dark:bg-yellow-400 dark:hover:bg-yellow-300",
  secondary:
    "bg-cyan-300 hover:bg-cyan-200 dark:bg-cyan-500 dark:hover:bg-cyan-400",
  danger: "bg-red-400 hover:bg-red-300 dark:bg-red-500 dark:hover:bg-red-400",
};

/**
 * tombol neubrutalism: solid + shadow.
 */
export function NeoButton({
  className = "",
  variant = "primary",
  children,
  ...r
}: Props) {
  return (
    <button
      type="button"
      className={`rounded-xl border-2 border-black px-4 py-2 font-bold shadow-neo active:translate-x-px active:translate-y-px active:shadow-none ${v[variant]} ${className}`}
      {...r}
    >
      {children}
    </button>
  );
}
