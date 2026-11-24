import { type Episode } from "@/types/types";

export const PLAYER_STATE_KEY = "playerState";

const canUseStorage = () =>
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

export const savePlayerState = (episode: Episode, timeProgress: number) => {
  if (!canUseStorage()) return;
  try {
    localStorage.setItem(
      PLAYER_STATE_KEY,
      JSON.stringify({ selectedEpisode: episode, timeProgress })
    );
  } catch {
    // storage full or disabled; resume position is best-effort
  }
};

export const loadPlayerState = (): {
  selectedEpisode: Episode;
  timeProgress: number;
} | null => {
  if (!canUseStorage()) return null;
  try {
    const saved = localStorage.getItem(PLAYER_STATE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};
