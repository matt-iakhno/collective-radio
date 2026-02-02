import { useEffect, useRef, useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";
import WaveSectionSeparator from "./WaveSectionSeparator";

import { type Episode } from "@/types/types";
import styles from "./media.module.css";

interface MediaProps {
  initialEpisode?: Episode;
}

function Media({ initialEpisode }: MediaProps) {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(
    Boolean(initialEpisode)
  );
  const [isSwiperReady, setIsSwiperReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const hasScrolledRef = useRef(false);

  useEffect(() => {
    if (!initialEpisode) {
      return;
    }
    if (!isSwiperReady || !isPlayerReady) {
      return;
    }
    if (hasScrolledRef.current) {
      return;
    }
    hasScrolledRef.current = true;
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, [initialEpisode, isPlayerReady, isSwiperReady]);

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
              <EpisodeSelector
                targetEpisodeNum={initialEpisode?.episodeNum}
                onInitialized={() => setIsSwiperReady(true)}
              />
            )}
          </section>
        </div>
      </main>
      <section className={styles.playerContainer}>
        <Player
          forceVisible={Boolean(initialEpisode)}
          onVisible={() => setIsPlayerReady(true)}
        />
      </section>
    </>
  );
}

export default Media;
