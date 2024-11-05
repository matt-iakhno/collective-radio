import { useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";

import styles from "./media.module.css";
// import Player from "../Player";

function Media() {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);

  return (
    <>
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
            <h3>Select a vibe:</h3>
          </section>

          <section className={styles.genreSelector}>
            <CategorySelector
              onShowCarousel={() => setIsCarouselVisible(true)}
            />
          </section>
          <section className={styles.carousel}>
            {isCarouselVisible && <EpisodeSelector />}
          </section>
        </div>
      </main>
      <section className={styles.playerContainer}>
        <Player />
        {/* <PlayerProvider>
          <Player
            selectedGenre={selectedCategory}
            selectedEpisode={selectedEpisode}
          />
        </PlayerProvider> */}
      </section>
    </>
  );
}

export default Media;
