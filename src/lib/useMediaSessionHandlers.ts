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