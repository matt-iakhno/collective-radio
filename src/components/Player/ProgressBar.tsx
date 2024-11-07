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
      if ("mediaSession" in navigator && duration) {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: 1.0,
          position: newTime,
        });
      }
    }
  };

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
      <span>{duration ? formatSecondsToHHMMSS(duration) : "--:--"}</span>
    </div>
  );
};

export default ProgressBar;
