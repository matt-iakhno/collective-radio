import { type Episode } from "../../@types/types";

import styles from "./slide.module.css";

interface SlideProps {
  episode: Episode;
}

const Slide: React.FC<SlideProps> = ({ episode }) => {
  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={episode.coverArt}
        alt={`Episode ${episode.episodeNum} - ${episode.genre[0]} Cover`}
      />
      <div className={styles.cardText}>
        <h2>{episode.genre}</h2>
        <p>
          {episode.artists[0]}
          {episode.artists[1] ? ` & ${episode.artists[1]}` : ""}
          <br />
        </p>
        <div>
          <div>
            <span>{episode.episodeNum}</span>
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
