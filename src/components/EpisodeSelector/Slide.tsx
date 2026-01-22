import { useNavigate } from "react-router-dom";
import BlurhashImage from "./BlurhashImage";
import { type Episode } from "@/types/types";
import { useEpisodes, usePlayer } from "@/contexts";

import styles from "./slide.module.css";

interface SlideProps {
  episode: Episode;
}

const Slide = ({ episode }: SlideProps) => {
  const navigate = useNavigate();
  const episodes = useEpisodes();
  const { isPlaying, togglePlay } = usePlayer();

  const playButtonClicked = () => {
    // Navigate to episode route
    navigate(`/${episode.episodeNum}`);
    episodes.setSelectedEpisode(episode);
    if (!isPlaying) {
      togglePlay();
    }
  };

  return (
    <div className={styles.card}>
      <BlurhashImage
        src={episode.coverArt}
        alt={`Episode ${episode.episodeNum} - ${episode.genre[0]} Cover`}
        blurhash={episode.coverArtBlurhash}
        width={250}
        height={250}
      />
      <button className={styles.play} onClick={() => playButtonClicked()}>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="213.7px"
          height="213.7px"
          viewBox="0 0 213.7 213.7"
          enableBackground="new 0 0 213.7 213.7"
          xmlSpace="preserve"
        >
          <polygon
            className={styles.triangle}
            id="XMLID_18_"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            points="
          73.5,62.5 148.5,105.8 73.5,149.1 "
          />

          <circle
            className={styles.circle}
            id="XMLID_17_"
            fill="none"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit="10"
            cx="106.8"
            cy="106.8"
            r="103.3"
          />
        </svg>
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
          </div>
          <div>
            <div>
              <span>{episode.releaseDate.substring(8, 10)}</span>/
              <span>{episode.releaseDate.substring(5, 7)}</span>
            </div>
            <span>{episode.releaseDate.substring(0, 4)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Slide;
