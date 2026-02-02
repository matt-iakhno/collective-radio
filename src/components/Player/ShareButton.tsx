import { useEffect, useState } from "react";
import { LuShare2 } from "react-icons/lu";

import { type Episode } from "@/types/types";
import { isMobileDevice } from "@/lib";

import styles from "./player.module.css";

interface ShareButtonProps {
  episode: Episode | null;
}

const ShareButton = ({ episode }: ShareButtonProps) => {
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowToast(false);
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [showToast]);

  const buildShareUrl = () => {
    if (!episode) {
      return "";
    }
    return `${window.location.origin}/${episode.episodeNum}`;
  };

  const copyToClipboard = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  const handleShare = async () => {
    if (!episode) {
      return;
    }

    const shareUrl = buildShareUrl();

    if (isMobileDevice() && navigator.share) {
      try {
        await navigator.share({
          title: `Collective Radio Ep ${episode.episodeNum} - ${episode.genre}`,
          url: shareUrl,
        });
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
      }
    }

    await copyToClipboard(shareUrl);
    setShowToast(true);
  };

  return (
    <div className={styles.shareContainer}>
      <button
        className={styles.shareButton}
        onClick={handleShare}
        disabled={!episode}
        aria-label="Share episode"
      >
        <LuShare2 size={22} />
      </button>
      {showToast ? (
        <div className={styles.shareToast}>copied to clipboard</div>
      ) : null}
    </div>
  );
};

export default ShareButton;
