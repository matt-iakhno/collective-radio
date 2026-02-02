import { AppState, AppAction, ActionTypes, Episode } from '@/types/types.d';

export const initialState: AppState = {
  episodes: [], // This will be overridden in AppContext.tsx
  selectedGenre: null,
  selectedEpisode: null,
  isPlaying: false,
  timeProgress: null,
  duration: null
};

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case ActionTypes.SET_SELECTED_GENRE:
      if (state.selectedGenre === action.payload) return state;
      return { ...state, selectedGenre: action.payload };
    case ActionTypes.SET_SELECTED_EPISODE:
      if (state.selectedEpisode?.episodeNum === action.payload?.episodeNum) return state;
      return { ...state, selectedEpisode: action.payload };
    case ActionTypes.TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying };
    case ActionTypes.SET_TIME_PROGRESS:
      if (state.timeProgress === action.payload) return state;
      return { ...state, timeProgress: action.payload };
    case ActionTypes.SET_DURATION:
      if (state.duration === action.payload) return state;
      return { ...state, duration: action.payload };
    default:
      return state;
  }
};

// Action creator functions for type-safe action creation
export const createSetSelectedGenreAction = (genre: string | null): AppAction => ({
  type: ActionTypes.SET_SELECTED_GENRE,
  payload: genre,
});

export const createSetSelectedEpisodeAction = (episode: Episode | null): AppAction => ({
  type: ActionTypes.SET_SELECTED_EPISODE,
  payload: episode,
});

export const createTogglePlayAction = (): AppAction => ({
  type: ActionTypes.TOGGLE_PLAY,
});

export const createSetTimeProgressAction = (progress: number | null): AppAction => ({
  type: ActionTypes.SET_TIME_PROGRESS,
  payload: progress,
});

export const createSetDurationAction = (duration: number | null): AppAction => ({
  type: ActionTypes.SET_DURATION,
  payload: duration,
});