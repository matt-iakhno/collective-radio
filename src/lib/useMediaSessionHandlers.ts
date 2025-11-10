import { useEffect, RefObject } from "react";
import { usePlayer } from "@/contexts";

export const useMediaSessionHandlers = (audioRef: RefObject<HTMLAudioElement>) => {
  const {
    isPlaying,
    togglePlay,
  } = usePlayer();
  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Set the play action handler
      navigator.mediaSession.setActionHandler("play", () => {
        if (audioRef.current && !isPlaying) {
          togglePlay();
        }
      });

      // Set the pause action handler
      navigator.mediaSession.setActionHandler("pause", () => {
        if (audioRef.current && isPlaying) {
          togglePlay();
        }
      });

      navigator.mediaSession.setActionHandler("seekbackward", (details) => {
        if (audioRef.current) {
          const skip = details.seekOffset ?? 10;
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - skip);
        }
      });

      navigator.mediaSession.setActionHandler("seekforward", (details) => {
        if (audioRef.current) {
          const skip = details.seekOffset ?? 10;
          audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + skip);
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
  }, [audioRef, isPlaying, togglePlay]);
};