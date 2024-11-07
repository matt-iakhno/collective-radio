import { useEffect, RefObject, useRef, useCallback } from "react";
import { useEpisodes, usePlayer } from "@/contexts";

import { LuPause, LuPlay } from "react-icons/lu";

import styles from "./player.module.css";

interface ControlsProps {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
}

const Controls = ({ audioRef, progressBarRef }: ControlsProps) => {
  const { selectedEpisode } = useEpisodes();
  const { isPlaying, togglePlay, duration, setDuration, setTimeProgress } =
    usePlayer();

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
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

  if (!selectedEpisode) return <div className={styles.placeholder}></div>;

  const handleOnPlay = () => {
    togglePlay();
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode.url}
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
