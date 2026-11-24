import { useEffect, RefObject } from "react";

// Lock-screen / notification controls. Handlers act on the audio element
// directly; its play/pause events keep app state in sync (see Controls), so
// nothing here reads React state and the handlers never go stale.
export const useMediaSessionHandlers = (
  audioRef: RefObject<HTMLAudioElement>
) => {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => audioRef.current?.play()],
      ["pause", () => audioRef.current?.pause()],
      [
        "seekbackward",
        (details) => {
          const audio = audioRef.current;
          if (!audio) return;
          const skip = details.seekOffset ?? 10;
          audio.currentTime = Math.max(0, audio.currentTime - skip);
        },
      ],
      [
        "seekforward",
        (details) => {
          const audio = audioRef.current;
          if (!audio) return;
          const skip = details.seekOffset ?? 10;
          audio.currentTime = Math.min(audio.duration, audio.currentTime + skip);
        },
      ],
      [
        "seekto",
        (details) => {
          const audio = audioRef.current;
          if (!audio || details.seekTime === undefined) return;
          if (details.fastSeek && "fastSeek" in audio) {
            audio.fastSeek(details.seekTime);
          } else {
            audio.currentTime = details.seekTime;
          }
        },
      ],
    ];

    for (const [action, handler] of handlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // action not supported by this browser
      }
    }

    return () => {
      for (const [action] of handlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // action not supported by this browser
        }
      }
    };
  }, [audioRef]);
};
