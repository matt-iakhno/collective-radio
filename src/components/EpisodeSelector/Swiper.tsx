import { useState, useEffect } from "react";

import Slide from "./Slide";
import { useEpisodes } from "../../store";
import { type Episode } from "../../@types/types";

import { Swiper as SwiperLibrary, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./swiper.module.css";

interface SwiperProps {
  selectedGenre: string | undefined;
}

function Swiper({ selectedGenre }: SwiperProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [filteredEpisodes, setFilteredEpisodes] = useState<Episode[] | []>([]);
  const episodes = useEpisodes();

  useEffect(() => {
    if (selectedGenre) {
      const genreEpisodes = episodes.filter(
        (episode) => episode.genre === selectedGenre
      );
      setFilteredEpisodes(genreEpisodes);
    }
  }, [selectedGenre, episodes]);

  console.log(selectedGenre, filteredEpisodes);

  // const updateEpisodes = (newEpisodes: Episode[]) => {
  //   setEpisodes(newEpisodes);
  // };

  if (!episodes.length) return <div>Nothing found</div>;
  if (selectedGenre && !filteredEpisodes)
    return <div>No matches for this genre</div>;

  return (
    <div className={styles.container}>
      <div
        className={`${styles.carouselContainer} ${
          isVisible ? styles.fadeIn : ""
        }`}
      >
        <SwiperLibrary
          effect={"coverflow"}
          onInit={() => setIsVisible(true)}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={2}
          spaceBetween={20}
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
            slideShadows: true,
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
                <Slide episode={episode} />
              </SwiperSlide>
            ))}
          {!filteredEpisodes.length &&
            episodes.map((episode) => (
              <SwiperSlide key={episode.episodeNum}>
                <Slide episode={episode} />
              </SwiperSlide>
            ))}
        </SwiperLibrary>
      </div>
    </div>
  );
}

export default Swiper;
