import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Hero from "./components/Hero";
import Media from "./components/Media";
import EpisodePage from "./pages/EpisodePage";
import UrlSync from "./components/UrlSync";
import HomeMeta from "./components/HomeMeta";

import "@fontsource/goldman/400.css";
import "@fontsource/goldman/700.css";
import "@fontsource/monoton";

import "./reset.css";
import "./App.css";

import { AppProvider, useEpisodes } from "@/contexts/AppContext";
import useAppHeight from "./lib/useAppHeight";

function App() {
  useAppHeight();

  return (
    <AppProvider>
      <HelmetProvider>
        <BrowserRouter>
          <UrlSync />
          <Hero />
          <MediaContainer />
        </BrowserRouter>
      </HelmetProvider>
    </AppProvider>
  );
}

function MediaContainer() {
  const { episodeNum } = useParams<{ episodeNum: string }>();
  const initialEpisodeNum = episodeNum ? parseInt(episodeNum, 10) : undefined;

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeMeta />} />
        <Route path="/:episodeNum" element={<EpisodeMeta />} />
      </Routes>
      
      <Media initialEpisodeNum={isNaN(initialEpisodeNum!) ? undefined : initialEpisodeNum} />
      
      <Routes>
        <Route path="/:episodeNum" element={<EpisodePage />} />
      </Routes>
    </>
  );
}

function EpisodeMeta() {
  const { episodeNum } = useParams<{ episodeNum: string }>();
  const { episodes } = useEpisodes();

  if (!episodeNum) return null;
  const episodeNumber = parseInt(episodeNum, 10);
  const episode = episodes.find((ep) => ep.episodeNum === episodeNumber);
  if (!episode) return null;

  const episodeTitle = `Collective Radio Vol. ${episode.episodeNum} - ${episode.artists.join(" & ")} [${episode.genre}]`;
  const episodeDescription = `Listen to Collective Radio Vol. ${episode.episodeNum} by ${episode.artists.join(" & ")} - ${episode.genre} mix. Released ${episode.releaseDate}.`;
  const ogImageUrl = `https://og-image.collectiveradio.com/${episode.episodeNum}`;
  const episodeUrl = `https://www.collectiveradio.com/${episode.episodeNum}`;

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
    <Helmet>
      <title>{episodeTitle}</title>
      <meta name="description" content={episodeDescription} />
      <link rel="canonical" href={episodeUrl} />
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
      <meta property="og:type" content="music.song" />
      <meta property="og:title" content={episodeTitle} />
      <meta property="og:description" content={episodeDescription} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={episodeUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={episodeTitle} />
      <meta name="twitter:description" content={episodeDescription} />
      <meta name="twitter:image" content={ogImageUrl} />
    </Helmet>
  );
}

export default App;
