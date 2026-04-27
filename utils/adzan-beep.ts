let ctx: AudioContext | null = null;

/**
 * memutar nada beep singkat (oscillator) untuk peringatan adzan — hormati volume perangkat.
 */
export function playAdzanBeep(): void {
  if (typeof window === "undefined" || !window.AudioContext) {
    return;
  }
  if (!ctx) {
    ctx = new AudioContext();
  }
  const c = ctx;
  if (c.state === "suspended") {
    void c.resume();
  }
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.frequency.value = 880;
  osc.type = "sine";
  g.gain.value = 0.12;
  osc.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  osc.start(now);
  osc.stop(now + 0.2);
  window.setTimeout(() => {
    try {
      osc.disconnect();
      g.disconnect();
    } catch {
      /* noop */
    }
  }, 300);
}
