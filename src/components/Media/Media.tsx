import { useState } from "react";

import EpisodeSelector from "../EpisodeSelector";
import GenreSelector from "../GenreSelector";
import Player from "../Player";

import { EpisodesProvider } from "../../store";

import styles from "./media.module.css";

function Media() {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );

  return (
    <main>
      <div>
        <div className={styles.a}></div>
        <div className={styles.circle}></div>
      </div>

      <div className={styles.content}>
        <section className={styles.about}>
          <h1>
            Born from friendship and a passion for sound, we&apos;re here to
            share the music that moves us — one mix at a time.
          </h1>
          <h3>Select...</h3>
        </section>

        <EpisodesProvider>
          <section className={styles.genreSelector}>
            <GenreSelector
              setSelectedGenre={setSelectedGenre}
              onShowCarousel={() => setIsCarouselVisible(true)}
            />
          </section>
          {isCarouselVisible && (
            <section className={styles.carousel}>
              <EpisodeSelector selectedGenre={selectedGenre} />
            </section>
          )}
          <section className={styles.playerContainer}>
            <Player />
          </section>
        </EpisodesProvider>
      </div>
    </main>
  );
}

export default Media;
