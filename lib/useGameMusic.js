import { useEffect, useRef } from "react";

export function useGameMusic(active, muted) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!active) return;

    const audio = new Audio("/game-music.mp3");
    audio.loop = true;
    audio.volume = muted ? 0 : 0.12;
    audioRef.current = audio;

    audio.play().catch(() => {
      // Browser blocked autoplay — user can unmute to trigger play
    });

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [active]); // eslint-disable-line

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : 0.12;
    if (!muted && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    }
  }, [muted]);
}
