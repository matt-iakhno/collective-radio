import { useEffect, useRef, useState } from "react";

import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";
import { useEpisodes } from "@/contexts";

import styles from "./player.module.css";

const Player = () => {
  const { selectedEpisode } = useEpisodes();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLInputElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // show player when user has scrolled an appropriate amount
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const bottomThreshold =
        selectedEpisode !== null
          ? window.innerHeight + 60
          : document.documentElement.offsetHeight - 300;

      if (scrollPosition >= bottomThreshold) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // set URL state whenever episode changes
  // useEffect(() => {
  //   if (selectedEpisode) {
  //     const params = new URLSearchParams(window.location.search);
  //     params.set("episode", selectedEpisode.episodeNum.toString());

  //     window.history.replaceState(
  //       {},
  //       "",
  //       `${window.location.pathname}?${params.toString()}`
  //     );
  //   }
  // }, [selectedEpisode]);

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
