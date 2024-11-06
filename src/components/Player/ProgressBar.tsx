import { usePlayer } from "@/contexts";
import styles from "./player2.module.css";
import { useEffect, useState } from "react";

function ProgressBar() {
  const {
    setProgressBarRef,
    progressBarRef,
    audioRef,
    timeProgress,
    duration,
  } = usePlayer();

  const [count, setCount] = useState<number>(0);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((prev: number) => prev + 1); // This triggers a re-render after 3 seconds
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  console.log(count);

  const timeProgressDisplay = timeProgress ? timeProgress : "00:00";
  const durationDisplay = duration ? duration : "--:--";

  const handleProgressChange = () => {
    console.log("audioRef.current", audioRef.current);
    if (audioRef.current && progressBarRef.current) {
      const newTime = Number(progressBarRef.current.value);
      audioRef.current.currentTime = newTime;
      console.log("should update progress bar", newTime);
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${newTime}%`
      );
    } else {
      console.log("something not found in ProgrssBar.handleProgressChange()");
    }
  };

  console.log(duration);

  return (
    <div className={styles.progressBarContainer}>
      <span>{timeProgressDisplay}</span>
      <input
        className={styles.progressBar}
        type="range"
        ref={(element) => {
          console.log("progressbar setref", element);
          if (element) setProgressBarRef(element);
        }}
        onChange={handleProgressChange}
      />
      <span>{durationDisplay}</span>
    </div>
  );
}

export default ProgressBar;
