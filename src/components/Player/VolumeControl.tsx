import { ChangeEvent, RefObject, useEffect, useState } from "react";

import { LuVolume, LuVolumeX, LuVolume1, LuVolume2 } from "react-icons/lu";

import styles from "./player.module.css";

import { isMobileDevice } from "@/lib";

const DEFAULT_VOLUME = isMobileDevice() ? 100 : 50;

interface VolumeControlsProps {
  audioRef: RefObject<HTMLAudioElement>;
}
const VolumeControls = ({ audioRef }: VolumeControlsProps) => {
  const [volume, setVolume] = useState<number>(DEFAULT_VOLUME);
  const [muteVolume, setMuteVolume] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value));
  };

  return (
    <div className={styles.volumeContainer}>
      <button
        className={styles.volumeIcon}
        onClick={() => setMuteVolume((prev) => !prev)}
      >
        {muteVolume ? (
          <LuVolumeX size={25} />
        ) : volume < 20 ? (
          <LuVolume size={25} />
        ) : volume < 40 ? (
          <LuVolume1 size={25} />
        ) : (
          <LuVolume2 size={25} />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        value={volume}
        className={styles.volumeBar}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControls;
