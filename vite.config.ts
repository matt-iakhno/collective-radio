import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { vitePrerenderPlugin } from "vite-prerender-plugin";

const BUILD_TIME_VALUE = JSON.stringify(Date.now());
const episodes = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, "src/assets/episodes.json"),
    "utf-8"
  )
) as { episodeNum: number }[];
const prerenderRoutes = [
  "/",
  ...episodes.map((episode) => `/${episode.episodeNum}`),
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/service-worker.js",
          dest: "",
          // 👇 Use a transform function to replace the placeholder
          transform: (content) => {
            return content
              .toString()
              .replace(/__BUILD_TIME__/g, BUILD_TIME_VALUE);
          },
        },
      ],
    }),
    vitePrerenderPlugin({
      renderTarget: "#root",
      prerenderScript: path.resolve(__dirname, "src/prerender.tsx"),
      additionalPrerenderRoutes: prerenderRoutes,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
      },
    }
  },
});
