import { useEffect } from "react";
import { type Episode } from "@/types/types";

interface SEOHeadProps {
  episode: Episode;
}

const SEOHead = ({ episode }: SEOHeadProps) => {
  useEffect(() => {
    const artists = episode.artists.join(" & ");
    const title = `Collective Radio Ep ${episode.episodeNum} - ${artists} - ${episode.genre}`;
    const description = `Listen to Collective Radio Vol. ${episode.episodeNum} by ${artists} - ${episode.genre} mix. Released ${episode.releaseDate}.`;

    document.title = title;

    const setMetaContent = (selector: string, content: string) => {
      const element = document.querySelector<HTMLMetaElement>(selector);
      if (element) {
        element.setAttribute("content", content);
      }
    };

    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent(
      'meta[property="og:image"]',
      `https://og-image.collectiveradio.com/${episode.episodeNum}`
    );
  }, [episode]);

  return null;
};

export default SEOHead;
