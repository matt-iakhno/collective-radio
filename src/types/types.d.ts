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

export enum ActionTypes {
  SET_EPISODES = "SET_EPISODES",
  SET_SELECTED_GENRE = "SET_SELECTED_GENRE",
  SET_SELECTED_EPISODE = "SET_SELECTED_EPISODE",
  SET_TIME_PROGRESS = "SET_TIME_PROGRESS",
  SET_DURATION = "SET_DURATION",
  TOGGLE_PLAY = "TOGGLE_PLAY",
}

interface SetSelectedGenreAction {
  type: ActionTypes.SET_SELECTED_GENRE;
  payload: string | null;
}
interface SetSelectedEpisodeAction {
  type: ActionTypes.SET_SELECTED_EPISODE;
  payload: Episode | null;
}
interface SetTimeProgressAction {
  type: ActionTypes.SET_TIME_PROGRESS;
  payload: number | null;
}
interface SetDurationAction {
  type: ActionTypes.SET_DURATION;
  payload: number | null;
}
interface TogglePlayAction {
  type: ActionTypes.TOGGLE_PLAY;
}
export type AppAction =
  | SetSelectedGenreAction
  | SetSelectedEpisodeAction
  | SetTimeProgressAction
  | SetDurationAction
  | TogglePlayAction;