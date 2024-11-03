import { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";

import { useEpisodes } from "@/contexts";
import { Episode } from "@/types/types";

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
  selectedEpisode: number | undefined;
}

function Player({ selectedEpisode }: PlayerProps) {
  const episodes = useEpisodes();

  // TODO: able to read return to right episode on subsequent session
  const [currentTrack, setCurrentTrack] = useState<undefined | Episode>(
    undefined
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const source = episodes.find(
      (episode) => episode.episodeNum === selectedEpisode
    );
    setCurrentTrack(source);
  }, [selectedEpisode, episodes]);

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

  useEffect(() => {
    if ("mediaSession" in navigator && currentTrack) {
      const { episodeNum, artists, coverArt } = currentTrack;
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
            type: "image/jpeg",
          },
        ],
      });
    }
  }, [currentTrack]);

  const handleEnd = () => {
    //console.log("media end");
  };

  const handleOnPlay = () => {
    //console.log("media play");
  };

  const handleError = (e: unknown) => {
    console.log("media error", e);
  };

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      <AudioPlayer
        src={currentTrack?.url}
        volume={DEFAULT_VOLUME}
        className="rounded-lg"
        showSkipControls
        showJumpControls={false}
        showDownloadProgress={false}
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
