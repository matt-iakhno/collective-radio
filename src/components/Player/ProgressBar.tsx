import { RefObject, useEffect, useState } from "react";
import { usePlayer } from "@/contexts";
import { formatSecondsToHHMMSS } from "@/lib";

import styles from "./player.module.css";

interface ProgressBarProps {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
}

const setBarFill = (bar: HTMLInputElement, time: number, duration: number) => {
  const percent =
    Number.isFinite(duration) && duration > 0 ? (time / duration) * 100 : 0;
  bar.style.setProperty("--range-progress", `${percent}%`);
};

const ProgressBar = ({ audioRef, progressBarRef }: ProgressBarProps) => {
  const { timeProgress, duration } = usePlayer();
  // whole seconds, so this component re-renders at most once per second
  const [currentSecond, setCurrentSecond] = useState<number | null>(
    timeProgress ? Math.floor(timeProgress) : null
  );

  // driven by the audio element's own events instead of a per-frame loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const sync = () => {
      // nothing to draw while hidden; we resync on visibilitychange
      if (document.visibilityState === "hidden") return;
      if (audio.readyState < HTMLMediaElement.HAVE_METADATA) return;
      const time = audio.currentTime;
      setCurrentSecond(Math.floor(time));
      const bar = progressBarRef.current;
      if (bar) {
        bar.value = time.toString();
        setBarFill(bar, time, audio.duration);
      }
    };

    // new src loading: clear the previous episode's position
    const reset = () => {
      setCurrentSecond(null);
      const bar = progressBarRef.current;
      if (bar) {
        bar.value = "0";
        setBarFill(bar, 0, 0);
      }
    };

    const syncEvents = ["timeupdate", "seeked", "loadedmetadata"];
    syncEvents.forEach((e) => audio.addEventListener(e, sync));
    audio.addEventListener("emptied", reset);
    document.addEventListener("visibilitychange", sync);

    return () => {
      syncEvents.forEach((e) => audio.removeEventListener(e, sync));
      audio.removeEventListener("emptied", reset);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [audioRef, progressBarRef]);

  const handleProgressChange = () => {
    const audio = audioRef.current;
    const bar = progressBarRef.current;
    if (audio && bar) {
      const newTime = Number(bar.value);
      audio.currentTime = newTime;
      setBarFill(bar, newTime, audio.duration);
    }
  };

  return (
    <div className={styles.progressBarContainer}>
      <span>
        {currentSecond ? formatSecondsToHHMMSS(currentSecond) : "--:--"}
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
