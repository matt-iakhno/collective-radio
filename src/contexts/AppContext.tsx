/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useReducer,
  useMemo,
  ReactNode,
  useContext,
  useEffect,
  useCallback,
} from "react";

import { appReducer, initialState } from "@/contexts/reducers";
import { AppState, AppAction, ActionTypes, Episode } from "@/types/types.d";

import { loadPlayerState, savePlayerState } from "@/lib/playerStorage";

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

    const saved = loadPlayerState();
    if (saved) {
      return {
        ...initialState,
        episodes: memoizedEpisodes,
        selectedEpisode: saved.selectedEpisode,
        timeProgress: saved.timeProgress,
      };
    }
    return {
      ...initialState,
      episodes: memoizedEpisodes,
    };
  }, [memoizedEpisodes, initialEpisodeNum]);

  const [state, dispatch] = useReducer(appReducer, savedState);

  // Persist when the selected episode changes. The live playback position is
  // persisted (throttled) by the player itself, from the audio element's events.
  useEffect(() => {
    if (!state.selectedEpisode) {
      return;
    }
    savePlayerState(state.selectedEpisode, state.timeProgress ?? 0);
  }, [state.selectedEpisode, state.timeProgress]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <AppContext.Provider value={value}>
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
  const setSelectedEpisode = useCallback(
    (episode: Episode | null) =>
      dispatch({ type: ActionTypes.SET_SELECTED_EPISODE, payload: episode }),
    [dispatch]
  );
  return {
    episodes: state.episodes,
    selectedEpisode: state.selectedEpisode,
    setSelectedEpisode,
  };
};

export const useGenre = () => {
  const { state, dispatch } = useAppContext();
  const setSelectedGenre = useCallback(
    (genre: string) =>
      dispatch({ type: ActionTypes.SET_SELECTED_GENRE, payload: genre }),
    [dispatch]
  );
  return {
    selectedGenre: state.selectedGenre,
    setSelectedGenre,
  };
};

export const usePlayer = () => {
  const { state, dispatch } = useAppContext();
  // stable callbacks so effects depending on them don't re-run every render
  const togglePlay = useCallback(
    () => dispatch({ type: ActionTypes.TOGGLE_PLAY }),
    [dispatch]
  );
  const setIsPlaying = useCallback(
    (playing: boolean) =>
      dispatch({ type: ActionTypes.SET_PLAYING, payload: playing }),
    [dispatch]
  );
  const setDuration = useCallback(
    (duration: number) =>
      dispatch({ type: ActionTypes.SET_DURATION, payload: duration }),
    [dispatch]
  );

  return {
    selectedEpisode: state.selectedEpisode,
    isPlaying: state.isPlaying,
    togglePlay,
    setIsPlaying,
    // resume point for the selected episode, not live playback time
    timeProgress: state.timeProgress,
    duration: state.duration,
    setDuration,
  };
};
