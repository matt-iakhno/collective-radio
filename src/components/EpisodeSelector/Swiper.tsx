import { useState } from "react";

import Slide from "./Slide";

import { Swiper as SwiperLibrary, SwiperSlide } from "swiper/react";
import { EffectCoverflow } from "swiper/modules";

import episodeList from "../../assets/episodes.json"; // Adjust the path as necessary
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./swiper.module.css";

import { type Episode } from "../../@types/types";

function Swiper() {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [episodes] = useState<Episode[]>(episodeList);

  // console.log(episodes);

  // const updateEpisodes = (newEpisodes: Episode[]) => {
  //   setEpisodes(newEpisodes);
  // };

  if (!episodes.length) return <div>Nothing found</div>;

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
              slidesPerView: 3, // 1 slide per view on mobile
              spaceBetween: 20, // Smaller gap on mobile
            },
            1024: {
              slidesPerView: 4, // 2 slides per view on larger screens
              spaceBetween: 30,
            },
            1566: {
              slidesPerView: 5, // 2 slides per view on larger screens
              spaceBetween: 40,
            },
            1920: {
              slidesPerView: 6, // 2 slides per view on larger screens
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
          {episodes.map((episode) => (
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
