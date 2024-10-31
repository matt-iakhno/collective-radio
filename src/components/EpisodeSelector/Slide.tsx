import { type Episode } from "@/types/types";

import styles from "./slide.module.css";

import { PiPlayDuotone } from "react-icons/pi";

interface SlideProps {
  episode: Episode;
  playEpisode: (episodeNum: number) => void;
}

const Slide: React.FC<SlideProps> = ({ episode, playEpisode }) => {
  const playButtonClicked = () => {
    playEpisode(episode.episodeNum);
  };

  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={episode.coverArt}
        alt={`Episode ${episode.episodeNum} - ${episode.genre[0]} Cover`}
      />
      <button className={`${styles.play} `} onClick={() => playButtonClicked()}>
        <PiPlayDuotone size={150} />
      </button>
      <div className={styles.cardText}>
        <h2>{episode.genre}</h2>
        <p>
          {episode.artists[0]}
          {episode.artists[1] ? ` & ${episode.artists[1]}` : ""}
          <br />
        </p>
        <div>
          <div>
            <span>
              E
              {episode.episodeNum.toString().length === 1
                ? `0${episode.episodeNum}`
                : episode.episodeNum}
            </span>
            {/* <span>&cent;</span> */}
          </div>
          <div>
            <span>{episode.releaseDate.substring(8, 10)}</span>
            <span>{episode.releaseDate.substring(5, 7)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
