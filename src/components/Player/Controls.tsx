import { useEffect, RefObject, useRef } from "react";
import { useEpisodes, usePlayer } from "@/contexts";
import { useMediaSessionHandlers } from "@/lib";
import { savePlayerState } from "@/lib/playerStorage";

import { LuPause, LuPlay } from "react-icons/lu";

import styles from "./player.module.css";

// how often the playback position is written to localStorage while playing
const SAVE_INTERVAL_MS = 5000;

interface ControlsProps {
  audioRef: RefObject<HTMLAudioElement>;
  progressBarRef: RefObject<HTMLInputElement>;
}

const Controls = ({ audioRef, progressBarRef }: ControlsProps) => {
  const { selectedEpisode } = useEpisodes();
  const { isPlaying, togglePlay, setIsPlaying, setDuration, timeProgress } =
    usePlayer();

  const selectedEpisodeRef = useRef(selectedEpisode);
  useEffect(() => {
    selectedEpisodeRef.current = selectedEpisode;
  }, [selectedEpisode]);

  // play/pause follows state; re-run on episode change so a new src keeps playing
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch((error: unknown) => {
        // AbortError: a new src interrupted this play(); this effect re-runs
        // for the new src. Anything else (e.g. autoplay blocked) means we
        // aren't actually playing.
        if (error instanceof Error && error.name === "AbortError") return;
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    }
  }, [isPlaying, selectedEpisode?.url, audioRef, setIsPlaying]);

  // The audio element is the source of truth for whether we're playing. It can
  // stop or start without our button: audio focus loss (calls, other apps),
  // the episode ending, headphones unplugged, lock-screen controls.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handlePlay = () => setIsPlaying(true);
    // also fires when an episode ends
    const handlePause = () => setIsPlaying(false);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [audioRef, setIsPlaying]);

  // Persist position and keep the lock-screen position in sync. These are audio
  // element events (not requestAnimationFrame), so they keep firing while the
  // app is in the background, and none of them re-render React.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let lastSave = 0;

    const persist = () => {
      const episode = selectedEpisodeRef.current;
      // before metadata loads, currentTime is 0 and the resume point hasn't
      // been applied yet: saving now would wipe the saved position
      if (!episode || audio.readyState < HTMLMediaElement.HAVE_METADATA) {
        return;
      }
      savePlayerState(episode, audio.currentTime);
      lastSave = Date.now();
    };

    const updatePositionState = () => {
      if (
        !("mediaSession" in navigator) ||
        !navigator.mediaSession.setPositionState
      ) {
        return;
      }
      const { duration, currentTime, playbackRate } = audio;
      if (!Number.isFinite(duration) || duration <= 0) return;
      try {
        navigator.mediaSession.setPositionState({
          duration,
          playbackRate: playbackRate || 1,
          position: Math.min(currentTime, duration),
        });
      } catch {
        // invalid state (e.g. mid-load); next event will retry
      }
    };

    const handleTimeUpdate = () => {
      if (Date.now() - lastSave >= SAVE_INTERVAL_MS) persist();
    };
    const handlePause = () => {
      persist();
      updatePositionState();
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") persist();
    };

    const positionEvents = ["play", "seeked", "ratechange", "durationchange"];

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("pause", handlePause);
    positionEvents.forEach((e) => audio.addEventListener(e, updatePositionState));
    window.addEventListener("pagehide", persist);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("pause", handlePause);
      positionEvents.forEach((e) =>
        audio.removeEventListener(e, updatePositionState)
      );
      window.removeEventListener("pagehide", persist);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [audioRef]);

  // record a play event every time new episode is slected and playback begins for the first time
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handlePlayOnce = () => {
      if (window.umami) {
        window.umami.track("play", {
          episodeNum: selectedEpisode?.episodeNum,
        });
      }
      audioElement.removeEventListener("play", handlePlayOnce);
    };

    // Attach the one-time event listener when the source changes
    audioElement.addEventListener("play", handlePlayOnce);

    // Cleanup in case the component unmounts or the src changes
    return () => {
      audioElement.removeEventListener("play", handlePlayOnce);
    };
  }, [selectedEpisode?.episodeNum, audioRef]);

  // hook for Media Session handlers for play/pause/scrubbing events on Mobile
  useMediaSessionHandlers(audioRef);

  const handleOnPlay = () => {
    if (!selectedEpisode) return;
    togglePlay();
  };

  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    const { duration } = audio;
    setDuration(duration);
    if (progressBarRef.current) {
      progressBarRef.current.max = duration.toString();
    }
    // bring back progress from state; the resulting seek updates the progress bar
    if (timeProgress && timeProgress < duration) {
      audio.currentTime = timeProgress;
    }
  };

  return (
    <div className={styles.mediaContainer}>
      <audio
        src={selectedEpisode?.url}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button
        className={`${styles.playIcon} ${
          selectedEpisode !== null ? styles.playActive : styles.playInactive
        }`}
        onClick={() => handleOnPlay()}
      >
        {isPlaying ? <LuPause size={30} /> : <LuPlay size={30} />}
      </button>
    </div>
  );
};

export default Controls;
