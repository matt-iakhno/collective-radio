import { useEffect, RefObject, useRef, useCallback } from "react";
import { useEpisodes, usePlayer } from "@/contexts";
import { useMediaSessionHandlers } from "@/lib";

import { LuPause, LuPlay } from "react-icons/lu";

import styles from "./player.module.css";

interface ControlsProps {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
}

const Controls = ({ audioRef, progressBarRef }: ControlsProps) => {
  const { selectedEpisode } = useEpisodes();
  const {
    isPlaying,
    togglePlay,
    duration,
    setDuration,
    timeProgress,
    setTimeProgress,
  } = usePlayer();

  const lastMediaSessionUpdate = useRef(0);

  // Update progress & MediaSession position
  useEffect(() => {
    const audio = audioRef.current;
    const progress = progressBarRef.current;
    if (!audio || !progress || !duration) return;

    const onTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setTimeProgress(currentTime);

      progress.value = currentTime.toString();
      progress.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );

      // Update MediaSession position at most once per second
      if ("mediaSession" in navigator) {
        const now = Date.now();
        if (now - lastMediaSessionUpdate.current > 1000) {
          navigator.mediaSession.setPositionState({
            duration,
            playbackRate: audio.playbackRate ?? 1,
            position: currentTime,
          });
          lastMediaSessionUpdate.current = now;
        }
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    return () => audio.removeEventListener("timeupdate", onTimeUpdate);
  }, [audioRef, progressBarRef, duration, setTimeProgress]);

  // MediaSession handlers (play/pause/seek)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !("mediaSession" in navigator)) return;

    navigator.mediaSession.setActionHandler("play", () => audio.play());
    navigator.mediaSession.setActionHandler("pause", () => audio.pause());

    navigator.mediaSession.setActionHandler("seekbackward", (details) => {
      const skip = details.seekOffset ?? 10;
      audio.currentTime = Math.max(0, audio.currentTime - skip);
    });

    navigator.mediaSession.setActionHandler("seekforward", (details) => {
      const skip = details.seekOffset ?? 10;
      audio.currentTime = Math.min(audio.duration, audio.currentTime + skip);
    });

    navigator.mediaSession.setActionHandler("seekto", (details) => {
      if (details.fastSeek && "fastSeek" in audio) {
        (audio as any).fastSeek(details.seekTime);
      } else {
        audio.currentTime = details.seekTime ?? audio.currentTime;
      }
    });
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play();
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "playing";
    } else {
      audio.pause();
      if ("mediaSession" in navigator)
        navigator.mediaSession.playbackState = "paused";
    }
  }, [isPlaying, audioRef]);

  // Track plays for analytics
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlayOnce = () => {
      if (window.umami) {
        window.umami.track("play", { episodeNum: selectedEpisode?.episodeNum });
      }
      audio.removeEventListener("play", handlePlayOnce);
    };

    audio.addEventListener("play", handlePlayOnce);
    return () => audio.removeEventListener("play", handlePlayOnce);
  }, [selectedEpisode?.episodeNum, audioRef]);

  // metadata load (duration, progress restoration, MediaSession metadata)
  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    const progress = progressBarRef.current;
    if (!audio || !progress) return;

    const dur = audio.duration;
    setDuration(dur);
    progress.max = dur.toString();

    // Restore previous progress
    if (timeProgress) {
      audio.currentTime = timeProgress;
      progress.value = timeProgress.toString();
      progress.style.setProperty(
        "--range-progress",
        `${(timeProgress / dur) * 100}%`
      );
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode?.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button
        className={`${styles.playIcon} ${
          selectedEpisode ? styles.playActive : styles.playInactive
        }`}
        onClick={togglePlay}
      >
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
};

export default Controls;
