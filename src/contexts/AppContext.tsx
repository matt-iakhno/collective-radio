/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useReducer,
  useMemo,
  useRef,
  useState,
  ReactNode,
  useContext,
} from "react";

import { appReducer, initialState } from "@/contexts/reducers";
import { AppState, AppAction, ActionTypes, Episode } from "@/types/types.d";

import episodes from "@/assets/episodes.json";

interface AppContextProps {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const memoizedEpisodes = useMemo(() => episodes as Episode[], []);

  const initialAppState: AppState = {
    ...initialState,
    episodes: memoizedEpisodes,
  };

  const [state, dispatch] = useReducer(appReducer, initialAppState);

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

// TODO: able to read return to right episode on subsequent session
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  return {
    selectedEpisode: state.selectedEpisode,
    isPlaying: state.isPlaying,
    togglePlay: () => dispatch({ type: ActionTypes.TOGGLE_PLAY }),
    audioRef,
    progressBarRef,
    timeProgress,
    setTimeProgress,
    duration,
    setDuration,
  };
};
