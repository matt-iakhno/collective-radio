import { useMemo } from "react";
import { useEpisodes, useGenre } from "@/contexts";

import styles from "./categoryselector.module.css";
// import { shuffle } from "@/lib";

interface CategorySelectorProps {
  onShowCarousel: () => void;
}

function CategorySelector({ onShowCarousel }: CategorySelectorProps) {
  const episodes = useEpisodes();
  const { selectedGenre, setSelectedGenre } = useGenre();

  // Memoized filter calculation
  const categories = useMemo(() => {
    const categories = episodes.episodes.map((episode) => episode.mood).sort();
    return Array.from(new Set(categories));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = (i: number) => {
    onShowCarousel();
    setSelectedGenre(categories[i]);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      {categories.map((category, i) => {
        return (
          <button
            className={`
              ${styles.brick}
              ${category === selectedGenre ? styles.active : ""}
            `}
            key={category}
            onClick={() => handleCategorySelect(i)}
          >
            <span className={styles.brickFront}>{category}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategorySelector;
