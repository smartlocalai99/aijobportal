import { useEffect, useRef } from "react";

// Upbeat C-major pentatonic chiptune loop — [frequency Hz, duration s]
const MELODY = [
  [523.25, 0.18], [659.25, 0.18], [783.99, 0.18], [1046.5, 0.36],
  [880,    0.18], [783.99, 0.18], [659.25, 0.18], [523.25, 0.36],
  [392,    0.18], [523.25, 0.18], [659.25, 0.36], [783.99, 0.18],
  [880,    0.18], [1046.5, 0.18], [880,    0.18], [783.99, 0.36],
  [659.25, 0.18], [523.25, 0.18], [392,    0.18], [523.25, 0.54],
];

const BASS = [
  [130.81, 0.72], [146.83, 0.72], [164.81, 0.72], [174.61, 0.72],
];

export function useGameMusic(active, muted) {
  const masterRef = useRef(null);
  const ctxRef    = useRef(null);
  const stopped   = useRef(false);

  useEffect(() => {
    if (!active) return;
    stopped.current = false;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.16;
    master.connect(ctx.destination);
    masterRef.current = master;

    function scheduleNotes(pattern, type, gainAmt, startTime, onDone) {
      if (stopped.current) return;
      let t = startTime;
      const step = 0.02;
      pattern.forEach(([freq, dur]) => {
        const osc  = ctx.createOscillator();
        const g    = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(gainAmt, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur * 0.82);
        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + dur);
        t += dur + step;
      });
      const total = pattern.reduce((s, [, d]) => s + d + step, 0);
      if (!stopped.current) setTimeout(() => onDone(ctx.currentTime), (total - 0.08) * 1000);
    }

    function loopMelody(t) { scheduleNotes(MELODY, "square",   0.32, t, loopMelody); }
    function loopBass(t)   { scheduleNotes(BASS,   "triangle", 0.48, t, loopBass);   }

    loopMelody(ctx.currentTime + 0.05);
    loopBass(ctx.currentTime + 0.05);

    return () => {
      stopped.current = true;
      masterRef.current = null;
      ctx.close();
    };
  }, [active]); // eslint-disable-line

  // Live mute toggle — just adjust master gain, no restart
  useEffect(() => {
    if (!masterRef.current) return;
    masterRef.current.gain.setTargetAtTime(muted ? 0 : 0.16, ctxRef.current.currentTime, 0.1);
  }, [muted]);
}
