import { useEffect, useRef, useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";

import styles from "./media.module.css";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import RINGS from "vanta/dist/vanta.rings.min";

function Media() {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);

  const [vantaEffect, setVantaEffect] = useState(null);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        RINGS({
          el: myRef.current,
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <>
      <main>
        <div ref={myRef}>
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
        </div>
        {/* <div>
          <div className={styles.a}></div>
          <div className={styles.circle}></div>
        </div> */}
      </main>
      <section className={styles.playerContainer}>
        <Player />
      </section>
    </>
  );
}

export default Media;
