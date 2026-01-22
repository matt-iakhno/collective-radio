import { useState, useEffect } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";
import WaveSectionSeparator from "./WaveSectionSeparator";

import styles from "./media.module.css";

interface MediaProps {
  initialEpisodeNum?: number;
}

function Media({ initialEpisodeNum }: MediaProps) {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);

  // If initialEpisodeNum is provided, show carousel immediately
  useEffect(() => {
    if (initialEpisodeNum !== undefined) {
      setIsCarouselVisible(true);
    }
  }, [initialEpisodeNum]);

  return (
    <>
      <WaveSectionSeparator />
      <main>
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
            {isCarouselVisible && (
              <EpisodeSelector initialEpisodeNum={initialEpisodeNum} />
            )}
          </section>
        </div>
      </main>
      <section className={styles.playerContainer}>
        <Player />
      </section>
    </>
  );
}

export default Media;
