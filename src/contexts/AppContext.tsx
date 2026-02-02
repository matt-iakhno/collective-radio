/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useReducer,
  useMemo,
  ReactNode,
  useContext,
  useEffect,
} from "react";

import {
  appReducer,
  initialState,
  createSetSelectedGenreAction,
  createSetSelectedEpisodeAction,
  createTogglePlayAction,
  createSetTimeProgressAction,
  createSetDurationAction,
} from "@/contexts/reducers";
import { AppState, AppAction, Episode } from "@/types/types.d";

import episodes from "@/assets/episodes.json";

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    umami: any;
  }
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const memoizedEpisodes = useMemo(() => episodes as Episode[], []);

  // check local storage to see if there was a previous episode playing
  const savedState = useMemo(() => {
    const saved = localStorage.getItem("playerState");
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialState,
        episodes: memoizedEpisodes,
        selectedEpisode: parsed.selectedEpisode,
        timeProgress: parsed.timeProgress,
      };
    }
    return {
      ...initialState,
      episodes: memoizedEpisodes,
    };
  }, [memoizedEpisodes]);

  const [state, dispatch] = useReducer(appReducer, savedState);

  // Save state changes to localStorage
  useEffect(() => {
    if (state.selectedEpisode) {
      localStorage.setItem(
        "playerState",
        JSON.stringify({
          selectedEpisode: state.selectedEpisode,
          timeProgress: state.timeProgress,
        })
      );
    }
  }, [state.selectedEpisode, state.timeProgress]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within an AppProvider");
  return context;
};

export const useEpisodes = () => {
  const { state, dispatch } = useAppContext();
  return {
    episodes: state.episodes,
    selectedEpisode: state.selectedEpisode,
    setSelectedEpisode: (episode: Episode | null) =>
      dispatch(createSetSelectedEpisodeAction(episode)),
  };
};

export const useGenre = () => {
  const { state, dispatch } = useAppContext();
  return {
    selectedGenre: state.selectedGenre,
    setSelectedGenre: (genre: string | null) =>
      dispatch(createSetSelectedGenreAction(genre)),
  };
};

export const usePlayer = () => {
  const { state, dispatch } = useAppContext();

  return {
    selectedEpisode: state.selectedEpisode,
    isPlaying: state.isPlaying,
    togglePlay: () => dispatch(createTogglePlayAction()),
    timeProgress: state.timeProgress,
    setTimeProgress: (progress: number) =>
      dispatch(createSetTimeProgressAction(progress)),
    duration: state.duration,
    setDuration: (duration: number) =>
      dispatch(createSetDurationAction(duration)),
  };
};
