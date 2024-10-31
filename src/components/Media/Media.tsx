import { useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import GenreSelector from "@/components/GenreSelector";
import Player from "@/components/Player";

import { EpisodesProvider } from "@/contexts";

import styles from "./media.module.css";

function Media() {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(
    undefined
  );
  const [selectedEpisode, setSelectedEpisode] = useState<number | undefined>(
    undefined
  );

  return (
    <EpisodesProvider>
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

          <section className={styles.genreSelector}>
            <GenreSelector
              setSelectedGenre={setSelectedGenre}
              onShowCarousel={() => setIsCarouselVisible(true)}
            />
          </section>
          <section className={styles.carousel}>
            {isCarouselVisible && (
              <EpisodeSelector
                selectedGenre={selectedGenre}
                setSelectedEpisode={setSelectedEpisode}
              />
            )}
          </section>
        </div>
      </main>
      <section className={styles.playerContainer}>
        <Player
          selectedGenre={selectedGenre}
          selectedEpisode={selectedEpisode}
        />
      </section>
    </EpisodesProvider>
  );
}

export default Media;
