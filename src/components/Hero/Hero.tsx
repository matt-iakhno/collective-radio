import styles from "./hero.module.css";
import AnimatedPath from "./AnimatedPath.tsx";

import { TfiMouse } from "react-icons/tfi";

const Hero = () => {
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
          <div className={styles.aurora}>
            <div className={styles.aurora__item}></div>
            <div className={styles.aurora__item}></div>
            <div className={styles.aurora__item}></div>
            <div className={styles.aurora__item}></div>
          </div>
        </h1>

        <div className={styles.scrollDown}>
          <span>
            Scroll <TfiMouse size={30} />
          </span>
        </div>
      </section>
    </AnimatedPath>
  );
};

export default Hero;
