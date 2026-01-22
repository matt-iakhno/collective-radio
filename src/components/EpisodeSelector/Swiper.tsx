import { useState, useEffect, useRef, useCallback } from "react";

import Slide from "./Slide";
import { useEpisodes, useGenre } from "@/contexts";
import { type Episode } from "@/types/types";
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
  initialEpisodeNum?: number;
}

const Swiper = ({ initialEpisodeNum }: SwiperProps) => {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[] | []>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const { episodes } = useEpisodes();
  const { selectedGenre } = useGenre();

  // update carousel with active episodes whenever a new genre is selected
  useEffect(() => {
    if (selectedGenre) {
      const genreEpisodes = episodes.filter(
        (episode) => episode.mood === selectedGenre
      );
      setFilteredEpisodes(genreEpisodes);
    }
  }, [selectedGenre, episodes]);

  // go to a specific episode if initialEpisodeNum is provided, otherwise random
  useEffect(() => {
    if (filteredEpisodes.length === 0) return;

    let targetIndex = 0;
    if (initialEpisodeNum !== undefined) {
      // Find the index of the episode with the matching episodeNum
      const foundIndex = filteredEpisodes.findIndex(
        (ep) => ep.episodeNum === initialEpisodeNum
      );
      if (foundIndex !== -1) {
        targetIndex = foundIndex;
      } else {
        // If episode not found in filtered list, use random
        targetIndex = Math.floor(Math.random() * filteredEpisodes.length);
      }
    } else {
      // No initial episode specified, use random
      targetIndex = Math.floor(Math.random() * filteredEpisodes.length);
    }

    setActiveIndex(targetIndex);
    goToSlide(targetIndex);
  }, [filteredEpisodes, initialEpisodeNum]);

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.activeIndex);
  };

  const goToSlide = useCallback((index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.fadedEdges}>
        <div
          className={`${styles.carouselContainer} ${
            isVisible ? styles.fadeIn : ""
          }`}
        >
          <SwiperLibrary
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onInit={() => setIsVisible(true)}
            onSlideChange={handleSlideChange}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            spaceBetween={50}
            initialSlide={activeIndex}
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
