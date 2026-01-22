export interface Episode {
  episodeNum: number;
  artists: string[];
  url: string;
  coverArt: string;
  releaseDate: string;
  genre: string;
  mood: string;
  coverArtBlurhash: string;
}

export type AppState = {
  episodes: Episode[];
  selectedGenre: string | null;
  selectedEpisode: Episode | null;
  isPlaying: boolean;
  timeProgress: number | null;
  duration: number | null;
};

export const ActionTypes = {
  SET_EPISODES: "SET_EPISODES",
  SET_SELECTED_GENRE: "SET_SELECTED_GENRE",
  SET_SELECTED_EPISODE: "SET_SELECTED_EPISODE",
  SET_TIME_PROGRESS: "SET_TIME_PROGRESS",
  SET_DURATION: "SET_DURATION",
  TOGGLE_PLAY: "TOGGLE_PLAY",
} as const;

export type ActionType = typeof ActionTypes[keyof typeof ActionTypes];

interface SetSelectedGenreAction {
  readonly type: typeof ActionTypes.SET_SELECTED_GENRE;
  readonly payload: string | null;
}
interface SetSelectedEpisodeAction {
  readonly type: typeof ActionTypes.SET_SELECTED_EPISODE;
  readonly payload: Episode | null;
}
interface SetTimeProgressAction {
  readonly type: typeof ActionTypes.SET_TIME_PROGRESS;
  readonly payload: number | null;
}
interface SetDurationAction {
  readonly type: typeof ActionTypes.SET_DURATION;
  readonly payload: number | null;
}
interface TogglePlayAction {
  readonly type: typeof ActionTypes.TOGGLE_PLAY;
}
export type AppAction =
  | SetSelectedGenreAction
  | SetSelectedEpisodeAction
  | SetTimeProgressAction
  | SetDurationAction
  | TogglePlayAction;