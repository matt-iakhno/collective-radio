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
  const updateProgress = useCallback(() => {
    if (!audioRef.current || !progressBarRef.current || !duration) return;

    const currentTime = audioRef.current.currentTime;
    setTimeProgress(currentTime);

    progressBarRef.current.value = currentTime.toString();
    progressBarRef.current.style.setProperty(
      "--range-progress",
      `${(currentTime / duration) * 100}%`
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, setTimeProgress]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        if (playAnimationRef.current !== null) {
          cancelAnimationFrame(playAnimationRef.current);
        }
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  const playAnimationRef = useRef<number | null>(null);
  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  // record a play event every time new episode is slected and playback begins for the first time
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlayOnce = () => {
      if (window.umami) {
        window.umami.track("play", {
          episodeNum: selectedEpisode?.episodeNum,
        });
      }
      audioElement.removeEventListener("play", handlePlayOnce);
    };

    // Attach the one-time event listener when the source changes
    audioElement.addEventListener("play", handlePlayOnce);

    // Cleanup in case the component unmounts or the src changes
    return () => {
      audioElement.removeEventListener("play", handlePlayOnce);
    };
  }, [selectedEpisode?.episodeNum, audioRef]);

  // hook for Media Session handlers for play/pause/scrubbing events on Mobile
  useMediaSessionHandlers(audioRef);

  const handleOnPlay = () => {
    if (!selectedEpisode) return;
    togglePlay();
  };

  const onLoadedMetadata = () => {
    const duration = audioRef.current?.duration;
    if (duration !== undefined && isFinite(duration) && duration > 0) {
      setDuration(duration);
      if (progressBarRef.current) {
        progressBarRef.current.max = duration.toString();

        // bring back progress from state
        if (timeProgress) {
          requestAnimationFrame(() => {
            audioRef.current!.currentTime = timeProgress;
            progressBarRef.current!.value = timeProgress.toString();
          });
          progressBarRef.current.style.setProperty(
            "--range-progress",
            `${(timeProgress / duration) * 100}%`
          );
        }
      }
    }
  };

  // Sync media session position/duration via audio element events.
  // This is more reliable than syncing via React state because it reacts
  // to the audio element's actual state (especially important for VBR audio
  // where the browser corrects duration as it downloads more data).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !("mediaSession" in navigator)) return;

    let lastPositionSync = 0;

    const syncPositionState = (force = false) => {
      const { duration: dur, currentTime, playbackRate } = audio;
      if (!isFinite(dur) || dur <= 0) return;

      const now = Date.now();
      if (!force && now - lastPositionSync < 1000) return;
      lastPositionSync = now;

      try {
        navigator.mediaSession.setPositionState({
          duration: dur,
          playbackRate: playbackRate || 1.0,
          position: Math.min(Math.max(0, currentTime), dur),
        });
      } catch {
        // Ignore errors from invalid state
      }
    };

    const handleTimeUpdate = () => syncPositionState();

    const handleDurationChange = () => {
      const dur = audio.duration;
      if (isFinite(dur) && dur > 0) {
        setDuration(dur);
        if (progressBarRef.current) {
          progressBarRef.current.max = dur.toString();
        }
        syncPositionState(true);
      }
    };

    const handleSeeked = () => syncPositionState(true);

    const handlePlay = () => {
      navigator.mediaSession.playbackState = "playing";
      syncPositionState(true);
    };

    const handlePause = () => {
      navigator.mediaSession.playbackState = "paused";
      syncPositionState(true);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("seeked", handleSeeked);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    // Sync current state in case events already fired before this effect ran
    handleDurationChange();

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("seeked", handleSeeked);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef, progressBarRef, setDuration]);

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode?.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button
        className={`${styles.playIcon} ${selectedEpisode !== null ? styles.playActive : styles.playInactive
          }`}
        onClick={() => handleOnPlay()}
      >
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
};

export default Controls;
