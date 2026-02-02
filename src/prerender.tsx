import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "@/App";
import EpisodeRoute from "@/components/EpisodeRoute";
import episodes from "@/assets/episodes.json";
import { type Episode } from "@/types/types";

const BASE_URL = "https://www.collectiveradio.com";
const DEFAULT_TITLE = "Collective Radio";
const DEFAULT_DESCRIPTION =
  "A multi-genre DJ mix podcast based in Vancouver, Canada.";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

const getEpisodeMeta = (episode: Episode) => {
  const artists = episode.artists.join(" & ");
  return {
    title: `Collective Radio Ep ${episode.episodeNum} - ${artists} - ${episode.genre}`,
    description: `Listen to Collective Radio Vol. ${episode.episodeNum} by ${artists} - ${episode.genre} mix. Released ${episode.releaseDate}.`,
    ogImage: `https://og-image.collectiveradio.com/${episode.episodeNum}`,
    url: `${BASE_URL}/${episode.episodeNum}`,
    ogType: "article",
  };
};

const getMetaForUrl = (url: string) => {
  const match = url.match(/^\/(\d+)(\/)?$/);
  const episodeNum = match ? Number(match[1]) : null;
  const episode = Number.isFinite(episodeNum)
    ? (episodes as Episode[]).find(
        (item) => item.episodeNum === episodeNum
      ) ?? null
    : null;

  if (episode) {
    return getEpisodeMeta(episode);
  }

  return {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    ogImage: DEFAULT_OG_IMAGE,
    url: `${BASE_URL}/`,
    ogType: "website",
  };
};

export async function prerender(data: { url?: string }) {
  const url = data?.url ?? "/";
  const meta = getMetaForUrl(url);

  const html = renderToString(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:episodeNum" element={<EpisodeRoute />} />
      </Routes>
    </MemoryRouter>
  );

  return {
    html,
    head: {
      lang: "en",
      title: meta.title,
      elements: new Set([
        { type: "meta", props: { name: "description", content: meta.description } },
        { type: "meta", props: { property: "og:title", content: meta.title } },
        {
          type: "meta",
          props: { property: "og:description", content: meta.description },
        },
        { type: "meta", props: { property: "og:image", content: meta.ogImage } },
        { type: "meta", props: { property: "og:url", content: meta.url } },
        { type: "meta", props: { property: "og:type", content: meta.ogType } },
        {
          type: "meta",
          props: { name: "twitter:card", content: "summary_large_image" },
        },
        { type: "meta", props: { name: "twitter:title", content: meta.title } },
        {
          type: "meta",
          props: { name: "twitter:description", content: meta.description },
        },
        { type: "meta", props: { name: "twitter:image", content: meta.ogImage } },
        { type: "link", props: { rel: "canonical", href: meta.url } },
      ]),
    },
  };
}
