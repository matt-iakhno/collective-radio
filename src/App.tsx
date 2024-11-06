import Hero from "./components/Hero";
import Media from "./components/Media";

import "@fontsource/goldman/400.css";
import "@fontsource/goldman/700.css";
import "@fontsource/monoton";

import "./reset.css";
import "./App.css";

import { AppProvider } from "@/contexts/AppContext";

function App() {
  return (
    <>
      <Hero />
      <AppProvider>
        <Media />
      </AppProvider>
    </>
  );
}

export default App;
