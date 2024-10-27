import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import styles from "./player.module.css";
import "./skin.css";
import {
  LuArrowRightToLine,
  LuArrowLeftToLine,
  LuPause,
  LuPlay,
  LuVolumeX,
  LuVolume1,
} from "react-icons/lu";

function Player() {
  const [playlist] = useState([
    { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
    { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
    { src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  ]);
  const [currentTrack, setTrackIndex] = useState(0);

  const handleClickNext = () => {
    console.log("click next");
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  const handleClickPrevious = () => {
    console.log("click previous");
    setTrackIndex((currentTrack) => (currentTrack > 0 ? currentTrack - 1 : 0));
  };

  const handleEnd = () => {
    console.log("media end");
    setTrackIndex((currentTrack) =>
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
    <div className={styles.container}>
      <AudioPlayer
        src={playlist[currentTrack].src}
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
          play: <LuPlay color="#fece02" size={25} />,
          pause: <LuPause color="#fece02" size={25} />,
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
