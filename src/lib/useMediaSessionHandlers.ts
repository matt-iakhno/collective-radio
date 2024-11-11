import { useEffect, RefObject } from "react";

export const useMediaSessionHandlers = (audioRef: RefObject<HTMLAudioElement>) => {
  useEffect(() => {
    if ("mediaSession" in navigator) {
      // Set the play action handler
      navigator.mediaSession.setActionHandler("play", () => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      });

      // Set the pause action handler
      navigator.mediaSession.setActionHandler("pause", () => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      });

      // Optional seekbackward handler with type checking
      navigator.mediaSession.setActionHandler("seekbackward", (details: MediaSessionActionDetails) => {
        if (audioRef.current) {
          const skipTime = details.seekOffset || 10; // default to 10 seconds if seekOffset is not provided
          audioRef.current.currentTime = Math.max(audioRef.current.currentTime - skipTime, 0);
        }
      });

      // Optional seekforward handler with type checking
      navigator.mediaSession.setActionHandler("seekforward", (details: MediaSessionActionDetails) => {
        if (audioRef.current) {
          const skipTime = details.seekOffset || 10;
          audioRef.current.currentTime = Math.min(audioRef.current.currentTime + skipTime, audioRef.current.duration);
        }
      });
    }

    // Cleanup the handlers when component unmounts
    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.setActionHandler("play", null);
        navigator.mediaSession.setActionHandler("pause", null);
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
      }
    };
  }, [audioRef]);
};