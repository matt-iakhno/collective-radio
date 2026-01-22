import { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEpisodes, useGenre, usePlayer } from "@/contexts";
import { type Episode } from "@/types/types";
import Hero from "@/components/Hero";
import Media from "@/components/Media";

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
    return <Navigate to="/" replace />;
  }

  const episodeNumber = parseInt(episodeNum, 10);
  if (isNaN(episodeNumber)) {
    return <Navigate to="/" replace />;
  }

  const episode = episodes.find((ep: Episode) => ep.episodeNum === episodeNumber);
  if (!episode) {
    return <Navigate to="/" replace />;
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

  const episodeTitle = `Collective Radio Vol. ${episode.episodeNum} - ${episode.artists.join(" & ")} [${episode.genre}]`;
  const episodeDescription = `Listen to Collective Radio Vol. ${episode.episodeNum} by ${episode.artists.join(" & ")} - ${episode.genre} mix. Released ${episode.releaseDate}.`;
  const ogImageUrl = `https://og-image.collectiveradio.com/${episode.episodeNum}`;
  const episodeUrl = `https://www.collectiveradio.com/${episode.episodeNum}`;

  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    "name": episodeTitle,
    "description": episodeDescription,
    "url": episodeUrl,
    "image": ogImageUrl,
    "datePublished": episode.releaseDate,
    "genre": episode.genre,
    "byArtist": {
      "@type": "MusicGroup",
      "name": episode.artists.join(" & ")
    },
    "inAlbum": {
      "@type": "MusicAlbum",
      "name": "Collective Radio",
      "albumReleaseType": "PodcastSeries"
    }
  };

  return (
    <>
      <Helmet>
        <title>{episodeTitle}</title>
        <meta name="description" content={episodeDescription} />
        <link rel="canonical" href={episodeUrl} />

        {/* Structured Data (JSON-LD) for SEO */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="music.song" />
        <meta property="og:title" content={episodeTitle} />
        <meta property="og:description" content={episodeDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={episodeUrl} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={episodeTitle} />
        <meta name="twitter:description" content={episodeDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>
      <Hero />
      <Media initialEpisodeNum={episodeNumber} />
    </>
  );
}

export default EpisodePage;
