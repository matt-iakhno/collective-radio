import { useEffect } from "react";
import { useEpisodes, usePlayer } from "@/contexts";

import styles from "./player.module.css";

function TrackInfo() {
  const { selectedEpisode } = useEpisodes();
  const { isPlaying, togglePlay } = usePlayer();

  const defaultArtists = [""];
  // the default cover art is a black square
  const defaultCoverArt =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect width='100%25' height='100%25' fill='black' /%3E%3C/svg%3E";

  const artists = selectedEpisode?.artists.join(" & ") ?? defaultArtists;
  const coverArt = selectedEpisode?.coverArt ?? defaultCoverArt;
  const episodeText = selectedEpisode?.episodeNum
    ? "Collective Radio EP" + selectedEpisode.episodeNum
    : "";

  useEffect(() => {
    if ("mediaSession" in navigator && selectedEpisode) {
      const { episodeNum, artists, coverArt } = selectedEpisode;
      const episodeName = "Collective Radio EP" + episodeNum;
      const episodeArtists = artists.join(" & ");

      navigator.mediaSession.metadata = new MediaMetadata({
        title: episodeName,
        artist: episodeArtists,
        album: "Collective Radio",
        artwork: [
          {
            src: coverArt,
            sizes: "500x500",
            type: coverArt.startsWith("data:image/svg+xml")
              ? "image/svg+xml"
              : "image/jpeg",
          },
        ],
      });

      navigator.mediaSession.setActionHandler("play", () => {
        if (!isPlaying) togglePlay();
      });
      navigator.mediaSession.setActionHandler("pause", () => {
        if (isPlaying) togglePlay();
        // Add pause logic here
      });
    }

    return () => {
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = null; // Clear metadata
      }
    };
  }, [selectedEpisode]);

  return (
    <div className={styles.currentTrack}>
      <div className={styles.currentTrackCover}>
        <img src={coverArt} alt={`${episodeText} cover`} />
      </div>
      <div>
        <div className={styles.currentTrackName}>{episodeText}</div>
        <div className={styles.currentTrackArtists}>{artists}</div>
      </div>
    </div>
  );
}

export default TrackInfo;
