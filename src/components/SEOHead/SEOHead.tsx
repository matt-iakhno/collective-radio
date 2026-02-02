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
    const ogImageUrl = `https://og-image.collectiveradio.com/${episode.episodeNum}`;

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
    setMetaContent('meta[property="og:image"]', ogImageUrl);

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "PodcastEpisode",
      author: {
        "@type": "Organization",
        name: "Collective Radio",
      },
      creator: {
        "@type": "Organization",
        name: "Collective Radio",
      },
      name: title,
      description,
      episodeNumber: episode.episodeNum,
      datePublished: episode.releaseDate,
      url: window.location.href,
      image: ogImageUrl,
      audio: episode.url,
      partOfSeries: {
        "@type": "PodcastSeries",
        name: "Collective Radio",
        url: "https://www.collectiveradio.com/",
      },
    };

    const scriptId = "episode-jsonld";
    const existingScript =
      document.getElementById(scriptId) as HTMLScriptElement | null;
    const script =
      existingScript ?? document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    if (!existingScript) {
      document.head.appendChild(script);
    }
  }, [episode]);

  return null;
};

export default SEOHead;
