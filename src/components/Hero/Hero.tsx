import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./hero.module.css";
import AnimatedPath from "./AnimatedPath.tsx";

import { TfiMouse } from "react-icons/tfi";

const Hero = () => {
  const { episodeNum } = useParams();
  const [isScrollDownVisible, setIsScrollDownVisible] = useState(true);

  useEffect(() => {
    if (episodeNum) {
      setIsScrollDownVisible(false);
      return;
    }
    const handleScroll = () => {
      // Hide when scrolled down at least 100px
      setIsScrollDownVisible(window.scrollY < 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [episodeNum]);

  return (
    <AnimatedPath>
      <section className={styles.hero}>
        <div className={styles.topSection}>
          <img
            src="/collective_radio_spinning_logo.gif"
            alt="Logo"
            width="200px"
            height="200px"
            className={styles.logo}
          />
        </div>

        <h1 className={styles.title}>
          Collective Radio
          <div className={styles.blob}>
            <div className={styles.blobCorner}></div>
            <div className={styles.blobCorner}></div>
            <div className={styles.blobCorner}></div>
            <div className={styles.blobCorner}></div>
          </div>
        </h1>

        <div
          className={`${styles.scrollDown} ${
            !isScrollDownVisible ? styles.hidden : ""
          }`}
        >
          <span>
            Scroll <TfiMouse size={30} />
          </span>
        </div>
      </section>
    </AnimatedPath>
  );
};

export default Hero;
