import { useMemo } from "react";
import { useEpisodes } from "../../store";
interface GenreSelectorProps {
  onShowCarousel: () => void;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string | undefined>>;
}

function GenreSelector({
  onShowCarousel,
  setSelectedGenre,
}: GenreSelectorProps) {
  const episodes = useEpisodes();

  // Memoized filter calculation
  const genres = useMemo(() => {
    const genres = episodes.map((episode) => episode.genre);
    return Array.from(new Set(genres));
  }, [episodes]);

  const handleGenreSelect = (i: number) => {
    onShowCarousel();
    setSelectedGenre(genres[i]);
  };

  return (
    <>
      {genres.map((genre, i) => {
        return (
          <button key={genre} onClick={() => handleGenreSelect(i)}>
            {genre}
          </button>
        );
      })}
    </>
  );
}

export default GenreSelector;
