import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts";

// Component to sync URL with selected episode
const UrlSync = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  const isOnHomepage = useRef(location.pathname === "/");

  useEffect(() => {
    // Update ref when pathname changes
    isOnHomepage.current = location.pathname === "/";

    // PRIORITY 1: If we're on the homepage, never redirect away from it
    // This must be checked first to prevent localStorage state from overriding user's navigation to "/"
    // The selectedEpisode stays in state for the Player component to use, but we don't navigate
    if (location.pathname === "/" || isOnHomepage.current) {
      return;
    }

    // PRIORITY 2: Check if we're currently on an episode route
    const episodeRouteMatch = location.pathname.match(/^\/(\d+)$/);
    const currentRouteEpisodeNum = episodeRouteMatch ? parseInt(episodeRouteMatch[1], 10) : null;

    // If we're on an episode route, the route is the source of truth
    // Don't navigate away from it based on state - let EpisodePage handle state updates
    if (currentRouteEpisodeNum !== null) {
      return;
    }

    // PRIORITY 3: If we're NOT on an episode route and NOT on homepage
    // Only sync URL if we have a selected episode
    if (state.selectedEpisode) {
      const expectedPath = `/${state.selectedEpisode.episodeNum}`;
      // Only navigate if we're not already on the correct route
      if (location.pathname !== expectedPath) {
        navigate(expectedPath, { replace: true });
      }
    }
    // If no episode selected and we're on an invalid route, navigate home
    else if (location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [state.selectedEpisode, navigate, location.pathname]);

  return null;
};

export default UrlSync;
