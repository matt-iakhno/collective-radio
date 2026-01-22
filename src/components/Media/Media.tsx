import { useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";
import WaveSectionSeparator from "./WaveSectionSeparator";

import styles from "./media.module.css";

interface MediaProps {
  carouselVisible?: boolean;
  setCarouselVisible?: (visible: boolean) => void;
}

function Media({ carouselVisible, setCarouselVisible }: MediaProps) {
  const [internalCarouselVisible, setInternalCarouselVisible] = useState<boolean>(false);

  // Use external state if provided, otherwise use internal state
  const isCarouselVisible = carouselVisible !== undefined ? carouselVisible : internalCarouselVisible;
  const handleSetCarouselVisible = setCarouselVisible || setInternalCarouselVisible;

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
              onShowCarousel={() => handleSetCarouselVisible(true)}
            />
          </section>
          <section className={styles.carousel}>
            {isCarouselVisible && <EpisodeSelector />}
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
