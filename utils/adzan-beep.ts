let ctx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined" || !window.AudioContext) {
    return null;
  }
  if (!ctx) {
    ctx = new AudioContext();
  }
  const c = ctx;
  if (c.state === "suspended") {
    void c.resume();
  }
  return c;
}

/**
 * memutar nada beep singkat (oscillator) untuk peringatan adzan — hormati volume perangkat.
 */
export function playAdzanBeep(): void {
  const c = getAudioContext();
  if (!c) return;

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

/**
 * beep panjang saat waktu adzan tiba (±1–2 dtk), lalu mode tampilan kembali normal.
 */
export function playAdzanArrivedBeep(durationSec = 1.6): void {
  const c = getAudioContext();
  if (!c) return;

  const dur = Math.min(2, Math.max(1, durationSec));
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.frequency.value = 740;
  osc.type = "sine";
  osc.connect(g);
  g.connect(c.destination);

  const now = c.currentTime;
  const peak = 0.2;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(peak, now + 0.04);
  g.gain.setValueAtTime(peak, now + dur - 0.18);
  g.gain.linearRampToValueAtTime(0, now + dur);

  osc.start(now);
  osc.stop(now + dur + 0.06);

  window.setTimeout(() => {
    try {
      osc.disconnect();
      g.disconnect();
    } catch {
      /* noop */
    }
  }, Math.ceil(dur * 1000) + 80);
}
