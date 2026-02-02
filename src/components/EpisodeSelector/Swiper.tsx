import { useMemo, useRef, useState } from "react";

import Slide from "./Slide";
import { useEpisodes, useGenre } from "@/contexts";
import { isMobileDevice } from "@/lib";

import { Swiper as SwiperLibrary, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-creative";
import "swiper/css/navigation";
import styles from "./swiper.module.css";

interface SwiperProps {
  targetEpisodeNum?: number;
}

const Swiper = ({ targetEpisodeNum }: SwiperProps) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const hasScrolledRef = useRef(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { episodes } = useEpisodes();
  const { selectedGenre } = useGenre();

  const filteredEpisodes = useMemo(() => {
    if (!selectedGenre) {
      return [];
    }
    return episodes.filter((episode) => episode.mood === selectedGenre);
  }, [selectedGenre, episodes]);

  const initialSlideIndex = useMemo(() => {
    if (!filteredEpisodes.length) {
      return 0;
    }
    if (targetEpisodeNum !== undefined) {
      const targetIndex = filteredEpisodes.findIndex(
        (episode) => episode.episodeNum === targetEpisodeNum
      );
      if (targetIndex >= 0) {
        return targetIndex;
      }
    }
    return Math.floor(Math.random() * filteredEpisodes.length);
  }, [filteredEpisodes, targetEpisodeNum]);

  return (
    <div className={styles.container}>
      <div className={styles.fadedEdges}>
        <div
          className={`${styles.carouselContainer} ${
            isVisible ? styles.fadeIn : ""
          }`}
        >
          <SwiperLibrary
            key={`${selectedGenre ?? "empty"}-${targetEpisodeNum ?? "random"}`}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onInit={(swiper) => {
              setIsVisible(true);
              swiper.slideTo(initialSlideIndex, 0);
              if (targetEpisodeNum !== undefined && !hasScrolledRef.current) {
                hasScrolledRef.current = true;
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: "smooth",
                });
              }
            }}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={50}
            initialSlide={initialSlideIndex}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: isMobileDevice() ? 6 : 3,
              slideShadows: false,
            }}
            mousewheel={{
              thresholdDelta: 70,
            }}
            navigation={true}
            modules={[Navigation, EffectCoverflow]}
            effect="coverflow"
            className={styles.swiper}
          >
            {filteredEpisodes.length &&
              filteredEpisodes.map((episode) => (
                <SwiperSlide
                  className={styles.swiperSlide}
                  key={episode.episodeNum}
                >
                  <Slide episode={episode} />
                </SwiperSlide>
              ))}
          </SwiperLibrary>
        </div>
      </div>
    </div>
  );
};

export default Swiper;
