import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEpisodes, useGenre, usePlayer } from "@/contexts";
import { type Episode } from "@/types/types";

function EpisodePage() {
  const { episodeNum } = useParams<{ episodeNum: string }>();
  const { episodes, selectedEpisode, setSelectedEpisode } = useEpisodes();
  const { setSelectedGenre } = useGenre();
  const { setTimeProgress } = usePlayer();

  useEffect(() => {
    if (!episodeNum) return;

    const episodeNumber = parseInt(episodeNum, 10);
    if (isNaN(episodeNumber)) return;

    const episode = episodes.find((ep: Episode) => ep.episodeNum === episodeNumber);

    if (episode) {
      // Only update state if the episode has changed to prevent infinite loops
      if (selectedEpisode?.episodeNum !== episode.episodeNum) {
        setTimeProgress(0);
        setSelectedGenre(episode.mood);
        setSelectedEpisode(episode);

        // Immediately update localStorage to prevent UrlSync from redirecting
        // to a previously saved episode
        localStorage.setItem(
          "playerState",
          JSON.stringify({
            selectedEpisode: episode,
            timeProgress: null, // Reset time progress when navigating to new episode
          })
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [episodeNum, episodes, selectedEpisode?.episodeNum]);

  // Check if episode exists
  if (!episodeNum) {
    return null;
  }

  const episodeNumber = parseInt(episodeNum, 10);
  if (isNaN(episodeNumber)) {
    return null;
  }

  const episode = episodes.find((ep: Episode) => ep.episodeNum === episodeNumber);
  if (!episode) {
    return null;
  }

  // Auto-scroll to player after a short delay to allow rendering
  useEffect(() => {
    const timer = setTimeout(() => {
      const playerElement = document.querySelector('[class*="playerContainer"]');
      if (playerElement) {
        playerElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [episode]);

  return null;
}

export default EpisodePage;
