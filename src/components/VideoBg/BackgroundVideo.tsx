import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { isMobileDevice } from "@/lib";

import styles from "./backgroundvideo.module.css";

interface BackgroundVideoProps {
  src: string;
  mobileSrc: string;
}

const BackgroundVideo = ({ src, mobileSrc }: BackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      const videoSrc = isMobileDevice() ? mobileSrc : src;

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = videoSrc;
      }
    }
  }, [src, mobileSrc]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      className={styles.backgroundVideo}
    />
  );
};

export default BackgroundVideo;
