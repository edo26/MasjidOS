"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * mengelola mode layar penuh (kiosk) dengan toggle aman bila didukung browser.
 */
export function useFullscreen(): [boolean, () => void] {
  const [on, setOn] = useState(false);

  const sync = useCallback(() => {
    setOn(Boolean(document.fullscreenElement));
  }, []);

  useEffect(() => {
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, [sync]);

  const toggle = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
    } else {
      void document.exitFullscreen();
    }
  }, []);

  return [on, toggle];
}
