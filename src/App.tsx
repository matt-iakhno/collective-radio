import { useEffect } from "react";
import Hero from "./components/Hero";
import Media from "./components/Media";

import "@fontsource/goldman/400.css";
import "@fontsource/goldman/700.css";
import "@fontsource/monoton";

import "./reset.css";
import "./App.css";

import { AppProvider } from "@/contexts/AppContext";

function App() {
  // when the app is launched, calculate the app height
  // there is a known limitation with PWA where this doesn't get set
  // correctly on warm launches
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") setAppHeight();
    };

    setAppHeight();

    window.addEventListener("resize", setAppHeight);
    window.addEventListener("orientationchange", setAppHeight);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", setAppHeight);
      window.removeEventListener("orientationchange", setAppHeight);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <AppProvider>
      <Hero />

      <Media />
    </AppProvider>
  );
}

export default App;
