import { useEffect } from "react";
import { type Episode } from "@/types/types";

interface SEOHeadProps {
  episode?: Episode;
}

const SEOHead = ({ episode }: SEOHeadProps) => {
  useEffect(() => {
    const isEpisode = Boolean(episode);
    const artists = episode?.artists.join(" & ") ?? "";
    const title = isEpisode
      ? `Collective Radio Ep ${episode?.episodeNum} - ${artists} - ${episode?.genre}`
      : "Collective Radio";
    const description = isEpisode
      ? `Listen to Collective Radio Vol. ${episode?.episodeNum} by ${artists} - ${episode?.genre} mix. Released ${episode?.releaseDate}.`
      : "A multi-genre DJ mix podcast based in Vancouver, Canada.";
    const ogImageUrl = isEpisode
      ? `https://og-image.collectiveradio.com/${episode?.episodeNum}`
      : "https://www.collectiveradio.com/og-image.jpg";
    const baseUrl = "https://www.collectiveradio.com";
    const pageUrl = isEpisode
      ? `${baseUrl}/${episode?.episodeNum}`
      : `${baseUrl}/`;

    document.title = title;

    const setMetaTag = (
      attributes: Record<string, string>,
      content: string
    ) => {
      const selector = Object.entries(attributes)
        .map(([key, value]) => `meta[${key}="${value}"]`)
        .join("");
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => {
          element?.setAttribute(key, value);
        });
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector<HTMLLinkElement>(
        `link[rel="${rel}"]`
      );
      if (!element) {
        element = document.createElement("link");
        element.setAttribute("rel", rel);
        document.head.appendChild(element);
      }
      element.setAttribute("href", href);
    };

    setMetaTag({ name: "description" }, description);
    setMetaTag({ property: "og:title" }, title);
    setMetaTag({ property: "og:description" }, description);
    setMetaTag({ property: "og:image" }, ogImageUrl);
    setMetaTag({ property: "og:url" }, pageUrl);
    setMetaTag({ property: "og:type" }, isEpisode ? "article" : "website");
    setMetaTag({ name: "twitter:card" }, "summary_large_image");
    setMetaTag({ name: "twitter:title" }, title);
    setMetaTag({ name: "twitter:description" }, description);
    setMetaTag({ name: "twitter:image" }, ogImageUrl);
    setLinkTag("canonical", pageUrl);

    const scriptId = "episode-jsonld";
    const existingScript =
      document.getElementById(scriptId) as HTMLScriptElement | null;

    if (isEpisode && episode) {
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
        url: pageUrl,
        image: ogImageUrl,
        audio: episode.url,
        partOfSeries: {
          "@type": "PodcastSeries",
          name: "Collective Radio",
          url: "https://www.collectiveradio.com/",
        },
      };

      const script = existingScript ?? document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(structuredData);
      if (!existingScript) {
        document.head.appendChild(script);
      }
    } else if (existingScript) {
      existingScript.remove();
    }

  }, [episode]);

  return null;
};

export default SEOHead;
