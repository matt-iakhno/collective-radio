import { useEffect, RefObject } from "react";
import { usePlayer } from "@/contexts";

export const useMediaSessionHandlers = (audioRef: RefObject<HTMLAudioElement>) => {
  const {
    togglePlay,
  } = usePlayer();
  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Set the play action handler
      navigator.mediaSession.setActionHandler("play", () => {
        if (audioRef.current && audioRef.current.paused) {
          togglePlay();
        }
      });

      // Set the pause action handler
      navigator.mediaSession.setActionHandler("pause", () => {
        if (audioRef.current && !audioRef.current.paused) {
          togglePlay();
        }
      });

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        const audio = audioRef.current;
        if (!audio) return;

        const skip = details.seekOffset ?? 10;
        const targetTime = Math.max(0, audio.currentTime - skip);

        // Use fastSeek if available for smooth jumps
        if ("fastSeek" in audio) {
          (audio as any).fastSeek(targetTime);
        }

        if ("setPositionState" in navigator.mediaSession) {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            position: targetTime,
            playbackRate: audio.playbackRate,
          });
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        const audio = audioRef.current;
        if (!audio) return;

        const skip = details.seekOffset ?? 10; // default 10s
        const targetTime = Math.min(audio.duration, audio.currentTime + skip);

        if ("fastSeek" in audio) {
          (audio as any).fastSeek(targetTime);
        }

        if ("setPositionState" in navigator.mediaSession) {
          navigator.mediaSession.setPositionState({
            duration: audio.duration,
            position: targetTime,
            playbackRate: audio.playbackRate,
          });
        }
      });

      navigator.mediaSession.setActionHandler("seekto", (details) => {
        if (audioRef.current) {
          if (details.fastSeek && "fastSeek" in audioRef.current) {
            (audioRef.current as any).fastSeek(details.seekTime);
          } else {
            audioRef.current.currentTime = details.seekTime ?? audioRef.current.currentTime;
          }
        }
      });
    }

    // Cleanup the handlers when component unmounts
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
      }
    };
  }, [audioRef, togglePlay]);
};