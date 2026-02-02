import { useState, useEffect, useRef, useCallback, useMemo } from "react";

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
  const { episodes } = useEpisodes();
  const { selectedGenre } = useGenre();

  // Memoize filtered episodes to avoid useEffect and double-renders/remounts
  const filteredEpisodes = useMemo(() => {
    if (!selectedGenre) return [];
    return episodes.filter((episode) => episode.mood === selectedGenre);
  }, [selectedGenre, episodes]);

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const goToSlide = useCallback((index: number, speed = 0) => {
    if (swiperRef.current) {
      swiperRef.current.slideTo(index, speed);
    }
  }, []);

  // Sync activeIndex when initialEpisodeNum changes via URL
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:SyncEffect',message:'Sync effect triggered',data:{filteredCount:filteredEpisodes.length,initialEpisodeNum,activeIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
    // #endregion
    if (filteredEpisodes.length === 0 || initialEpisodeNum === undefined) return;

    const foundIndex = filteredEpisodes.findIndex(
      (ep) => ep.episodeNum === initialEpisodeNum
    );
    
    if (foundIndex !== -1 && foundIndex !== activeIndex) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:SyncEffect',message:'Updating activeIndex',data:{foundIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
      // #endregion
      setActiveIndex(foundIndex);
      // Use a small delay to ensure Swiper has finished its own internal updates
      const timer = setTimeout(() => goToSlide(foundIndex, 0), 0);
      return () => clearTimeout(timer);
    }
  }, [filteredEpisodes, initialEpisodeNum, goToSlide]);

  // Handle random initial episode if none specified
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:RandomEffect',message:'Random effect triggered',data:{filteredCount:filteredEpisodes.length,initialEpisodeNum,activeIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
    // #endregion
    if (filteredEpisodes.length > 0 && initialEpisodeNum === undefined && activeIndex === 0) {
      const randomIndex = Math.floor(Math.random() * filteredEpisodes.length);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:RandomEffect',message:'Picking random index',data:{randomIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
      // #endregion
      setActiveIndex(randomIndex);
      const timer = setTimeout(() => goToSlide(randomIndex, 0), 0);
      return () => clearTimeout(timer);
    }
  }, [filteredEpisodes, initialEpisodeNum, goToSlide]);

  const handleSlideChange = (swiper: SwiperCore) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:handleSlideChange',message:'Slide change detected',data:{newIndex:swiper.activeIndex,currentIndex:activeIndex},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
    // #endregion
    if (swiper.activeIndex !== activeIndex) {
      setActiveIndex(swiper.activeIndex);
    }
  };

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7242/ingest/6ec78f2f-9210-4fec-a231-5c7cb60cd0b8',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Swiper.tsx:render',message:'Swiper render complete',data:{activeIndex,filteredCount:filteredEpisodes.length},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'FinalCheck'})}).catch(()=>{});
  });
  // #endregion

  return (
    <div className={styles.container}>
      <div className={styles.fadedEdges}>
        <div className={styles.carouselContainer + " " + styles.fadeIn}>
          <SwiperLibrary
            key={selectedGenre}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
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
            observer={true}
            observeParents={true}
            updateOnWindowResize={true}
          >
            {filteredEpisodes.map((episode) => (
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
