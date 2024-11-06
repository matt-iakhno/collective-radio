import { useEffect, useState } from "react";
import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";

import styles from "./player2.module.css";

// import { isMobileDevice } from "@/lib";

// const DEFAULT_VOLUME = isMobileDevice() ? 1.0 : 0.5;

function Player() {
  // const episodes = useEpisodes();
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

  return (
    <div
      className={`${styles.playerContainer} ${isVisible ? styles.visible : ""}`}
    >
      <TrackInfo />
      <div className={styles.playerControls}>
        <Controls />
        <ProgressBar />
      </div>
      <div className={styles.volumeControl}>
        <VolumeControl />
      </div>
    </div>
  );
}

export default Player;
