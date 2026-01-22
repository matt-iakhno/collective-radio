import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Hero from "./components/Hero";
import Media from "./components/Media";
import EpisodePage from "./pages/EpisodePage";
import UrlSync from "./components/UrlSync";

import "@fontsource/goldman/400.css";
import "@fontsource/goldman/700.css";
import "@fontsource/monoton";

import "./reset.css";
import "./App.css";

import { AppProvider } from "@/contexts/AppContext";
import useAppHeight from "./lib/useAppHeight";

function App() {
  useAppHeight();

  return (
    <AppProvider>
      <HelmetProvider>
        <BrowserRouter>
          <UrlSync />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Media />
                </>
              }
            />
            <Route path="/:episodeNum" element={<EpisodePage />} />
          </Routes>
        </BrowserRouter>
      </HelmetProvider>
    </AppProvider>
  );
}

export default App;
