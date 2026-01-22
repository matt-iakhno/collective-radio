import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts";

// Component to sync URL with selected episode
const UrlSync = () => {
  const { state } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we're currently on an episode route
    const episodeRouteMatch = location.pathname.match(/^\/(\d+)$/);
    const currentRouteEpisodeNum = episodeRouteMatch ? parseInt(episodeRouteMatch[1], 10) : null;

    // If we're on an episode route, the route is the source of truth
    // Don't navigate away from it based on state - let EpisodePage handle state updates
    if (currentRouteEpisodeNum !== null) {
      return;
    }

    // if we're NOT on an episode route (e.g., on home page "/")
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
