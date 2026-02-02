/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useReducer,
  useMemo,
  ReactNode,
  useContext,
  useEffect,
} from "react";

import { appReducer, initialState } from "@/contexts/reducers";
import { AppState, AppAction, ActionTypes, Episode } from "@/types/types.d";

import episodes from "@/assets/episodes.json";

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

interface AppProviderProps {
  children: ReactNode;
  initialEpisodeNum?: number;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    umami: any;
  }
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({
  children,
  initialEpisodeNum,
}: AppProviderProps) => {
  const memoizedEpisodes = useMemo(() => episodes as Episode[], []);
  const canUseStorage =
    typeof window !== "undefined" && typeof window.localStorage !== "undefined";

  // check local storage to see if there was a previous episode playing
  const savedState = useMemo(() => {
    if (initialEpisodeNum !== undefined) {
      const matchedEpisode = memoizedEpisodes.find(
        (episode) => episode.episodeNum === initialEpisodeNum
      );
      if (matchedEpisode) {
        return {
          ...initialState,
          episodes: memoizedEpisodes,
          selectedGenre: matchedEpisode.mood,
          selectedEpisode: matchedEpisode,
          timeProgress: 0,
        };
      }
      return {
        ...initialState,
        episodes: memoizedEpisodes,
      };
    }

    if (canUseStorage) {
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
    }
    return {
      ...initialState,
      episodes: memoizedEpisodes,
    };
  }, [memoizedEpisodes, initialEpisodeNum]);

  const [state, dispatch] = useReducer(appReducer, savedState);

  // Save state changes to localStorage
  useEffect(() => {
    if (!canUseStorage || !state.selectedEpisode) {
      return;
    }
    localStorage.setItem(
      "playerState",
      JSON.stringify({
        selectedEpisode: state.selectedEpisode,
        timeProgress: state.timeProgress,
      })
    );
  }, [canUseStorage, state.selectedEpisode, state.timeProgress]);

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
      dispatch({ type: ActionTypes.SET_SELECTED_EPISODE, payload: episode }),
  };
};

export const useGenre = () => {
  const { state, dispatch } = useAppContext();
  return {
    selectedGenre: state.selectedGenre,
    setSelectedGenre: (genre: string) =>
      dispatch({ type: ActionTypes.SET_SELECTED_GENRE, payload: genre }),
  };
};

export const usePlayer = () => {
  const { state, dispatch } = useAppContext();

  return {
    selectedEpisode: state.selectedEpisode,
    isPlaying: state.isPlaying,
    togglePlay: () => dispatch({ type: ActionTypes.TOGGLE_PLAY }),
    timeProgress: state.timeProgress,
    setTimeProgress: (progress: number) =>
      dispatch({ type: ActionTypes.SET_TIME_PROGRESS, payload: progress }),
    duration: state.duration,
    setDuration: (duration: number) =>
      dispatch({ type: ActionTypes.SET_DURATION, payload: duration }),
  };
};
