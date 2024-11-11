import { useEffect, useRef, useState } from "react";

import EpisodeSelector from "@/components/EpisodeSelector";
import CategorySelector from "@/components/CategorySelector";
import Player from "@/components/Player";

import styles from "./media.module.css";

function Media() {
  const [isCarouselVisible, setIsCarouselVisible] = useState<boolean>(false);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!divRef.current) return;

      const el = divRef.current;
      const { clientX: x, clientY: y } = e;
      const {
        top: t,
        left: l,
        width: w,
        height: h,
      } = el.getBoundingClientRect();

      el.style.setProperty("--posX", `${x - l - w / 2}`);
      el.style.setProperty("--posY", `${y - t - h / 2}`);
    };

    const divElement = divRef.current;
    divElement?.addEventListener("pointermove", handlePointerMove);

    return () => {
      divElement?.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <main>
        {/* <div>
          <div className={styles.a}></div>
          <div className={styles.circle}></div>
        </div> */}
        <div ref={divRef} className={styles.funky}>
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
      </main>
      <section className={styles.playerContainer}>
        <Player />
      </section>
    </>
  );
}

export default Media;
