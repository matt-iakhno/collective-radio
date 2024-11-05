import { useEffect } from "react";
import { useEpisodes, usePlayer } from "@/contexts";

import {
  LuPause,
  LuPlay,
  // LuVolumeX,
  // LuVolume1,
} from "react-icons/lu";

import styles from "./player2.module.css";

function Controls() {
  const { selectedEpisode } = useEpisodes();
  const { isPlaying, togglePlay, audioRef, progressBarRef, setDuration } =
    usePlayer();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, audioRef]);

  if (!selectedEpisode) return <></>;

  const handleOnPlay = () => {
    togglePlay();
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      console.log("Should update setDuration", typeof setDuration);
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={() => handleOnPlay()}>
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
}

export default Controls;
