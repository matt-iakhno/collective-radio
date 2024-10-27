import { useState } from "react";
import AudioPlayer from "react-h5-audio-player";

import "react-h5-audio-player/lib/styles.css";
import "./playerskin.css";
import { FaPlaystation } from "react-icons/fa6";

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

  const handleEnd = () => {
    console.log("end");
    setTrackIndex((currentTrack) =>
      currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
    );
  };

  return (
    <div>
      <AudioPlayer
        src={playlist[currentTrack].src}
        showSkipControls
        onClickNext={handleClickNext}
        onEnded={handleEnd}
        onError={() => {
          console.log("play error");
        }}
        customIcons={{
          play: <FaPlaystation color="#e0e0e0" />,
        }}
        // Try other props!
      />
    </div>
  );
}

export default Player;
