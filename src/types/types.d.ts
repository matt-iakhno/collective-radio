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
};

export enum ActionTypes {
  SET_EPISODES = "SET_EPISODES",
  SET_SELECTED_GENRE = "SET_SELECTED_GENRE",
  SET_SELECTED_EPISODE = "SET_SELECTED_EPISODE",
  TOGGLE_PLAY = "TOGGLE_PLAY"
}

interface SetSelectedGenreAction {
  type: ActionTypes.SET_SELECTED_GENRE;
  payload: string | null;
}
interface SetSelectedEpisodeAction {
  type: ActionTypes.SET_SELECTED_EPISODE;
  payload: Episode | null;
}
interface TogglePlayAction {
  type: ActionTypes.TOGGLE_PLAY;
}

export type AppAction =
  | SetSelectedGenreAction
  | SetSelectedEpisodeAction
  | TogglePlayAction;