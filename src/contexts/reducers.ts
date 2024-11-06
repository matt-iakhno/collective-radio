import { AppState, AppAction, ActionTypes } from '@/types/types.d';

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
      return { ...state, selectedGenre: action.payload };
    case ActionTypes.SET_SELECTED_EPISODE:
      return { ...state, selectedEpisode: action.payload };
    case ActionTypes.TOGGLE_PLAY:
      return { ...state, isPlaying: !state.isPlaying };
    case ActionTypes.SET_TIME_PROGRESS:
      return { ...state, timeProgress: action.payload };
    case ActionTypes.SET_DURATION:
      return { ...state, duration: action.payload };
    default:
      return state;
  }
};