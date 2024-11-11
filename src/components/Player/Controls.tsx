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
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );

      if ("mediaSession" in navigator && duration) {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1.0,
          position: currentTime,
        });
      }
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
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
        console.log("Umami track selected");
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
    if (duration !== undefined) {
      setDuration(duration);
      if (progressBarRef.current) {
        progressBarRef.current.max = duration.toString();

        // bring back progress from state
        if (timeProgress) {
          if (audioRef.current) audioRef.current.currentTime = timeProgress;
          progressBarRef.current.value = timeProgress.toString();
          progressBarRef.current.style.setProperty(
            "--range-progress",
            `${(timeProgress / duration) * 100}%`
          );
        }
      }
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode?.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button className={styles.playIcon} onClick={() => handleOnPlay()}>
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
};

export default Controls;
