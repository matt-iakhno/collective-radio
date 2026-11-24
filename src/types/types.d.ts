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
  // position to resume from when the selected episode loads (not live playback time)
  timeProgress: number | null;
  duration: number | null;
};

export enum ActionTypes {
  SET_EPISODES = "SET_EPISODES",
  SET_SELECTED_GENRE = "SET_SELECTED_GENRE",
  SET_SELECTED_EPISODE = "SET_SELECTED_EPISODE",
  SET_DURATION = "SET_DURATION",
  TOGGLE_PLAY = "TOGGLE_PLAY",
  SET_PLAYING = "SET_PLAYING",
}

interface SetSelectedGenreAction {
  type: ActionTypes.SET_SELECTED_GENRE;
  payload: string | null;
}
interface SetSelectedEpisodeAction {
  type: ActionTypes.SET_SELECTED_EPISODE;
  payload: Episode | null;
}
interface SetDurationAction {
  type: ActionTypes.SET_DURATION;
  payload: number | null;
}
interface TogglePlayAction {
  type: ActionTypes.TOGGLE_PLAY;
}
interface SetPlayingAction {
  type: ActionTypes.SET_PLAYING;
  payload: boolean;
}
export type AppAction =
  | SetSelectedGenreAction
  | SetSelectedEpisodeAction
  | SetDurationAction
  | TogglePlayAction
  | SetPlayingAction;