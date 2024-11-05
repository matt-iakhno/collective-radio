import { usePlayer } from "@/contexts";
import styles from "./player2.module.css";

function ProgressBar() {
  const { audioRef, progressBarRef, timeProgress, duration } = usePlayer();

  const handleProgressChange = () => {
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      console.log("should update progress bar", newTime);
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${newTime}%`
      );
    }
  };

  return (
    <div className={styles.progressBarContainer}>
      <span>{timeProgress}</span>
      <input
        className={styles.progressBar}
        type="range"
        ref={progressBarRef}
        onChange={handleProgressChange}
      />
      <span>{duration}</span>
    </div>
  );
}

export default ProgressBar;
