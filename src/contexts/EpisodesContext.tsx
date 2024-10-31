import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import episodeList from "@/assets/episodes.json";
import { type Episode } from "@/types/types";

const EpisodesContext = createContext<Episode[] | undefined>(undefined);

export const EpisodesProvider = ({ children }: { children: ReactNode }) => {
  const [episodes] = useState<Episode[]>(episodeList);

  // Memoize episodes to prevent unnecessary re-renders
  const memoizedEpisodes = useMemo(() => episodes, [episodes]);

  return (
    <EpisodesContext.Provider value={memoizedEpisodes}>
      {children}
    </EpisodesContext.Provider>
  );
};

// Custom hook to use the EpisodesContext
// eslint-disable-next-line react-refresh/only-export-components
export const useEpisodes = () => {
  const context = useContext(EpisodesContext);
  if (!context) {
    throw new Error("useEpisodes must be used within an EpisodesProvider");
  }
  return context;
};
