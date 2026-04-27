import { motion } from "framer-motion";

import { NeoCard } from "@/components/neo/neo-card";
import type { JadwalRow, UiPrayerId } from "@/types/masjidos";
import { labelPrayer, ORDER } from "@/utils/prayer-logic";

type Props = {
  row: JadwalRow;
  activeId: UiPrayerId | null;
  nextId: UiPrayerId;
};

const keys: UiPrayerId[] = [...ORDER];

/**
 * ggrid 5 waktu: menonjolkan waktu aktif & berikut.
 */
export function PrayerTimeGrid({ row, activeId, nextId }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {keys.map((id) => {
        const time = row[id];
        const isNext = id === nextId;
        const isAct = activeId === id;
        return (
          <motion.div
            key={id}
            layout
            className="h-full"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <NeoCard
              as="section"
              className={
                isNext
                  ? "ring-4 ring-fuchsia-500 dark:ring-fuchsia-400"
                : isAct
                  ? "ring-2 ring-sky-600 dark:ring-sky-400"
                  : ""
              }
            >
              <p className="text-sm font-extrabold uppercase tracking-wider">
                {labelPrayer(id)}
                {isNext ? (
                  <span className="ml-1 rounded border border-black bg-fuchsia-300 px-1 text-xs dark:border-white dark:bg-fuchsia-500">
                    berikut
                  </span>
                ) : null}
                {isAct && !isNext ? (
                  <span className="ml-1 rounded border border-black bg-sky-300 px-1 text-xs dark:border-white dark:bg-sky-500">
                    aktif
                  </span>
                ) : null}
              </p>
              <p className="mt-2 font-display text-4xl font-black tabular-nums text-black dark:text-white">
                {time}
              </p>
            </NeoCard>
          </motion.div>
        );
      })}
    </div>
  );
}
