import { RefObject } from "react";
import { usePlayer } from "@/contexts";
import styles from "./player.module.css";
import { formatSecondsToHHMMSS } from "@/lib/convertToHHMMSS";

interface ProgressBarProps {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
}

const ProgressBar = ({ audioRef, progressBarRef }: ProgressBarProps) => {
  const { timeProgress, duration } = usePlayer();

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${newTime}%`
      );
    }
  };

  if ("mediaSession" in navigator && duration && timeProgress) {
    navigator.mediaSession.setPositionState({
      duration,
      playbackRate: 1.0,
      position: timeProgress,
    });
  }

  const displayDuration = duration ? formatSecondsToHHMMSS(duration) : "--:--";

  return (
    <div className={styles.progressBarContainer}>
      <span>
        {timeProgress ? formatSecondsToHHMMSS(timeProgress) : "--:--"}
      </span>
      <input
        className={styles.progressBar}
        type="range"
        ref={progressBarRef}
        onChange={handleProgressChange}
      />
      <span>{displayDuration}</span>
    </div>
  );
};

export default ProgressBar;
