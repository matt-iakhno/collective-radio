import { useState } from "react";
import { Blurhash } from "react-blurhash";
import styles from "./slide.module.css";

interface BlurhashImageProps {
  src: string;
  alt: string;
  blurhash: string;
  width: number;
  height: number;
}

const BlurhashImage = ({
  src,
  alt,
  blurhash,
  width,
  height,
}: BlurhashImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={styles.imageContainer}>
      {/* BlurHash Placeholder */}
      <Blurhash
        hash={blurhash}
        className={styles.image}
        width={width}
        height={height}
        style={{ opacity: isLoaded ? 0 : 1 }}
      />

      <img
        className={styles.image}
        src={src}
        alt={alt}
        style={{ opacity: isLoaded ? 1 : 0 }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

export default BlurhashImage;
