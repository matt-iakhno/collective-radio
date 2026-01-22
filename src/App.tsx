import Hero from "./components/Hero";
import Media from "./components/Media";

import "@fontsource/goldman/400.css";
import "@fontsource/goldman/700.css";
import "@fontsource/monoton";

import "./reset.css";
import "./App.css";

import { AppProvider } from "@/contexts/AppContext";
import useAppHeight from "./lib/useAppHeight";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useEpisodes, useGenre } from "@/contexts";

function EpisodeRoute() {
  const { episodeNumber } = useParams<{ episodeNumber: string }>();
  const { episodes, setSelectedEpisode, selectedEpisode } = useEpisodes();
  const { setSelectedGenre } = useGenre();
  const [carouselVisible, setCarouselVisible] = useState(false);

  useEffect(() => {
    if (episodeNumber) {
      const episodeNum = parseInt(episodeNumber, 10);

      // Validate episode number is between 1-101
      if (isNaN(episodeNum) || episodeNum < 1 || episodeNum > 101) {
        return; // Let the route handle invalid episodes
      }

      // Find the episode
      const episode = episodes.find(ep => ep.episodeNum === episodeNum);
      if (episode) {
        // Set the genre first
        setSelectedGenre(episode.mood);
        // Then set the selected episode
        setSelectedEpisode(episode);
        // Show the carousel
        setCarouselVisible(true);
      }
    }
  }, [episodeNumber, episodes, setSelectedEpisode, setSelectedGenre]);

  // Smooth scroll to bottom when carousel becomes visible
  useEffect(() => {
    if (carouselVisible) {
      // Add a small delay to ensure the carousel has rendered
      const scrollTimeout = setTimeout(() => {
        const startPosition = window.pageYOffset;
        const targetPosition = document.documentElement.scrollHeight - window.innerHeight;
        const distance = targetPosition - startPosition;
        const duration = 1000; // 1 second
        let startTime: number | null = null;

        // Easing function for smooth animation (ease-out cubic)
        const easeOutCubic = (t: number): number => {
          return 1 - Math.pow(1 - t, 3);
        };

        const scrollAnimation = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);

          const easedProgress = easeOutCubic(progress);
          const currentPosition = startPosition + (distance * easedProgress);

          window.scrollTo(0, currentPosition);

          if (progress < 1) {
            requestAnimationFrame(scrollAnimation);
          }
        };

        requestAnimationFrame(scrollAnimation);
      }, 100); // Small delay to ensure carousel is rendered

      return () => clearTimeout(scrollTimeout);
    }
  }, [carouselVisible]);

  // Update document title for SEO when episode is selected
  useEffect(() => {
    if (selectedEpisode) {
      const artists = selectedEpisode.artists.join(', ');
      const title = `Collective Radio Ep ${selectedEpisode.episodeNum} - ${artists} - ${selectedEpisode.genre}`;
      document.title = title;
    }

    // Cleanup: reset title when component unmounts or episode changes
    return () => {
      document.title = 'Collective Radio';
    };
  }, [selectedEpisode]);

  // Check if episode number is valid
  const episodeNum = parseInt(episodeNumber || '', 10);
  if (isNaN(episodeNum) || episodeNum < 1 || episodeNum > 101) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Hero />
      <Media carouselVisible={carouselVisible} setCarouselVisible={setCarouselVisible} />
    </>
  );
}

function App() {
  useAppHeight();

  // Reset title to default when not on episode route
  useEffect(() => {
    document.title = 'Collective Radio';
  }, []);

  return (
    <AppProvider>
      <Routes>
        <Route path="/:episodeNumber" element={<EpisodeRoute />} />
        <Route path="/" element={
          <>
            <Hero />
            <Media />
          </>
        } />
      </Routes>
    </AppProvider>
  );
}

export default App;
