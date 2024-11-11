import { useEffect, useRef, useState } from "react";

import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";
import { useEpisodes } from "@/contexts";

import styles from "./player.module.css";

const Player = () => {
  // const episodes = useEpisodes();
  const { selectedEpisode } = useEpisodes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // show player when user has scrolled past the Episode selector
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomThreshold = document.documentElement.offsetHeight - 300;

      if (scrollPosition >= bottomThreshold) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // show player if there is a selected episode
  useEffect(() => {
    if (selectedEpisode) {
      setIsVisible(true);
    }
  }, [selectedEpisode]);

  // const handlePlay = () => {
  //   audioRef.current?.play();
  // };

  // const handlePause = () => {
  //   audioRef.current?.pause();
  // };

  // const handleSeek = () => {
  //   audioRef.current?.setCurrentTime(30); // Seeks to 30 seconds
  // };

  return (
    <div
      className={`${styles.playerContainer} ${isVisible ? styles.visible : ""}`}
    >
      <TrackInfo />
      <div className={styles.playerControls}>
        <Controls audioRef={audioRef} progressBarRef={progressBarRef} />
        <ProgressBar audioRef={audioRef} progressBarRef={progressBarRef} />
      </div>
      <div className={styles.volumeControl}>
        <VolumeControl audioRef={audioRef} />
      </div>
    </div>
  );
};

export default Player;
