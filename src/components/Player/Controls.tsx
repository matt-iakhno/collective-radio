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
  const {
    isPlaying,
    togglePlay,
    audioRef,
    setAudioRef,
    progressBarRef,
    setDuration,
  } = usePlayer();

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, audioRef]);

  const handleOnPlay = () => {
    togglePlay();
  };

  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        console.log("update progressBarRef max value");
        progressBarRef.current.max = seconds.toString();
      } else {
        console.log(
          "no progressBarRef.current found",
          progressBarRef,
          audioRef
        );
      }
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode?.url}
        ref={(element) => element && setAudioRef(element)}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={() => handleOnPlay()}>
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
}

export default Controls;
