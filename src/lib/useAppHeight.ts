import { useEffect } from "react";

const useAppHeight = () => {
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
};

export default useAppHeight;
