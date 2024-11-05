import { useEpisodes } from "@/contexts";

import styles from "./player2.module.css";

function TrackInfo() {
  const { selectedEpisode } = useEpisodes();

  return (
    <div className={styles.currentTrack}>
      <div className={styles.currentTrackCover}>
        <img
          src={selectedEpisode?.coverArt}
          alt={"Collective Radio " + selectedEpisode?.episodeNum + " cover"}
        />
      </div>
      <div>
        <p className={styles.currentTrackName}>
          {"Collective Radio EP" + selectedEpisode?.episodeNum}
        </p>
        <p className="text-sm text-gray-400">
          {selectedEpisode?.artists.join(" & ")}
        </p>
      </div>
    </div>
  );
}

export default TrackInfo;
