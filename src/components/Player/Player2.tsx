import Controls from "./Controls";
import ProgressBar from "./ProgressBar";
import TrackInfo from "./TrackInfo";
import VolumeControl from "./VolumeControl";

import styles from "./player2.module.css";

// import { isMobileDevice } from "@/lib";

// const DEFAULT_VOLUME = isMobileDevice() ? 1.0 : 0.5;

function Player() {
  // const episodes = useEpisodes();

  return (
    <div className={styles.playerContainer}>
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
