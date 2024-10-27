import { useState } from "react";

import Slide from "./Slide";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";

import episodeList from "../../assets/episodes.json"; // Adjust the path as necessary
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./swiper.module.css";

import { type Episode } from "../../@types/types";

function EpisodeSelector() {
  const [episodes] = useState<Episode[]>(episodeList);

  // console.log(episodes);

  // const updateEpisodes = (newEpisodes: Episode[]) => {
  //   setEpisodes(newEpisodes);
  // };

  if (!episodes.length) return <div>Nothing found</div>;

  return (
    <div className={styles.container}>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={8}
        spaceBetween={330}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        // pagination={{ clickable: true }}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Navigation]}
        className={styles.swiper}
      >
        {episodes.map((episode) => (
          <SwiperSlide key={episode.episodeNum}>
            <Slide episode={episode} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default EpisodeSelector;
