import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";

import { useEpisodes } from "@/store";

import "react-h5-audio-player/lib/styles.css";
import styles from "./player.module.css";

import {
  LuArrowRightToLine,
  LuArrowLeftToLine,
  LuPause,
  LuPlay,
  LuVolumeX,
  LuVolume1,
} from "react-icons/lu";

import { isMobileDevice } from "@/lib";

const DEFAULT_VOLUME = isMobileDevice() ? 1.0 : 0.5;

interface PlayerProps {
  selectedGenre: string | undefined;
}

function Player({ selectedGenre }: PlayerProps) {
  const episodes = useEpisodes();
  const [isVisible, setIsVisible] = useState(false);

  // TODO: decide how to deal with this
  const playlist = episodes.filter(
    (episode) => episode.genre === selectedGenre
  );
  const playlistMedia = playlist.map((episode) => {
    return { src: episode.url };
  });
  // TODO: able to read return to right episode on subsequent session
  const intialTrackIndex = playlist.length
    ? Math.floor(Math.random() * playlist.length)
    : 0;

  const [activeTrackIndex, setActiveTrackIndex] = useState(intialTrackIndex);

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

  const handleClickNext = () => {
    console.log("click next");
    setActiveTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleClickPrevious = () => {
    console.log("click previous");
    setActiveTrackIndex((currentTrack) =>
      currentTrack > 0 ? currentTrack - 1 : 0
    );
  };

  const handleEnd = () => {
    console.log("media end");
    setActiveTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleOnPlay = () => {
    console.log("media play");
  };

  const handleError = (e: unknown) => {
    console.log("media error", e);
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      <AudioPlayer
        src={playlistMedia[activeTrackIndex]?.src}
        volume={DEFAULT_VOLUME}
        className="rounded-lg"
        showSkipControls
        showJumpControls={false}
        showDownloadProgress={false}
        onClickNext={handleClickNext}
        onClickPrevious={handleClickPrevious}
        onEnded={handleEnd}
        onPlay={handleOnPlay}
        onError={handleError}
        customAdditionalControls={[]}
        customIcons={{
          play: <LuPlay color="#fece02" size={30} />,
          pause: <LuPause color="#fece02" size={30} />,
          previous: <LuArrowLeftToLine color="#fece02" size={25} />,
          next: <LuArrowRightToLine color="#fece02" size={25} />,
          // loop: <LuRepeat1 color="#fff" size={25} />,
          // loopOff: <LuRepeat color="#fff" size={25} />,
          volume: <LuVolume1 color="#fece02" size={25} />,
          volumeMute: <LuVolumeX color="#fece02" size={25} />,
        }}
        // Try other props!
      />
    </div>
  );
}

export default Player;
