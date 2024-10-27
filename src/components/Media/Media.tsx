import EpisodeSelector from "../EpisodeSelector";
import GenreSelector from "../GenreSelector";
import Player from "../Player";

import styles from "./media.module.css";

function Media() {
  return (
    <main>
      <div>
        <div className={styles.a}></div>
        <div className={styles.circle}></div>
      </div>

      <div className={styles.content}>
        <section className={styles.about}>
          <h1>
            Born from friendship and a passion for sound, we’re here to share
            the music that moves us — one mix at a time.
          </h1>
          <h3>Select...</h3>
        </section>

        <section className={styles.genreSelector}>
          <GenreSelector />
        </section>

        <section className={styles.carousel}>
          <EpisodeSelector />
        </section>

        <section className={styles.playerContainer}>
          <Player />
        </section>
      </div>
    </main>
  );
}

export default Media;
