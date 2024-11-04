import { useState, useEffect, useRef } from "react";

import Slide from "./Slide";
import { useEpisodes } from "@/contexts";
import { type Episode } from "@/types/types";

import { Swiper as SwiperLibrary, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./swiper.module.css";

interface SwiperProps {
  selectedCategory: string | undefined;
  setSelectedEpisode: (episodeNum: number) => void;
}

function Swiper({ selectedCategory, setSelectedEpisode }: SwiperProps) {
  const swiperRef = useRef<SwiperCore | null>(null);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[] | []>([]);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const episodes = useEpisodes();

  useEffect(() => {
    if (selectedCategory) {
      const genreEpisodes = episodes.filter(
        (episode) => episode.mood === selectedCategory
      );
      setFilteredEpisodes(genreEpisodes);
      setActiveIndex(Math.floor(Math.random() * genreEpisodes.length));
      goToSlide(activeIndex);

      // pick a random episode from this genre to set as the active slide
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, episodes]);

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.activeIndex);
  };

  const goToSlide = (index: number) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index);
    }
  };

  const playEpisode = (episodeNum: number) => {
    setSelectedEpisode(episodeNum);
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.carouselContainer} ${
          isVisible ? styles.fadeIn : ""
        }`}
      >
        <SwiperLibrary
          effect={"coverflow"}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onInit={() => setIsVisible(true)}
          onSlideChange={handleSlideChange}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={2}
          spaceBetween={0}
          initialSlide={activeIndex}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1566: {
              slidesPerView: 5,
              spaceBetween: 40,
            },
            1920: {
              slidesPerView: 6,
              spaceBetween: 60,
            },
          }}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 3,
            slideShadows: false,
          }}
          mousewheel={{
            thresholdDelta: 70,
          }}
          navigation={false}
          modules={[EffectCoverflow]}
          className={styles.swiper}
        >
          {filteredEpisodes.length &&
            filteredEpisodes.map((episode) => (
              <SwiperSlide key={episode.episodeNum}>
                <Slide episode={episode} playEpisode={playEpisode} />
              </SwiperSlide>
            ))}
        </SwiperLibrary>
      </div>
    </div>
  );
}

export default Swiper;
