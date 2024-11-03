import { useMemo } from "react";
import { useEpisodes } from "@/contexts";

import styles from "./categoryselector.module.css";
import { shuffle } from "@/lib";

interface CategorySelectorProps {
  onShowCarousel: () => void;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function CategorySelector({
  onShowCarousel,
  setSelectedCategory,
}: CategorySelectorProps) {
  const episodes = useEpisodes();

  // Memoized filter calculation
  const categories = useMemo(() => {
    const categories = episodes.map((episode) => episode.mood);
    return shuffle(Array.from(new Set(categories)));
  }, [episodes]);

  const handleCategorySelect = (i: number) => {
    onShowCarousel();
    setSelectedCategory(categories[i]);
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
            className={styles.brick}
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
