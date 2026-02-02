import { Navigate, useParams } from "react-router-dom";

import episodes from "@/assets/episodes.json";
import { type Episode } from "@/types/types";
import { AppProvider } from "@/contexts/AppContext";
import Hero from "@/components/Hero/Hero";
import Media from "@/components/Media/Media";
import SEOHead from "@/components/SEOHead/SEOHead";

const EpisodeRoute = () => {
  const { episodeNum } = useParams();
  const parsedEpisodeNum = Number(episodeNum);

  const episode = Number.isFinite(parsedEpisodeNum)
    ? (episodes as Episode[]).find(
        (item) => item.episodeNum === parsedEpisodeNum
      ) ?? null
    : null;

  if (!episode) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppProvider initialEpisodeNum={episode.episodeNum}>
      <SEOHead episode={episode} />
      <Hero />
      <Media initialEpisode={episode} />
    </AppProvider>
  );
};

export default EpisodeRoute;
