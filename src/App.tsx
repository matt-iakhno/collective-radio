import Hero from "./components/Hero";
import Media from "./components/Media";
import SEOHead from "./components/SEOHead";

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
      <SEOHead />
      <Hero />

      <Media />
    </AppProvider>
  );
}

export default App;
